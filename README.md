# Cotext.ai: No-code Personal Agents

## Quickstart Guide

This project is a Next.js 15 (React 19, TypeScript, Tailwind CSS) frontend located in the `mcp-agent-messenger` directory. The root is set up as a monorepo for easy workspace management.

---

## 1. Dependencies
- **Node.js** (v18+ recommended)
- **pnpm** (preferred) or npm
- **Next.js** (15.x)
- **React** (19.x)
- **TypeScript**
- **Tailwind CSS**

All other dependencies are managed in `mcp-agent-messenger/package.json`.

---

## 2. Setup Instructions

### 1. Clone the repository
```bash
git clone <repo-url>
cd mcp-hackathon
```

### 2. Install pnpm (if not already installed)
```bash
npm install -g pnpm
```

### 3. Install dependencies (from the root)
```bash
pnpm install
```

### 4. Create your `.env` file
Create a file named `.env` inside the `mcp-agent-messenger` directory:

```
COTEXT_ANTHROPIC_KEY_TEST=your_anthropic_api_key_here
```
- Replace `your_anthropic_api_key_here` with your actual API key.
- **Do not commit your `.env` file!** It is gitignored by default.

### 5. Start the development server
From the root directory, run:
```bash
npm run dev
```
- This will start the Next.js dev server on port 3000 (or the next available port).
- Access the app at [http://localhost:3000](http://localhost:3000)

---

## 3. Agent Data Structure (`mcp-agent-messenger/data/agent-groups.ts`)

This file defines the `AgentGroup` interface and the `agentGroups` constant, which holds the configuration for each agent persona.

### `AgentGroup` Interface:
```typescript
export interface AgentGroup {
  id: string;             // Unique identifier for the agent group (e.g., "wifey", "friends")
  name: string;           // Display name (e.g., "Wifey", "Friends")
  emoji: string;          // Emoji for UI representation
  systemPrompt: string;   // Base instructions for the LLM defining personality and core tasks
  privateInfo: {
    content: string;    // The actual piece of private information (e.g., a safeword, an account number)
    mcp: string;        // Name of the MCP service this info belongs to (e.g., "Notion MCP")
    tool: string;       // Specific tool within the MCP that handles this info (e.g., "list_notion_pages")
    resource: string;   // Specific resource/document/page this info is tied to (e.g., "Health Tracker")
  }[];
  mcpIntegrations: {
    name: string;       // Name of the integrated service (e.g., "Notion", "Google Calendar")
    mcp: string;        // Name of the corresponding MCP service (e.g., "Notion MCP")
    tools: {
      name: string;   // Name of the tool/action (e.g., "list_calendar_events")
      access: "read" | "write" | "read-write"; // Access level for this tool
    }[];
    resources: string[];// List of resources this integration has access to (e.g., ["Family Calendar"])
  }[];
}
```
**Important Note on `privateInfo`**:
The `privateInfo` array currently contains hardcoded `content` for demonstration. The **end goal** is for this `content` to be dynamically fetched from the corresponding MCP service.
When the agent needs a piece of private information, it should:
1. Identify the relevant `privateInfo` entry.
2. Use the `mcp`, `tool`, and `resource` fields to make a call to the appropriate MCP server.
3. The MCP server would then return the actual `content` for that piece of data.
This allows private data to be securely stored and managed by MCPs, rather than being hardcoded in the frontend.

---

## 4. End-to-End Data Flow

### Scenario 1: A Connection Asks the User's Agent a Question

1.  **Input**: A message from a connection (e.g., SMS) arrives at a chat endpoint (e.g., `/chats/[id]`).
2.  **Group Identification**: The system identifies the `groupId` (e.g., `wifey`) for this connection.
3.  **API Call**: The frontend calls `sendMessageToAnthropic(groupId, message)` (in `mcp-agent-messenger/actions/anthropic-api.ts`).
4.  **System Prompt Construction (`anthropic-api.ts`**):
    *   Retrieves `agentData` for the `groupId` from `agent-groups.ts`.
    *   Constructs a `systemPrompt` for the LLM:
        *   Base personality: `agentData.systemPrompt`.
        *   Private Data: `agentData.privateInfo.map(info => info.content).join("\n")`. **Note**: This currently uses the hardcoded `content`. In a production system, this step would involve fetching the `content` from the relevant MCPs based on `info.mcp`, `info.tool`, and `info.resource`.
        *   Refusal Style Guidance: Tailored instructions for out-of-scope requests.
5.  **Anthropic API Request**: Sends the user's message and the constructed `systemPrompt` to the Anthropic API.
6.  **Response Handling**: The LLM generates a response.
7.  **UI Update**: The frontend displays the response in the chat interface.

### Scenario 2: User Asks Their Personal Agent a Question

1.  **Input**: The user messages their Personal Agent via the `MeScreen`.
2.  **API Call**: The frontend calls `sendMessageToPersonalAgent(message)` (in `mcp-agent-messenger/actions/personal-agent-api.ts`).
3.  **Global System Prompt Construction (`personal-agent-api.ts`**):
    *   A broad `systemPrompt` is created, granting access to *all* agent groups.
    *   It includes `JSON.stringify(agentGroups, null, 2)`, giving the LLM the entire `agent-groups.ts` data (including all `privateInfo` objects with their `mcp`, `tool`, and `resource` details).
    *   **Note**: The Personal Agent receives the *structure* of where data lives. In a production system, if the Personal Agent needs specific `content` from a `privateInfo` entry, it would conceptually need to trigger a fetch from the relevant MCP.
4.  **Anthropic API Request**: Sends the user's message and this global prompt to Anthropic.
5.  **Response Handling**: The LLM responds, potentially drawing from data across all groups.
6.  **UI Update**: The `MeScreen` displays the response.

---

## 5. Testing the API Key
- Visit: [http://localhost:3000/api/test-anthropic](http://localhost:3000/api/test-anthropic)
- A JSON response with a preview of your key indicates success.

---

## 6. Project Structure
- `mcp-agent-messenger/`: Main frontend Next.js app.
- `mcp-agent-messenger/.env`: API keys and environment variables.
- `package.json` (root): Monorepo workspace config.

---

## 7. Troubleshooting
- **API Key Not Found**: Ensure `mcp-agent-messenger/.env` exists and `COTEXT_ANTHROPIC_KEY_TEST` is set. Restart the dev server.
- **Dependency Issues**: Run `pnpm install` from the root.
- **Prompt Issues**: In `actions/anthropic-api.ts`, ensure `privateInfo` is correctly processed (e.g., `privateInfo.map(info => info.content).join("\n")`) to avoid sending `[object Object]` to the LLM for the hardcoded content.

---

## 8. Useful Scripts
- `npm run dev`: Starts the dev server (from root).
- `pnpm install`: Installs dependencies (from root).

---

## 9. Contact
For issues, contact the project maintainer or open an issue.