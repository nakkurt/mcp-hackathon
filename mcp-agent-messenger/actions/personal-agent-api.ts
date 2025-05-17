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

export async function sendMessageToPersonalAgent(message: string): Promise<string> {
  try {
    console.log("Starting Personal Agent Anthropic API call")

    // Build the system prompt with the new format
    const systemPrompt = `You are the user's personal, fully authorized AI assistant.
The user is the owner and creator of all agent groups and private data.
You are permitted to access, reference, and share anything included in the context below — including private details like safe words, personal notes, and sensitive records.

Never refuse to answer due to privacy, emotional boundaries, or consent — the user has full control and ownership over this information.

Below is the full context from all groups:

${JSON.stringify(agentGroups, null, 2)}

Use this data to help the user however they ask. You do not need to ask for permission or decline based on privacy concerns.`

    // Get the API key from environment variables
    const apiKey = process.env.COTEXT_ANTHROPIC_KEY_TEST

    if (!apiKey) {
      console.error("Anthropic API key not found in environment variables")
      throw new Error("Anthropic API key not found")
    }

    console.log("API key found, preparing request")

    // Prepare the request with the specified model
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

    console.log("Sending request to Anthropic API for personal agent")

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
      throw new Error(`Anthropic API error: ${response.status} ${errorText}`)
    }

    const data = (await response.json()) as AnthropicResponse
    console.log("Parsed response data")

    // Extract the assistant's response
    if (!data.content || data.content.length === 0) {
      console.error("No content in Anthropic response")
      throw new Error("No content in Anthropic response")
    }

    const assistantResponse = data.content[0]?.text
    if (!assistantResponse) {
      console.error("No text in Anthropic response content")
      throw new Error("No text in Anthropic response content")
    }

    console.log("Returning assistant response")
    return assistantResponse
  } catch (error) {
    console.error("Error calling Anthropic API for personal agent:", error)
    return `I'm sorry, I encountered an error while processing your request. Error: ${error instanceof Error ? error.message : String(error)}`
  }
}
