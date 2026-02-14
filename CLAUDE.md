# Lumos - Claude Code Configuration

This file provides specific guidance to Claude Code (claude.ai/code) when working with this repository.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.

<!-- nx configuration end-->

## Project: Lumos AI Voice Agent Platform

A hackathon project building a voice AI agent platform with:
- **lumos-client**: Next.js marketing/landing site (App Router + Tailwind CSS v4, SEO-optimized)
- **lumos-editor**: React design editor (Vite + Tailwind CSS v4)
- **lumos-agent**: LiveKit voice AI agent
- **lumos-api**: NestJS API backend
- **ui-components**: Shared component library
- **canvas**: Multi-page canvas library with Fabric.js

## Quick Reference

### Start Development Servers
```bash
npx nx serve lumos-client      # Next.js marketing site - http://localhost:4200
npx nx serve lumos-editor      # Design editor - http://localhost:4200
npx nx serve lumos-agent       # Voice agent (needs .env.local)
npx nx serve lumos-api         # API backend - http://localhost:3000
```

### Build & Test
```bash
npx nx build <project>
npx nx test <project>
npx nx run-many -t build
npx nx run-many -t test
```

## Critical Implementation Details

### 1. Next.js App (lumos-client)

**Purpose:** SEO-optimized marketing/landing site for Lumos platform

**Key Features:**
- ✅ Next.js 16 with App Router
- ✅ Comprehensive SEO metadata (Open Graph, Twitter Cards, etc.)
- ✅ Tailwind CSS v4 with shared design tokens
- ✅ Server-side rendering for better SEO
- ✅ TypeScript

**Configuration:**
```javascript
// lumos-client/postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

```css
/* lumos-client/src/app/global.css */
@import "tailwindcss";
@import "../../../ui-components/src/styles.css";

@source "../../../ui-components/src";
@source "../../../libs/canvas/src";
```

**SEO Metadata:**
- Configured in `lumos-client/src/app/layout.tsx`
- Includes title templates, descriptions, keywords
- Open Graph and Twitter Card support
- Robots.txt configuration

### 2. Tailwind CSS v4 (lumos-editor & lumos-client)

**IMPORTANT:** Tailwind v4 has breaking changes:

✅ **Correct Implementation:**
```javascript
// postcss.config.js (both lumos-editor and lumos-client)
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // NEW plugin
    autoprefixer: {},
  },
}
```

```css
/* Both apps import tailwindcss and shared design tokens */
@import "tailwindcss";
@import "../../../ui-components/src/styles.css";
```

❌ **Don't Use:**
- `tailwindcss` directly in PostCSS plugins
- `@tailwind` directives
- `tailwind.config.js` file

### 3. LiveKit Agents (lumos-agent)

**IMPORTANT:** Correct import patterns:

✅ **Correct:**
```typescript
import { voice } from '@livekit/agents';

export class LumosAgent extends voice.Agent {
  constructor() {
    super({ instructions: '...' });
  }
}
```

❌ **Don't Use:**
```typescript
import { Agent } from '@livekit/agents';  // This export doesn't exist
```

**Setup Requirements:**
1. Create `lumos-agent/.env.local` with LiveKit credentials
2. Download model files: `cd lumos-agent && npm run download-files`
3. Must have valid LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET

**Required Environment Variables:**
```env
LIVEKIT_URL=wss://your-url.livekit.cloud
LIVEKIT_API_KEY=APIxxxxxxxxxx
LIVEKIT_API_SECRET=your_secret
```

### 4. Package Management

**IMPORTANT:** This project uses **npm workspaces**, NOT pnpm.

✅ **Correct (package.json):**
```json
{
  "dependencies": {
    "@livekit/agents": "*",  // npm workspace reference
    "dotenv": "*"
  }
}
```

❌ **Don't Use:**
```json
{
  "dependencies": {
    "@livekit/agents": "workspace:*"  // pnpm syntax - will fail
  }
}
```

### 5. Nx Project Configuration

Each project needs `project.json` with correct paths:

```json
{
  "name": "lumos-agent",
  "$schema": "../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "lumos-agent/src",
  "targets": {
    "serve": {
      "executor": "nx:run-commands",
      "options": {
        "cwd": "lumos-agent",  // Important!
        "command": "npm run dev"
      }
    }
  }
}
```

## Common Error Patterns & Solutions

### Error: PostCSS Tailwind Plugin
```
[postcss] It looks like you're trying to use `tailwindcss` directly
```
**Fix:** Install `@tailwindcss/postcss` and update `postcss.config.js` to use `'@tailwindcss/postcss'`

### Error: LiveKit Import
```
SyntaxError: The requested module '@livekit/agents' does not provide an export named 'Agent'
```
**Fix:** Use `import { voice } from '@livekit/agents';` and extend `voice.Agent`

### Error: Model Files Not Found
```
Error: Required model files not found locally
```
**Fix:** Run `cd lumos-agent && npm run download-files`

### Error: Missing Credentials
```
MissingCredentialsError: API Key is required
```
**Fix:** Create `lumos-agent/.env.local` with LiveKit credentials

### Error: Workspace Protocol
```
Unsupported URL Type "workspace:": workspace:*
```
**Fix:** Replace `workspace:*` with `*` in package.json

## File Locations

```
/Users/amirmahmoudi/Desktop/hackathon/
├── lumos-client/               # Next.js marketing site
│   ├── src/app/
│   │   ├── layout.tsx          # Root layout with SEO metadata
│   │   ├── page.tsx            # Home page
│   │   └── global.css          # Tailwind v4 + design tokens
│   ├── postcss.config.js       # Uses @tailwindcss/postcss
│   ├── next.config.js
│   └── package.json
├── lumos-editor/               # Design editor (React + Vite)
│   ├── src/
│   │   ├── main.tsx
│   │   ├── styles.css          # @import "tailwindcss";
│   │   └── app/
│   ├── postcss.config.js       # Uses @tailwindcss/postcss
│   ├── package.json
│   └── project.json
├── lumos-agent/
│   ├── src/
│   │   ├── main.ts             # Entry point
│   │   └── agent.ts            # extends voice.Agent
│   ├── .env.example            # Template
│   ├── .env.local              # User credentials (gitignored)
│   ├── package.json
│   └── project.json
├── lumos-api/
│   ├── src/
│   ├── package.json
│   └── project.json
├── ui-components/              # Shared component library
│   └── src/
│       ├── components/ui/      # Button, Input, Typography, etc.
│       └── styles.css          # Design tokens
├── libs/
│   ├── canvas/                 # Multi-page canvas library
│   └── minisidebar/            # Sidebar component
├── docs/
│   ├── PROJECT.md              # Full technical docs
│   └── HACKATHON.md            # Hackathon rules
├── package.json                # Root workspace
├── AGENTS.md                   # AI assistant config
└── CLAUDE.md                   # This file
```

## Development Workflow

### First Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup lumos-agent:**
   ```bash
   cd lumos-agent
   cp .env.example .env.local
   # Edit .env.local with actual LiveKit credentials
   npm run download-files
   ```

3. **Start services:**
   ```bash
   npx nx serve lumos-client      # Terminal 1 (Next.js site)
   npx nx serve lumos-editor      # Terminal 2 (Design editor)
   npx nx serve lumos-agent       # Terminal 3 (after setup)
   npx nx serve lumos-api         # Terminal 4
   ```

### Making Changes

- **Marketing site:** Edit files in `lumos-client/src/app/`, Next.js hot reload
- **Design editor:** Edit files in `lumos-editor/src/`, Vite hot reload
- **Agent changes:** Edit `lumos-agent/src/`, tsx watch enabled
- **API changes:** Edit `lumos-api/src/`, hot reload enabled

### Testing

```bash
# Single project
npx nx test lumos-editor

# All projects
npx nx run-many -t test
```

### Building

```bash
# Single project
npx nx build lumos-editor

# All projects
npx nx run-many -t build
```

## Tech Stack Summary

| Project | Framework | Bundler | Language | Port | Purpose |
|---------|-----------|---------|----------|------|---------|
| lumos-client | Next.js 16 (App Router) | Next.js | TypeScript | 4200 | SEO-optimized marketing site |
| lumos-editor | React 19 | Vite | TypeScript | 4200 | Design editor application |
| lumos-agent | Node.js | tsx | TypeScript | - | LiveKit voice AI agent |
| lumos-api | NestJS | Webpack | TypeScript | 3000 | API backend |
| ui-components | React | Vite | TypeScript | - | Shared component library |
| canvas | React | Vite | TypeScript | - | Multi-page canvas library |

## AI Services (lumos-agent)

- **STT:** Deepgram Nova-3 (multi-language)
- **LLM:** OpenAI GPT-4o-mini
- **TTS:** Cartesia Sonic-3 (British Lady voice)
- **VAD:** Silero
- **Platform:** LiveKit Agents v1.0

## Resources

- [Full Documentation](./docs/PROJECT.md)
- [Hackathon Info](./docs/HACKATHON.md)
- [Nx Docs](https://nx.dev)
- [LiveKit Agents](https://docs.livekit.io/agents/)
- [Tailwind v4](https://tailwindcss.com/docs)

## Notes for Claude Code

- Always check `docs/PROJECT.md` for comprehensive documentation
- Use Nx commands (`npx nx`) for all tasks
- Respect the Tailwind v4 and LiveKit v1.0 API changes
- Verify imports before suggesting code changes
- Check `.env.local` exists before running lumos-agent
- Remember: npm workspaces use `*`, not `workspace:*`
