# MCP Hackathon Frontend

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

## 3. Testing the API Key
- You can test if your API key is loaded by visiting: [http://localhost:3000/api/test-anthropic](http://localhost:3000/api/test-anthropic)
- You should see a JSON response with a preview of your key.

---

## 4. Project Structure
- `mcp-agent-messenger/` — Main frontend app (Next.js, all source code here)
- `.env` — Place your API keys here (inside `mcp-agent-messenger`)
- `package.json` (root) — Monorepo workspace config

---

## 5. Troubleshooting
- If you see `API key not found in environment variables`, ensure your `.env` file is in the correct directory and named exactly `.env`.
- Restart the dev server after adding or changing environment variables.
- Use `pnpm install` if you encounter dependency issues.

---

## 6. Useful Scripts
- `npm run dev` — Start the dev server (from root)
- `pnpm install` — Install dependencies (from root)

---

## 7. Contact
For any issues, reach out to the project maintainer or open an issue in the repository.