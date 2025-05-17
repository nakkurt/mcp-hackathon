"use server"

import { writeFile } from 'fs/promises'
import path from 'path'
import { AgentGroup, agentGroups } from "@/data/agent-groups"

// This type should match what AgentCard sends and what agent-groups.ts should store
interface SimplifiedMCPIntegration {
  name: string;
  mcp: string;
  access: "read" | "write" | "read-write";
  resources: string[];
  // tools: any[]; // tools is no longer part of the simplified model, ensure it's not written or expected
}

interface UpdatedAgentGroup extends Omit<AgentGroup, 'mcpIntegrations'> {
  mcpIntegrations: SimplifiedMCPIntegration[];
}

export async function updateAgentConfig(agentId: string, updatedConfig: Partial<UpdatedAgentGroup>): Promise<boolean> {
  try {
    console.log('Updating agent config for:', agentId);
    // Ensure agentGroups[agentId] conforms to UpdatedAgentGroup or handle potential mismatch
    const currentAgentConfig = agentGroups[agentId] as unknown as UpdatedAgentGroup;

    console.log('Current config from agentGroups:', JSON.stringify(currentAgentConfig, null, 2));
    console.log('Received updated partialConfig:', JSON.stringify(updatedConfig, null, 2));
    
    if (!currentAgentConfig) {
      console.error(`Agent ${agentId} not found in agentGroups`);
      return false;
    }
    
    // Merge the updated config with the current one
    const newConfig: UpdatedAgentGroup = {
      ...currentAgentConfig, // Base with all existing properties
      ...updatedConfig,     // Overlay with provided changes
      id: agentId,          // Ensure id doesn't change
      // Ensure mcpIntegrations are fully replaced if provided, otherwise use current
      mcpIntegrations: updatedConfig.mcpIntegrations || currentAgentConfig.mcpIntegrations,
    };
    
    console.log('Merged newConfig for storage:', JSON.stringify(newConfig, null, 2));
    
    // Update the agent groups object to be written to file
    const updatedAgentGroups = {
      ...agentGroups, // existing agent groups
      [agentId]: newConfig // updated agent
    };
    
    const filePath = path.join(process.cwd(), 'data', 'agent-groups.ts');
    console.log('Writing to file:', filePath);
    
    // Format the content to match the new simplified file structure
    // IMPORTANT: This definition MUST match the actual structure being saved.
    const fileContent = `// Defines the access levels for an integration.
export type MCPIntegrationAccess = "read" | "write" | "read-write";

// Defines the structure for an MCP integration.
export interface MCPIntegration {
  name: string;
  mcp: string; // Identifier for the MCP connector used
  access: MCPIntegrationAccess;
  resources: string[]; // List of resource names or IDs
  // 'tools' array is intentionally removed as per simplification
}

// Defines the structure for an Agent's private information.
export interface AgentPrivateInfo {
  content: string;
  mcp: string;
  tool: string;
  resource: string;
}

// Defines the overall structure for an Agent Group.
export interface AgentGroup {
  id: string;
  name: string;
  emoji: string;
  systemPrompt: string;
  privateInfo: AgentPrivateInfo[];
  mcpIntegrations: MCPIntegration[]; // Uses the simplified MCPIntegration
}

// Record collection of all agent groups.
export const agentGroups: Record<string, AgentGroup> = ${JSON.stringify(updatedAgentGroups, null, 2)};
`;
    
    await writeFile(filePath, fileContent, 'utf-8');
    console.log(`Successfully updated agent ${agentId} config in agent-groups.ts`);
    
    return true;
  } catch (error) {
    console.error("Error updating agent config in update-agent-config.ts:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    return false;
  }
} 