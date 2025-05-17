export interface AgentGroup {
  id: string
  name: string
  emoji: string
  systemPrompt: string
  privateInfo: string[]
  integrations: {
    name: string
    resources: string[]
  }[]
  availableInMCPTools: {
    mcp: string
    resources: string[]
  }[]
}

export const agentGroups: Record<string, AgentGroup> = {
  wifey: {
    id: "wifey",
    name: "Wifey",
    emoji: "🧡",
    systemPrompt:
      "You are a warm, supportive personal agent for my wife. You help manage our family calendar, keep track of important events, and provide thoughtful reminders. Your tone is caring and considerate. You know our family routines and preferences, and you're always looking out for ways to make life easier and more organized for us.",
    context:
      "This group is for Jack’s wife, Sarah. Jack is the creator and primary user of the agent. Sarah often texts the agent to ask about family plans, their son Tommy, personal errands, or shared routines. If a user refers to 'my wife', 'Sarah', or family responsibilities, it's likely related to this group.",
    privateInfo: [
      "Our son Tommy's health insurance number: ABC55443322",
      "Alaska Airlines Mileage Plan #: 11223344",
      'Safe word: "Marzipan"',
      "Emergency chocolate stash: Bottom-left drawer, behind the quinoa",
      'Spotify playlist: "Drive Home Vibes"',
    ],
    integrations: [
      { name: "Notion", resources: ["Health Tracker", "Chore List", "Meal Planner"] },
      { name: "Google Calendar", resources: ["Family Calendar", "Date Nights"] },
      { name: "Gmail", resources: ["Personal Inbox"] },
      { name: "Google Contacts", resources: ["Family Contacts"] },
      { name: "Discord", resources: ["Family Server"] },
    ],
    availableInMCPTools: [
      { mcp: "Notion MCP", resources: ["Health Tracker", "Chore List", "Meal Planner"] },
      { mcp: "Google Calendar MCP", resources: ["Family Calendar", "Date Nights"] },
      { mcp: "Gmail MCP", resources: ["Personal Inbox"] },
      { mcp: "Google Contacts MCP", resources: ["Family Contacts"] },
      { mcp: "Discord MCP", resources: ["Family Server"] },
    ],
  },
  friends: {
    id: "friends",
    name: "Friends",
    emoji: "✨",
    systemPrompt:
      "You are a casual, funny, and highly relatable agent for my friend group. You help coordinate hangouts, remember inside jokes, and keep track of our shared interests. Your tone is playful and informal. You're great at suggesting activities based on our past preferences and making sure everyone feels included.",
    context:
      "This group is for Jack’s close circle of friends. The agent helps organize social activities, suggests fun plans, and keeps track of traditions or jokes. Friends might ask about past or future events, trip plans, or social media inside jokes.",
    privateInfo: [
      "Group vacation: July 18–24, Lake Tahoe",
      "Inside joke: 'James keeps forgetting the forks'",
      'Safe cocktail code: "Grapefruit mode = send help"',
      "Mario Kart night: Every other Friday",
    ],
    integrations: [
      { name: "Notion", resources: ["Trip Planning", "Game Night Schedule"] },
      { name: "Google Calendar", resources: ["Friend Events"] },
      { name: "Gmail", resources: ["Friend Group"] },
      { name: "Discord", resources: ["Gaming Server", "Movie Club"] },
    ],
    availableInMCPTools: [
      { mcp: "Notion MCP", resources: ["Trip Planning", "Game Night Schedule"] },
      { mcp: "Google Calendar MCP", resources: ["Friend Events"] },
      { mcp: "Gmail MCP", resources: ["Friend Group"] },
      { mcp: "Discord MCP", resources: ["Gaming Server", "Movie Club"] },
    ],
  },
  colleagues: {
    id: "colleagues",
    name: "Colleagues",
    emoji: "💼",
    systemPrompt:
      "You are a professional, efficient personal agent for work-related matters. You help manage my professional calendar, keep track of important deadlines, and maintain a professional tone in all communications. You're knowledgeable about my work projects and can help me prepare for meetings and follow up on action items.",
    context:
      "This group serves Jack’s colleagues and professional network. It’s used for coordinating work tasks, reviewing shared projects, or referencing business contacts and files. Users interacting here are likely asking about meetings, files, or workplace routines.",
    privateInfo: [
      "Office door code: 5523#",
      "IT support direct line: 555-123-4567",
      "Conference room booking system password: MeetingPro2025",
      "Team lunch preferences document: shared/docs/team-preferences.xlsx",
      "Quarterly OKR dashboard link: notion.so/work-okr",
    ],
    integrations: [
      { name: "Notion", resources: ["Project Tracker", "Meeting Notes"] },
      { name: "Google Calendar", resources: ["Work Calendar"] },
      { name: "Gmail", resources: ["Work Inbox"] },
      { name: "Google Contacts", resources: ["Work Contacts"] },
    ],
    availableInMCPTools: [
      { mcp: "Notion MCP", resources: ["Project Tracker", "Meeting Notes"] },
      { mcp: "Google Calendar MCP", resources: ["Work Calendar"] },
      { mcp: "Gmail MCP", resources: ["Work Inbox"] },
      { mcp: "Google Contacts MCP", resources: ["Work Contacts"] },
    ],
  },
  public: {
    id: "public",
    name: "Public",
    emoji: "🌐",
    systemPrompt:
      "You are a helpful, informative personal agent for public-facing interactions. You provide general information and assistance while maintaining a friendly, professional tone. You're careful not to share any private information and focus on being helpful with publicly available resources and knowledge.",
    context:
      "This group is for general public use — online followers, community members, or clients. The agent is restricted to safe public data and won’t share anything private. It helps with FAQs, events, or content shared publicly on social channels or websites.",
    privateInfo: [
      "Public website admin login: admin@example.com (password in password manager)",
      "Community event calendar access: https://community.example.com/calendar",
      "Social media posting schedule: Tuesdays and Thursdays at 10am",
      "Preferred talking points: AI literacy, open-source collaboration, productivity tips",
    ],
    integrations: [
      { name: "Notion", resources: ["Public Notes"] },
      { name: "Discord", resources: ["Community Server"] },
    ],
    availableInMCPTools: [
      { mcp: "Notion MCP", resources: ["Public Notes"] },
      { mcp: "Discord MCP", resources: ["Community Server"] },
    ],
  },
}