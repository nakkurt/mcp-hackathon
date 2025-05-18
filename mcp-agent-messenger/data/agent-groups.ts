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
        "content": "Our safe word is 'Marzipan', and it's a secret just between us. Our secret chocolate stash is in the bottom-left drawer, behind the quinoa. For Sarah's birthday she wants lavender candle, soft slippers, and date night coupons.",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Family Notes"
      },
      {
        "content": "Tommy’s pediatrician contact: Dr. Ellis (555-234-9876)",
        "mcp": "Google Contacts MCP",
        "tool": "list_contacts",
        "resource": "Family Contacts"
      },
      {
        "content": "Tommy is our son. His school login: tommy.p@k12.edu / Rainbow123! Tommy’s health insurance number is ABC55443322.",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "School Notes"
      },
      {
        "content": "Birthday gift wishlist (for Sarah): lavender candle, soft slippers, date night coupons.", // Note: Redundant with first entry but harmless.
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Gift Ideas"
      },
      {
        "content": "Wedding anniversary is October 12 — reservation at Petit Crenn.",
        "mcp": "Google Calendar MCP",
        "tool": "list_calendar_events",
        "resource": "Family Calendar"
      },
      {
        "content": "Favorite takeout order: Thai from Kin Khao — spicy pad thai + mango sticky rice.",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Meal Planner"
      },
      {
        "content": "House alarm code: 7812# (don't share with guests).",
        "mcp": "Google Contacts MCP", // Or a more secure MCP if available, using Contacts as per original
        "tool": "list_contacts",
        "resource": "Emergency Info"
      },
      {
        "content": "Monthly reminder: Schedule couples massage at The Now. Our anniversary dinner at Petit Crenn is October 12th, the reservation is already set.",
        "mcp": "Google Calendar MCP",
        "tool": "list_calendar_events",
        "resource": "Date Nights"
      },
      {
        "content": "Spotify blend with Sarah: https://spotify.com/blend-us-123",
        "mcp": "Gmail MCP",
        "tool": "list_emails",
        "resource": "Personal Inbox"
      },
      {
        "content": "Vacation days left: 3. Use them before July 30.",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Family Planner"
      },
      {
        "content": "Our favorite playlist for the drive home is 'Drive Home Vibes' on Spotify. Spotify Link: [hypothetical_spotify_link_drive_home_vibes]",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Media Links"
      },
      {
        "content": "Sarah is proficient with Notion and can help with non-work related Notion questions or projects.",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Family Notes"
      }
    ],
    "mcpIntegrations": [
      {
        "name": "Notion",
        "mcp": "Notion MCP",
        "access": "write",
        "resources": [
          "Health Tracker",
          "Chore List",
          "Meal Planner",
          "Family Notes",
          "School Notes",
          "Gift Ideas",
          "Family Planner",
          "Media Links"
        ]
      },
      {
        "name": "Google Calendar",
        "mcp": "Google Calendar MCP",
        "access": "read",
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
          "Family Contacts",
          "Emergency Info"
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
        "content": "Alex owes $38.50 for last trivia night.",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Friend Ledger"
      },
      {
        "content": "Group karaoke playlist: https://youtube.com/friendsingset",
        "mcp": "Discord MCP",
        "tool": "list_channels",
        "resource": "Music Vibes"
      },
      {
        "content": "Code word for leaving bad dates: 'Grapefruit mode'. It’s our secret code for date rescue.",
        "mcp": "Gmail MCP", // Assuming this might be shared/confirmed via email or a general notes area
        "tool": "list_emails",
        "resource": "Friend Group"
      },
      {
        "content": "Backup camping spot: Big Sur site #11 if Lake Tahoe trip falls through.",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Trip Planning"
      },
      {
        "content": "Claire's bday surprise: custom whiskey box + brunch at Plow.",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Birthday Plans"
      },
      {
        "content": "“Movie Club” poll winner last round: The Prestige.",
        "mcp": "Discord MCP",
        "tool": "list_channels",
        "resource": "Movie Club"
      },
      {
        "content": "Running group pace tracker: Jules — fast, Sam — medium, Mark — chill.",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Hangouts"
      },
      {
        "content": "Next Mario Kart night is this Friday. Check the Friend Events calendar.",
        "mcp": "Google Calendar MCP",
        "tool": "list_calendar_events",
        "resource": "Friend Events"
      },
      {
        "content": "It's a running joke that James always forgets the forks for picnics.",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Inside Jokes"
      }
    ],
    "mcpIntegrations": [
      {
        "name": "Notion",
        "mcp": "Notion MCP",
        "access": "read",
        "resources": [
          "Trip Planning",
          "Game Night Schedule",
          "Friend Ledger",
          "Birthday Plans",
          "Hangouts",
          "Inside Jokes"
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
          "Movie Club",
          "Music Vibes"
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
        "content": "Weekly team sync agenda doc: bit.ly/team-sync-agenda",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Meeting Notes"
      },
      {
        "content": "CEO prefers slide decks with <5 bullets per slide.",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Exec Preferences"
      },
      {
        "content": "Project Orion secret codename: 'Apollo Fix'.",
        "mcp": "Gmail MCP",
        "tool": "list_emails",
        "resource": "Work Inbox"
      },
      {
        "content": "Recommended Uber driver to the office: Jenna (drives Prius, plays lo-fi).",
        "mcp": "Google Contacts MCP",
        "tool": "list_contacts",
        "resource": "Work Contacts"
      },
      {
        "content": "VPN config guide (internal): securevpn.corp/settings",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "IT Onboarding"
      },
      {
        "content": "Q3 OKRs: Launch MCP, ship VSCode plugin v2, increase usage 20%. The 'increase usage 20%' metric is the one to focus on as it currently needs updating.",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Project Tracker"
      },
      {
        "content": "Office door code: 5523# (internal use only).",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Workplace Info"
      },
      {
        "content": "Conference room system password for bookings: MeetingPro2025.",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Workplace Info"
      },
      {
        "content": "For work-related IT or Notion issues, contact IT Support at 555-123-4567.",
        "mcp": "Google Contacts MCP",
        "tool": "list_contacts",
        "resource": "Work Contacts"
      }
    ],
    "mcpIntegrations": [
      {
        "name": "Notion",
        "mcp": "Notion MCP",
        "resources": [
          "Project Tracker",
          "Meeting Notes",
          "Exec Preferences",
          "IT Onboarding",
          "Workplace Info"
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
        "content": "Company tagline draft: \"Smarter tools. Simpler lives.\"",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Public Notes"
      },
      {
        "content": "Sample FAQ: 'What is MCP?' — It stands for Model Context Protocol.",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Public Notes"
      },
      {
        "content": "Conference booth layout PDF: stored in notion.so/booth-plan",
        "mcp": "Notion MCP",
        "tool": "list_notion_pages",
        "resource": "Event Materials"
      },
      {
        "content": "Backup X/Twitter post: 'Excited to demo AI agent groups + MCP fallback design today!'",
        "mcp": "Discord MCP", // Assuming this is for internal coordination or a community server where it's okay
        "tool": "send_message",
        "resource": "Community Server"
      },
      {
        "content": "Demo fail-safe checklist: (1) Show fallback JSON intent (2) Explain MCP vision (3) Smile!",
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
          "Public Notes",
          "Event Materials" // Added Event Materials based on privateInfo
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