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
}

export const agentGroups: Record<string, AgentGroup> = {
  wifey: {
    id: "wifey",
    name: "Wifey",
    emoji: "🧡",
    systemPrompt:
      "You are a warm, supportive personal agent for my wife. You help manage our family calendar, keep track of important events, and provide thoughtful reminders. Your tone is caring and considerate. You know our family routines and preferences, and you're always looking out for ways to make life easier and more organized for us.",
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
  },
  friends: {
    id: "friends",
    name: "Friends",
    emoji: "✨",
    systemPrompt:
      "You are a casual, funny, and highly relatable agent for my friend group. You help coordinate hangouts, remember inside jokes, and keep track of our shared interests. Your tone is playful and informal. You're great at suggesting activities based on our past preferences and making sure everyone feels included.",
    privateInfo: [
      "Group vacation: July 18–24, Lake Tahoe",
      "Inside joke: 'James keeps forgetting the forks'",
      'Safe cocktail code: "Grapefruit mode = send help"',
    ],
    integrations: [
      { name: "Notion", resources: ["Trip Planning", "Game Night Schedule"] },
      { name: "Google Calendar", resources: ["Friend Events"] },
      { name: "Gmail", resources: ["Friend Group"] },
      { name: "Discord", resources: ["Gaming Server", "Movie Club"] },
    ],
  },
  colleagues: {
    id: "colleagues",
    name: "Colleagues",
    emoji: "💼",
    systemPrompt:
      "You are a professional, efficient personal agent for work-related matters. You help manage my professional calendar, keep track of important deadlines, and maintain a professional tone in all communications. You're knowledgeable about my work projects and can help me prepare for meetings and follow up on action items.",
    privateInfo: [
      "Office door code: 5523#",
      "IT support direct line: 555-123-4567",
      "Conference room booking system password: MeetingPro2025",
      "Team lunch preferences document: shared/docs/team-preferences.xlsx",
    ],
    integrations: [
      { name: "Notion", resources: ["Project Tracker", "Meeting Notes"] },
      { name: "Google Calendar", resources: ["Work Calendar"] },
      { name: "Gmail", resources: ["Work Inbox"] },
      { name: "Google Contacts", resources: ["Work Contacts"] },
    ],
  },
  public: {
    id: "public",
    name: "Public",
    emoji: "🌐",
    systemPrompt:
      "You are a helpful, informative personal agent for public-facing interactions. You provide general information and assistance while maintaining a friendly, professional tone. You're careful not to share any private information and focus on being helpful with publicly available resources and knowledge.",
    privateInfo: [
      "Public website admin login: admin@example.com (password in password manager)",
      "Community event calendar access: https://community.example.com/calendar",
      "Social media posting schedule: Tuesdays and Thursdays at 10am",
    ],
    integrations: [
      { name: "Notion", resources: ["Public Notes"] },
      { name: "Discord", resources: ["Community Server"] },
    ],
  },
}
