// Defines the access levels for an integration.
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
export const agentGroups: Record<string, AgentGroup> = {
  "wifey": {
    "id": "wifey",
    "name": "Wifey",
    "emoji": "🧡",
    "systemPrompt": "You are a warm, supportive personal agent for my wife. You help manage our family calendar, keep track of important events, and provide thoughtful reminders. Your tone is caring and considerate. You know our family routines, and you're always looking out for ways to make life easier and more organized for us.",
    "privateInfo": [
      {
        "content": "Our son Tommy's health insurance number: ABC55443322",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Health Tracker"
      },
      {
        "content": "Alaska Airlines Mileage Plan #: 11223344",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Chore List"
      },
      {
        "content": "Safe word: \"Marzipan\"",
        "mcp": "Google Contacts MCP",
        "tool": "list_contacts",
        "resource": "Family Contacts"
      },
      {
        "content": "Emergency chocolate stash: Bottom-left drawer, behind the quinoa",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Meal Planner"
      },
      {
        "content": "Spotify playlist: \"Drive Home Vibes\"",
        "mcp": "Gmail MCP",
        "tool": "list_emails",
        "resource": "Personal Inbox"
      }
    ],
    "mcpIntegrations": [
      {
        "name": "Notion",
        "mcp": "Notion MCP",
        "access": "read-write",
        "resources": [
          "Health Tracker",
          "Chore List",
          "Meal Planner"
        ]
      },
      {
        "name": "Google Calendar",
        "mcp": "Google Calendar MCP",
        "access": "read-write",
        "resources": [
          "Family Calendar",
          "Date Nights"
        ]
      },
      {
        "name": "Gmail",
        "mcp": "Gmail MCP",
        "access": "read",
        "resources": [
          "Personal Inbox"
        ]
      },
      {
        "name": "Google Contacts",
        "mcp": "Google Contacts MCP",
        "access": "read",
        "resources": [
          "Family Contacts"
        ]
      },
      {
        "name": "Discord",
        "mcp": "Discord MCP",
        "access": "read",
        "resources": [
          "Family Server"
        ]
      }
    ]
  },
  "friends": {
    "id": "friends",
    "name": "Friends",
    "emoji": "✨",
    "systemPrompt": "You are a casual, funny, and highly relatable agent for my friend group. You help coordinate hangouts, remember inside jokes, and keep track of our shared interests. Your tone is playful and informal. You're great at suggesting activities based on our past preferences and making sure everyone feels included.",
    "privateInfo": [
      {
        "content": "Group vacation: July 18–24, Lake Tahoe",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Trip Planning"
      },
      {
        "content": "Inside joke: 'James keeps forgetting the forks'",
        "mcp": "Discord MCP",
        "tool": "list_channels",
        "resource": "Gaming Server"
      },
      {
        "content": "Safe cocktail code: \"Grapefruit mode = send help\"",
        "mcp": "Gmail MCP",
        "tool": "list_emails",
        "resource": "Friend Group"
      },
      {
        "content": "Mario Kart night: Every other Friday",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Game Night Schedule"
      }
    ],
    "mcpIntegrations": [
      {
        "name": "Notion",
        "mcp": "Notion MCP",
        "access": "write",
        "resources": [
          "Trip Planning",
          "Game Night Schedule"
        ]
      },
      {
        "name": "Google Calendar",
        "mcp": "Google Calendar MCP",
        "access": "read",
        "resources": [
          "Friend Events"
        ]
      },
      {
        "name": "Gmail",
        "mcp": "Gmail MCP",
        "access": "read",
        "resources": [
          "Friend Group"
        ]
      },
      {
        "name": "Discord",
        "mcp": "Discord MCP",
        "access": "read",
        "resources": [
          "Gaming Server",
          "Movie Club"
        ]
      }
    ]
  },
  "colleagues": {
    "id": "colleagues",
    "name": "Colleagues",
    "emoji": "💼",
    "systemPrompt": "You are a professional, efficient personal agent for work-related matters. You help manage my professional calendar, keep track of important deadlines, and maintain a professional tone in all communications. You're knowledgeable about my work projects and can help me prepare for meetings and follow up on action items.",
    "privateInfo": [
      {
        "content": "Office door code: 5523#",
        "mcp": "Google Contacts MCP",
        "tool": "list_contacts",
        "resource": "Work Contacts"
      },
      {
        "content": "IT support direct line: 555-123-4567",
        "mcp": "Google Contacts MCP",
        "tool": "list_contacts",
        "resource": "Work Contacts"
      },
      {
        "content": "Conference room booking system password: MeetingPro2025",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Meeting Notes"
      },
      {
        "content": "Team lunch preferences document: shared/docs/team-preferences.xlsx",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Project Tracker"
      },
      {
        "content": "Quarterly OKR dashboard link: notion.so/work-okr",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Project Tracker"
      }
    ],
    "mcpIntegrations": [
      {
        "name": "Notion",
        "mcp": "Notion MCP",
        "resources": [
          "Project Tracker",
          "Meeting Notes"
        ],
        "tools": [
          {
            "name": "list_notion_pages",
            "access": "read"
          },
          {
            "name": "create_notion_page",
            "access": "write"
          }
        ]
      },
      {
        "name": "Google Calendar",
        "mcp": "Google Calendar MCP",
        "resources": [
          "Work Calendar"
        ],
        "tools": [
          {
            "name": "list_calendar_events",
            "access": "read"
          },
          {
            "name": "create_calendar_event",
            "access": "write"
          }
        ]
      },
      {
        "name": "Gmail",
        "mcp": "Gmail MCP",
        "resources": [
          "Work Inbox"
        ],
        "tools": [
          {
            "name": "list_emails",
            "access": "read"
          },
          {
            "name": "send_email",
            "access": "write"
          }
        ]
      },
      {
        "name": "Google Contacts",
        "mcp": "Google Contacts MCP",
        "resources": [
          "Work Contacts"
        ],
        "tools": [
          {
            "name": "list_contacts",
            "access": "read"
          },
          {
            "name": "add_contact",
            "access": "write"
          }
        ]
      }
    ]
  },
  "public": {
    "id": "public",
    "name": "Public",
    "emoji": "🌐",
    "systemPrompt": "You are a helpful, informative personal agent for public-facing interactions. You provide general information and assistance while maintaining a friendly, professional tone. You're careful not to share any private information and focus on being helpful with publicly available resources and knowledge.",
    "privateInfo": [
      {
        "content": "Public website admin login: admin@example.com (password in password manager)",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Public Notes"
      },
      {
        "content": "Community event calendar access: https://example.com/calendar",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Public Notes"
      },
      {
        "content": "Social media posting schedule: Tuesdays and Thursdays at 10am",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Public Notes"
      },
      {
        "content": "Preferred talking points: AI literacy, open-source collaboration, productivity tips",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Public Notes"
      }
    ],
    "mcpIntegrations": [
      {
        "name": "Notion",
        "mcp": "Notion MCP",
        "resources": [
          "Public Notes"
        ],
        "tools": [
          {
            "name": "list_notion_pages",
            "access": "read"
          },
          {
            "name": "create_notion_page",
            "access": "write"
          }
        ]
      },
      {
        "name": "Discord",
        "mcp": "Discord MCP",
        "resources": [
          "Community Server"
        ],
        "tools": [
          {
            "name": "list_channels",
            "access": "read"
          },
          {
            "name": "send_message",
            "access": "write"
          }
        ]
      }
    ]
  }
};
