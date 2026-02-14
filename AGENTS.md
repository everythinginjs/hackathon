# Lumos - AI Agent Configuration

This file provides guidance to AI coding assistants (Gemini, Claude Code, Cursor, etc.) when working with this repository.

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

## Project Overview

This is a hackathon project called **Lumos** - an AI voice agent platform built with:
- **lumos-editor**: React frontend with Vite + Tailwind CSS v4
- **lumos-agent**: LiveKit voice AI agent (Node.js with TypeScript)
- **lumos-api**: NestJS API backend
- **ui-components**: shadcn/ui component library with professional design tokens
- **libs/canvas**: Fabric.js canvas integration with Zustand state management

## Project Structure

```
/Users/amirmahmoudi/Desktop/hackathon/
├── lumos-editor/              # React app (Vite + Tailwind CSS v4)
├── lumos-agent/           # LiveKit voice AI agent
├── lumos-api/             # NestJS API
├── ui-components/         # shadcn/ui components + design tokens
├── libs/
│   └── canvas/            # Fabric.js canvas + Zustand store
├── docs/                  # Documentation
│   ├── PROJECT.md         # Technical documentation
│   ├── HACKATHON.md       # Hackathon rules
│   ├── AGENTS.md          # This file
│   └── CLAUDE.md          # Claude-specific instructions
├── .npmrc                 # NPM config (legacy-peer-deps=true)
├── package.json           # Root workspace
└── README.md              # Quick start
```

## Key Technologies

### Frontend (lumos-editor)
- React 19 with TypeScript
- Vite bundler
- **Tailwind CSS v4** (uses `@tailwindcss/postcss` plugin)
- React Router
- Jest + React Testing Library

### Voice Agent (lumos-agent)
- Node.js with TypeScript (ES Modules)
- **LiveKit Agents Framework v1.0**
- Speech-to-Text: Deepgram Nova-3
- LLM: OpenAI GPT-4o-mini
- Text-to-Speech: Cartesia Sonic-3
- VAD: Silero
- Development: tsx with hot reload

### Backend API (lumos-api)
- NestJS with TypeScript
- Webpack bundler
- Jest testing

## Essential Commands

### Start Services
```bash
npx nx serve lumos-editor          # Frontend (port 4200)
npx nx serve lumos-agent       # Voice agent
npx nx serve lumos-api         # API (port 3000)
```

### Build & Test
```bash
npx nx build <project>         # Build specific project
npx nx test <project>          # Test specific project
npx nx run-many -t build       # Build all
npx nx run-many -t test        # Test all
```

## Important Notes for AI Assistants

### Tailwind CSS v4
- Uses **NEW PostCSS plugin**: `@tailwindcss/postcss` (NOT `tailwindcss`)
- CSS imports: `@import "tailwindcss";` (NOT `@tailwind` directives)
- No `tailwind.config.js` file needed (CSS-based configuration)
- PostCSS config: `lumos-editor/postcss.config.js` must use `'@tailwindcss/postcss'`

### LiveKit Agent
- **Correct imports**: `import { voice } from '@livekit/agents';`
- **Agent class**: Extend `voice.Agent`, not just `Agent`
- **Session setup**: Use `voice.AgentSession` with `inference.STT`, `inference.LLM`, `inference.TTS`
- **Model files**: Must run download command before first use
- **Environment**: Requires `.env.local` with LiveKit credentials

### Package Management
- Uses **npm workspaces** (NOT pnpm `workspace:*` protocol)
- Dependencies reference with `*` for workspace packages
- Root `package.json` contains shared dependencies
- Each project has own `package.json` and `project.json`

### Nx Project Structure
- Each project has `project.json` for Nx configuration
- Use `cwd` option in `project.json` for correct command execution
- Schema path: `../node_modules/nx/schemas/project-schema.json`

### shadcn/ui Components (ui-components)
- **Official components**: Added via `npx shadcn@latest add <component>`
- **Design tokens**: Professional Figma/Linear-inspired color palette
- **Styling**: Tailwind CSS v4 with custom design system
- **Import paths**: Components use **relative imports** (`../../lib/utils`), not aliases
- **Setup**: Requires `.npmrc` with `legacy-peer-deps=true` for installation
- **CSS import**: lumos-editor must import styles: `@import "../../ui-components/src/styles.css"`
- **Content scanning**: lumos-editor uses `@source "../../ui-components/src"` for Tailwind

**Available Components:**
- Button (default, destructive, outline, secondary, ghost, link variants)
- Input, Textarea
- Menubar, Context Menu

**Key Configuration Files:**
- `components.json` - shadcn config
- `src/styles.css` - Design tokens (purple-blue primary, semantic colors)
- `src/design-tokens.md` - Design system documentation
- `postcss.config.js` - PostCSS with `@tailwindcss/postcss`

## Common Issues & Solutions

### Issue: Tailwind PostCSS Error
```
[postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin
```
**Solution:**
1. Install: `npm install -D @tailwindcss/postcss`
2. Update `lumos-editor/postcss.config.js`:
   ```js
   module.exports = {
     plugins: {
       '@tailwindcss/postcss': {},  // NOT 'tailwindcss'
       autoprefixer: {},
     },
   }
   ```
3. Update `lumos-editor/src/styles.css`:
   ```css
   @import "tailwindcss";  /* NOT @tailwind directives */
   ```

### Issue: LiveKit Import Error
```
SyntaxError: The requested module '@livekit/agents' does not provide an export named 'Agent'
```
**Solution:**
```typescript
// ❌ Wrong
import { Agent } from '@livekit/agents';

// ✅ Correct
import { voice } from '@livekit/agents';
export class MyAgent extends voice.Agent { }
```

### Issue: Model Files Not Found
```
Error: Required model files not found locally
```
**Solution:**
```bash
cd lumos-agent
npm run download-files  # Or tsx src/main.ts download-files
```

### Issue: Missing Credentials
```
MissingCredentialsError: API Key is required
```
**Solution:**
```bash
cd lumos-agent
cp .env.example .env.local
# Edit .env.local with actual credentials
```

### Issue: Workspace Protocol Error
```
Unsupported URL Type "workspace:": workspace:*
```
**Solution:**
Replace `workspace:*` with `*` in package.json dependencies (npm workspaces use `*`)

### Issue: shadcn Components Not Styled
**Symptoms:**
- Components render but have no styling
- Tailwind classes don't apply

**Solution:**
1. Import styles in `lumos-editor/src/main.tsx`: `import './styles.css'`
2. Update `lumos-editor/src/styles.css`:
   ```css
   @import "tailwindcss";
   @import "../../ui-components/src/styles.css";

   @source "../../ui-components/src";
   ```
3. Ensure `@import` comes before `@source` directive

### Issue: shadcn Peer Dependency Conflicts
```
ERESOLVE could not resolve - canvas peer dependency conflict
```
**Solution:**
Create `.npmrc` at project root:
```
legacy-peer-deps=true
```
Then run: `npx shadcn@latest add button --yes`

### Issue: shadcn Import Path Errors
**Problem:** Generated components use `@org/ui-components/lib/utils`

**Solution:**
```bash
cd ui-components/src/components/ui
sed -i '' 's|@org/ui-components/lib/utils|../../lib/utils|g' *.tsx
```

## Development Workflow

1. **Start UI**: `npx nx serve lumos-editor`
2. **Setup Agent**:
   - Create `lumos-agent/.env.local` with LiveKit credentials
   - Run `cd lumos-agent && npm run download-files`
   - Start: `npx nx serve lumos-agent`
3. **Start API**: `npx nx serve lumos-api`

## Testing

```bash
# All tests
npx nx run-many -t test

# Specific project
npx nx test lumos-editor
npx nx test lumos-agent
npx nx test lumos-api
```

## Documentation

For detailed information, see:
- **[docs/PROJECT.md](./docs/PROJECT.md)** - Complete technical documentation
- **[docs/HACKATHON.md](./docs/HACKATHON.md)** - Hackathon rules and submission guidelines
- **[README.md](./README.md)** - Quick start guide

## Resources

- [Nx Documentation](https://nx.dev)
- [LiveKit Agents Docs](https://docs.livekit.io/agents/)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [NestJS Documentation](https://nestjs.com)
