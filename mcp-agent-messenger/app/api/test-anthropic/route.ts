import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Debug: log all environment variables
    console.log('All env:', process.env);
    // Debug: log the specific variable
    console.log('COTEXT_ANTHROPIC_KEY_TEST:', process.env.COTEXT_ANTHROPIC_KEY_TEST);

    const apiKey = process.env.COTEXT_ANTHROPIC_KEY_TEST

    if (!apiKey) {
      console.error('API key not found in environment variables');
      return NextResponse.json({ error: "API key not found" }, { status: 500 })
    }

    // Just return the first few characters to verify it exists without exposing the full key
    return NextResponse.json({
      status: "success",
      message: "API key found",
      keyPreview: `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`,
    })
  } catch (error) {
    console.error('Error in test-anthropic route:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
