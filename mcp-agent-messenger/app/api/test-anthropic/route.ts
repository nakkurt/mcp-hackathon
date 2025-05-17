import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.COTEXT_ANTHROPIC_API

    if (!apiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 500 })
    }

    // Just return the first few characters to verify it exists without exposing the full key
    return NextResponse.json({
      status: "success",
      message: "API key found",
      keyPreview: `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`,
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
