# Lumos - Project Documentation

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

An Nx workspace for building AI voice agent applications with React and NestJS.

## Project Structure

```
/Users/amirmahmoudi/Desktop/hackathon/
├── lumos-client/          # Next.js marketing site (App Router + Tailwind CSS v4)
├── lumos-editor/          # React design editor (Vite + Tailwind CSS v4)
├── lumos-agent/           # LiveKit voice AI agent (Node.js)
├── lumos-api/             # NestJS API service
├── ui-components/         # Shared shadcn/ui component library with design tokens
├── libs/
│   ├── canvas/            # Fabric.js canvas integration with Zustand store
│   └── minisidebar/       # Reusable sidebar component
├── docs/                  # Documentation
│   ├── PROJECT.md         # This file
│   ├── HACKATHON.md       # Hackathon details and rules
│   ├── AGENTS.md          # AI agent configuration guide
│   └── CLAUDE.md          # Claude-specific instructions
├── .npmrc                 # NPM configuration (legacy-peer-deps)
├── package.json           # Root workspace configuration
├── nx.json                # Nx configuration
└── README.md              # Quick start guide
```

## Applications

### lumos-client
Next.js application for marketing and landing pages with SEO optimization.

**Tech Stack:**
- Next.js 16 with App Router
- TypeScript
- Tailwind CSS v4 (styling)
- Server-side rendering (SSR)
- Comprehensive SEO metadata (Open Graph, Twitter Cards)
- Playwright (E2E testing)

**Commands:**
```bash
npx nx serve lumos-client          # Start dev server
npx nx build lumos-client          # Build for production
npx nx test lumos-client           # Run tests (E2E with Playwright)
```

**Port:** Development server runs on http://localhost:3000

**Features:**
- SEO-optimized metadata with title templates
- Open Graph and Twitter Card support
- Robots.txt configuration
- Server-side rendering for better performance and SEO
- Shared design tokens from ui-components

### lumos-editor
React application for the design editor interface.

**Tech Stack:**
- React 19 with TypeScript
- Vite (bundler)
- Tailwind CSS v4 (styling)
- React Router (routing)
- Jest + React Testing Library (testing)

**Commands:**
```bash
npx nx serve lumos-editor          # Start dev server
npx nx build lumos-editor          # Build for production
npx nx test lumos-editor           # Run tests
```

**Port:** Development server runs on http://localhost:4200

### lumos-agent
LiveKit voice AI agent for real-time voice conversation.

**Tech Stack:**
- Node.js with TypeScript (ES Modules)
- LiveKit Agents Framework v1.0
- Speech-to-Text: Deepgram Nova-3
- LLM: OpenAI GPT-4o-mini
- Text-to-Speech: Cartesia Sonic-3
- VAD: Silero
- tsx for development

**Commands:**
```bash
npx nx serve lumos-agent       # Start dev mode with hot reload
npx nx start lumos-agent       # Start production mode
npx nx build lumos-agent       # Build TypeScript
npx nx download-files lumos-agent  # Download model files
```

**Setup:**
1. Create `.env.local` from `.env.example`
2. Add LiveKit credentials (get from https://cloud.livekit.io/)
3. Download model files: `cd lumos-agent && npm run download-files`
4. Run: `npx nx serve lumos-agent`

**Environment Variables:**
```env
LIVEKIT_URL=wss://your-url.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
OPENAI_API_KEY=sk-proj-...        # Optional
DEEPGRAM_API_KEY=...              # Optional
CARTESIA_API_KEY=...              # Optional
```

### lumos-api
NestJS application for API backend services.

**Tech Stack:**
- NestJS with TypeScript
- Webpack (bundler)
- Jest (testing)

**Commands:**
```bash
npx nx serve lumos-api         # Start dev server
npx nx build lumos-api         # Build for production
npx nx test lumos-api          # Run tests
```

## Libraries

### ui-components
Shared shadcn/ui component library with professional design tokens.

**Tech Stack:**
- React with TypeScript
- shadcn/ui components (official CLI-generated)
- Tailwind CSS v4 with PostCSS
- Radix UI primitives
- Professional design tokens (Figma/Linear-inspired)

**Components:**
- Button (all variants: default, destructive, outline, secondary, ghost, link)
- Input
- Textarea
- Menubar
- Context Menu

**Design Tokens:**
- Brand colors: Purple-blue primary (`oklch(0.55 0.22 264)`)
- Semantic colors: Success, Warning, Destructive, Info
- Typography scale with tight tracking
- Border radius tokens (sm to 4xl)
- Light and dark mode support

**Usage:**
```tsx
import { Button, Input } from '@org/ui-components';
import '@org/ui-components/styles.css';  // Import in lumos-editor/src/main.tsx

<Button variant="default">Click me</Button>
<Button variant="destructive">Delete</Button>
<Input placeholder="Enter text..." />
```

**Configuration:**
- `components.json` - shadcn configuration
- `src/styles.css` - Design tokens and theme
- `src/design-tokens.md` - Documentation
- PostCSS config with `@tailwindcss/postcss`

### libs/canvas
Fabric.js canvas integration with state management.

**Tech Stack:**
- Fabric.js 7.x (canvas manipulation)
- Zustand (state management)
- Immer (immutable updates)
- React hooks integration

**Features:**
- Canvas instance management
- Object selection tracking
- Zoom controls
- Pan mode
- Add/remove/clear objects

**Usage:**
```tsx
import { Canvas } from '@org/canvas';
import { useCanvasStore } from '@org/canvas';

// Use Canvas component
<Canvas width={800} height={600} backgroundColor="#ffffff" />

// Access store
const { fabricCanvas, addObject, selectedObjects } = useCanvasStore();
```

**Store API:**
- `fabricCanvas` - Fabric.js canvas instance
- `selectedObjects` - Currently selected objects
- `zoom` - Current zoom level
- `setZoom(zoom)` - Set zoom level
- `addObject(object)` - Add object to canvas
- `removeObject(object)` - Remove object
- `clearCanvas()` - Clear all objects

**Port:** API server runs on http://localhost:3000

## Common Nx Commands

### Run Tasks

Build any project:
```bash
npx nx build <project-name>
```

Run any task:
```bash
npx nx <target> <project-name>
```

### Run Multiple Tasks

Build all projects:
```bash
npx nx run-many -t build
```

Test all projects:
```bash
npx nx run-many -t test
```

Lint all projects:
```bash
npx nx run-many -t lint
```

### Visualize Project Graph

See dependencies between projects:
```bash
npx nx graph
```

### TypeScript Project References

Keep TypeScript references up to date:
```bash
npx nx sync
```

Verify references are correct (for CI):
```bash
npx nx sync:check
```

[Learn more about nx sync](https://nx.dev/reference/nx-commands#sync)

## Development Workflow

### Quick Start All Services

```bash
# Terminal 1: Start Marketing Site OR API (same port - choose one)
npx nx serve lumos-client    # Next.js marketing site (port 3000)
# OR
npx nx serve lumos-api       # API backend (port 3000)

# Terminal 2: Start Design Editor
npx nx serve lumos-editor    # React design editor (port 4200)

# Terminal 3: Start Agent (after setup)
npx nx serve lumos-agent
```

### Run Tests

```bash
# All tests
npx nx run-many -t test

# Specific project
npx nx test lumos-client
npx nx test lumos-editor
npx nx test lumos-agent
npx nx test lumos-api
```

### Build for Production

```bash
# Build all
npx nx run-many -t build

# Build specific
npx nx build lumos-client
npx nx build lumos-editor
npx nx build lumos-agent
npx nx build lumos-api
```

## Tech Stack Overview

### Frontend (lumos-client - Marketing Site)
- **Framework:** Next.js 16 (App Router)
- **Build Tool:** Next.js built-in (Turbopack/Webpack)
- **Styling:** Tailwind CSS v4
- **Routing:** Next.js App Router (file-based)
- **Testing:** Playwright (E2E)
- **Language:** TypeScript
- **Rendering:** Server-side rendering (SSR)

### Frontend (lumos-editor - Design Editor)
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v6
- **Testing:** Jest + React Testing Library
- **Language:** TypeScript
- **Canvas:** Fabric.js with Zustand state management

### Backend (API)
- **Framework:** NestJS
- **Build Tool:** Webpack
- **Testing:** Jest
- **Language:** TypeScript

### Voice Agent
- **Runtime:** Node.js (ES Modules)
- **Framework:** LiveKit Agents
- **AI Services:**
  - STT: Deepgram Nova-3
  - LLM: OpenAI GPT-4o-mini
  - TTS: Cartesia Sonic-3
  - VAD: Silero
- **Language:** TypeScript

## Troubleshooting

### Tailwind CSS Issues

**PostCSS plugin error:**
```
It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin
```
- Install: `npm install -D @tailwindcss/postcss --legacy-peer-deps`
- Update `postcss.config.js` (both lumos-client and lumos-editor) to use `'@tailwindcss/postcss'` instead of `'tailwindcss'`
- Change CSS files from `@tailwind base/components/utilities` to `@import "tailwindcss"`

**Shadcn components not styled:**
- Ensure CSS files import ui-components styles:
  - `lumos-client/src/app/global.css`:
  ```css
  @import "tailwindcss";
  @import "../../../ui-components/src/styles.css";
  @source "../../../ui-components/src";
  ```
  - `lumos-editor/src/styles.css`:
  ```css
  @import "tailwindcss";
  @import "../../ui-components/src/styles.css";
  @source "../../ui-components/src";
  ```
- Verify `@import` statements come before `@source` directive
- Check entry files import styles:
  - `lumos-client/src/app/layout.tsx` imports `./global.css` automatically
  - `lumos-editor/src/main.tsx` imports `'./styles.css'`

**Classes not applying:**
- Tailwind needs to scan ui-components for classes
- Use `@source "../../ui-components/src"` (or `"../../../ui-components/src"` for lumos-client) in CSS files
- Ensure PostCSS processes CSS imports correctly

### LiveKit Agent Issues

**Missing credentials:**
```
MissingCredentialsError: API Key is required
```
- Create `.env.local` in `lumos-agent/`
- Add your LiveKit credentials

**Model files not found:**
```
Error: Required model files not found locally
```
- Run: `cd lumos-agent && npm run download-files`

**Import errors:**
```
SyntaxError: The requested module does not provide an export
```
- Ensure you're using correct imports: `import { voice } from '@livekit/agents'`

### Shadcn/UI Issues

**Peer dependency conflicts:**
```
ERESOLVE could not resolve
```
- Root cause: fabric.js requires canvas@3.x but jsdom requires canvas@2.x
- Solution: Use `--legacy-peer-deps` flag or create `.npmrc`:
```
legacy-peer-deps=true
```
- Add components: `npx shadcn@latest add button --yes`

**Import path errors in components:**
- Shadcn generates imports with alias: `@org/ui-components/lib/utils`
- Must use relative paths inside ui-components: `../../lib/utils`
- Fix automatically: `sed -i '' 's|@org/ui-components/lib/utils|../../lib/utils|g' src/components/ui/*.tsx`

### Permission Issues

If npm install fails with EACCES:
```bash
# Fix node_modules permissions
sudo chown -R $(whoami) node_modules

# Or fix npm cache
sudo chown -R $(whoami) ~/.npm
```

## Nx Cloud

Nx Cloud provides fast and scalable CI with features like:
- [Remote caching](https://nx.dev/ci/features/remote-cache)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks)

🚀 [Connect to Nx Cloud](https://cloud.nx.app/connect/ZvxWKWElKB) for faster builds.

### Set up CI

For non-GitHub Actions CI providers:
```bash
npx nx g ci-workflow
```

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx)

## Editor Setup

### Nx Console

Nx Console is an editor extension that enhances your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE.

Available for VSCode and IntelliJ.

[Install Nx Console](https://nx.dev/getting-started/editor-setup)

## Useful Links

### Documentation
- [Nx Documentation](https://nx.dev)
- [LiveKit Agents Documentation](https://docs.livekit.io/agents/)
- [React Documentation](https://react.dev)
- [NestJS Documentation](https://nestjs.com)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

### Project Resources
- [Nx Plugins](https://nx.dev/concepts/nx-plugins)
- [Nx on CI](https://nx.dev/ci/intro/ci-with-nx)
- [Nx Release](https://nx.dev/features/manage-releases)

### Community
- [Nx Discord](https://go.nx.dev/community)
- [Nx on X/Twitter](https://twitter.com/nxdevtools)
- [Nx on LinkedIn](https://www.linkedin.com/company/nrwl)
- [Nx Youtube](https://www.youtube.com/@nxdevtools)
- [Nx Blog](https://nx.dev/blog)

## License

Private - Hackathon Project
