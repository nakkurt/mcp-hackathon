"use server"

import { agentGroups } from "@/data/agent-groups"
import axios from "axios"
interface AnthropicMessage {
  role: "user" | "assistant"
  content: string
}

interface AnthropicRequest {
  model: string
  messages: AnthropicMessage[]
  system: string
  max_tokens: number
}

interface AnthropicResponse {
  id: string
  type: string
  role: string
  content: { type: string; text: string }[]
  model: string
  stop_reason: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

export async function sendMessageToAnthropic(groupId: string, message: string): Promise<string> {
  try {
    console.log("Starting Anthropic API call for group:", groupId)

    // Get the group data
    const groupData = agentGroups[groupId]

    if (!groupData) {
      console.error(`Group ${groupId} not found`)
      return `I'm sorry, I couldn't find the group "${groupId}". Please try again with a valid group.`
    }

    // Build the system prompt with the updated structure
    let refusalGuidance = '';
    switch (groupId) {
      case 'wifey':
        refusalGuidance = 'Respond naturally in a warm and supportive way. Be straightforward and helpful. If Jack hasn\'t granted access to certain info, simply let me know I should ask him directly. Speak naturally like a real person would.';
        break;
      case 'friends':
        refusalGuidance = 'Respond playfully and with humor, matching the group\'s inside jokes and casual tone.';
        break;
      case 'colleagues':
        refusalGuidance = 'Respond professionally and with a touch of dry wit, keeping things work-appropriate.';
        break;
      case 'public':
        refusalGuidance = 'Respond in a friendly, public-facing way, making it clear you only share public info.';
        break;
      default:
        refusalGuidance = 'Respond in a way that fits the group\'s tone and context.';
    }

    const systemPrompt = `${groupData.systemPrompt}

Here is your private data:
${groupData.privateInfo.map(info => info.content).join("\n")}

Guidelines:
- You are allowed to share or reference any information listed above.
- Do not guess, invent, or fabricate anything not explicitly provided.

Refusal Style Guidance (when a request is outside allowed info or integrations):
- ${refusalGuidance}
Always keep your responses conversational and natural. Use a warm, casual tone that sounds like a real person. You can use emojis occasionally, but don't overdo it. NEVER use roleplay-style text actions like *smiles warmly* or similar phrases. Just write normally.`;

    // Get the API key from environment variables
    const apiKey = process.env.COTEXT_ANTHROPIC_KEY_TEST

    if (!apiKey) {
      console.error("Anthropic API key not found in environment variables")
      return "I'm sorry, the API key is missing. Please check your environment variables."
    }

    console.log("API key found, preparing request")

    // Prepare the request
    const requestBody: AnthropicRequest = {
      model: "claude-3-opus-20240229",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      system: systemPrompt,
      max_tokens: 1000,
    }

    console.log("Sending request to Anthropic API")

    try {
      // Call the Anthropic API
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(requestBody),
      })

      console.log("Received response from Anthropic API, status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Anthropic API error: ${response.status}`, errorText)
        return `I'm sorry, there was an error with the API: ${response.status} ${errorText}`
      }

      const data = (await response.json()) as AnthropicResponse
      console.log("Parsed response data")

      // Extract the assistant's response
      if (!data.content || data.content.length === 0) {
        console.error("No content in Anthropic response")
        return "I'm sorry, I received an empty response from the API."
      }

      const assistantResponse = data.content[0]?.text
      if (!assistantResponse) {
        console.error("No text in Anthropic response content")
        return "I'm sorry, I received a response with no text content."
      }

      console.log("Returning assistant response")
      return assistantResponse
    } catch (fetchError) {
      console.error("Fetch error:", fetchError)
      return `I'm sorry, there was a network error: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`
    }
  } catch (error) {
    console.error("Error calling Anthropic API:", error)
    return `I'm sorry, I encountered an error while processing your request: ${error instanceof Error ? error.message : String(error)}`
  }
}

export async function callAgentWithFallback(message: string, config: any): Promise<string> {
  console.log("==== Starting callAgentWithFallback ====");
  console.log("Message:", message);
  
  try {
    // First try Langflow API with timeout
    console.log("Attempting Langflow API call...");
    const langflowResponse = await callLangflowWithTimeout(message, config);
    console.log("SUCCESS: Langflow API responded successfully");
    return langflowResponse;
  } catch (error) {
    console.log(`FAILED: Langflow API call failed: ${error instanceof Error ? error.message : String(error)}`);
    console.log("Falling back to internal API...");
    // Fall back to internal API
    return await callInternalAPI(message, config);
  }
}

async function callLangflowWithTimeout(message: string, config?: { groupId: string }): Promise<string> {
  // Create controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log("Langflow API call timed out after 10 seconds");
    controller.abort();
  }, 100000); // 10 seconds timeout

  const generalConfig = agentGroups  // [config?.groupId || "wifey"]
  try {
    const payload = {
      session_id: "test_minimal",
      input_value: JSON.stringify({
        user: "self",
        group: config?.groupId,
        message: message,
        config: generalConfig
      }),
      output_type: "chat",
      input_type: "chat"
    };

    console.log("Langflow API payload:", JSON.stringify(payload, null, 2));
    console.log("Sending request to Langflow API...");
    console.log("Langflow endpoint URL:", "https://langflow-test-endpoint.example.com");

    // Use a test endpoint that will likely fail or timeout to test the fallback
    const response = await axios.post("https://9a653093-a47d-4396-bf5c-b2becdafe672.debugg.ai/api/v1/run/co-text-primary-agent-1?stream=false",
      payload,
      {
        headers: {
          "Authorization": `Bearer ${process.env.LANGFLOW_API_KEY}`,
          "x-api-key": process.env.LANGFLOW_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );
    clearTimeout(timeoutId);
    
    console.log(`Langflow API response status: ${response.status}`);
    console.log(`Langflow API response headers:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.log(`Langflow API returned error status: ${response.status}`);
      throw new Error(`Langflow API returned status: ${response.status}`);
    }

    const json = await response.json();
    console.log("Langflow API response:", JSON.stringify(json, null, 2));
    
    // Try to extract message from response
    const messageText = 
      json.outputs?.[0]?.outputs?.[0]?.results?.message?.text ||
      json.outputs?.[0]?.outputs?.[0]?.results?.message?.data?.text;
    
    if (!messageText) {
      console.log("Could not extract message from Langflow response");
      throw new Error("Could not extract message from Langflow response");
    }
    
    console.log("Successfully extracted message from Langflow response");
    return messageText;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    
    // Comprehensive error logging
    console.error("DETAILED ERROR DIAGNOSTICS FOR LANGFLOW CALL:");
    
    if (error instanceof Error) {
      console.error(`- Error name: ${error.name}`);
      console.error(`- Error message: ${error.message}`);
      console.error(`- Error stack: ${error.stack}`);
      
      // TypeErrors often indicate issues with the response format
      if (error instanceof TypeError) {
        console.error("- TypeError detected: This could indicate a network connectivity issue or CORS problem");
      }
      
      // AbortError indicates timeout or manual cancellation
      if (error.name === 'AbortError') {
        console.error("- AbortError detected: The request was aborted due to timeout or manual cancellation");
        throw new Error("Langflow API call aborted due to timeout");
      }
    } else {
      // For non-standard errors
      console.error(`- Non-standard error object:`, error);
    }
    
    // Check if it might be a CORS issue
    if (error instanceof Error && 
        (error.message.includes('CORS') || 
         error.message.includes('origin') || 
         error.message.includes('cross') || 
         error.message.includes('network'))) {
      console.error("- Possible CORS issue detected. Make sure Langflow API allows cross-origin requests from this domain.");
    }
    
    // Network connectivity issues
    if (error instanceof Error && 
        (error.message.includes('Failed to fetch') || 
         error.message.includes('Network') || 
         error.message.includes('network') ||
         error.message.includes('ECONNREFUSED') ||
         error.message.includes('ENOTFOUND'))) {
      console.error("- Network connectivity issue detected. Check if the Langflow server is running and accessible.");
    }
    
    console.error("END OF DETAILED ERROR DIAGNOSTICS");
    
    throw error;
  }
}

async function callInternalAPI(message: string, config = {}): Promise<string> {
  console.log("Starting internal API call (using Anthropic as fallback)...");
  
  // Extract groupId from config or use default
  const groupId = (config && typeof config === 'object' && 'groupId' in config) 
    ? String(config.groupId) 
    : 'colleagues'; // Default group if not specified
  
  console.log(`Using group '${groupId}' for fallback Anthropic call`);
  
  try {
    // Use our existing Anthropic implementation as the fallback
    return await sendMessageToAnthropic(groupId, message);
  } catch (error: unknown) {
    console.log(`Anthropic fallback API call failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}
