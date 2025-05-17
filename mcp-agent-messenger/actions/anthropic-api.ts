"use server"

import { agentGroups } from "@/data/agent-groups"

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
    const systemPrompt = `${groupData.systemPrompt}

Here is your private data:
${groupData.privateInfo.join("\n")}

Guidelines:
- You are allowed to share or reference any information listed above.
- Do not guess, invent, or fabricate anything not explicitly provided.
- If the user asks for something not included above, respond with:
  "I'm sorry, I can't help with that. It's outside what I'm allowed to access."`

    // Get the API key from environment variables
    const apiKey = process.env.COTEXT_ANTHROPIC_API

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
