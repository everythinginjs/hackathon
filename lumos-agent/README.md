# Lumos Agent - LiveKit Voice AI

A LiveKit-based voice AI agent using Node.js. This agent provides real-time voice-to-voice conversation capabilities.

## Features

- Voice-to-voice conversation using LiveKit Agents
- Speech-to-Text (STT) with Deepgram Nova-3
- Large Language Model (LLM) with OpenAI GPT-4o-mini
- Text-to-Speech (TTS) with Cartesia Sonic-3
- Voice Activity Detection (VAD) with Silero
- Multi-language support

## Prerequisites

- Node.js >= 22.0.0
- npm or pnpm
- LiveKit Cloud account (free at [https://cloud.livekit.io/](https://cloud.livekit.io/))
- API keys for:
  - OpenAI (for LLM)
  - Deepgram (for STT)
  - Cartesia (for TTS)

## Setup

### 1. Install Dependencies

```bash
cd lumos-agent
npm install
```

### 2. Download Model Files

Download required VAD model files:

```bash
npm run download-files
```

### 3. Configure Environment Variables

Create a `.env.local` file from the example:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your credentials:

```env
LIVEKIT_URL=wss://your-livekit-url.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
OPENAI_API_KEY=your_openai_key
DEEPGRAM_API_KEY=your_deepgram_key
CARTESIA_API_KEY=your_cartesia_key
```

## Running the Agent

### Development Mode

Run with hot reload:

```bash
npm run dev
```

### Production Mode

Build and run:

```bash
npm run build
npm start
```

## Project Structure

```
lumos-agent/
├── src/
│   ├── agent.ts      # LumosAgent class with instructions
│   └── main.ts       # Main entry point and pipeline configuration
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

## Customization

### Modify Agent Personality

Edit `src/agent.ts` to change how Lumos behaves:

```typescript
export class LumosAgent extends VoiceAssistant {
  constructor() {
    super({
      instructions: `Your custom instructions here...`,
    });
  }
}
```

### Change Voice Models

Edit `src/main.ts` to configure different models:

**Speech-to-Text (STT):**
```typescript
stt: new deepgram.STT({
  model: 'nova-3',        // Try 'nova-2', 'whisper', etc.
  language: 'en',         // Or 'multi' for multilingual
}),
```

**Language Model (LLM):**
```typescript
llm: new openai.LLM({
  model: 'gpt-4o-mini',  // Try 'gpt-4o', 'gpt-4-turbo', etc.
}),
```

**Text-to-Speech (TTS):**
```typescript
tts: new cartesia.TTS({
  voice: '79a125e8-cd45-4c13-8a67-188112f4dd22',  // Change voice ID
}),
```

Available Cartesia voices:
- British Lady: `79a125e8-cd45-4c13-8a67-188112f4dd22`
- [See more voices](https://docs.cartesia.ai/getting-started/available-voices)

## Connecting a Frontend

To interact with the agent, you'll need a client application. Use one of these LiveKit client SDKs:

- [React/Next.js](https://docs.livekit.io/home/client/quickstarts/react/)
- [Swift (iOS/macOS)](https://docs.livekit.io/client-sdk-swift/)
- [Flutter](https://docs.livekit.io/client-sdk-flutter/)
- [React Native](https://docs.livekit.io/client-sdk-react-native/)
- [Android](https://docs.livekit.io/client-sdk-android/)

## Troubleshooting

**Module not found errors:**
- Run `npm install` to ensure all dependencies are installed

**Environment variable errors:**
- Check that `.env.local` exists and contains all required variables
- Verify your API keys are correct and active

**Model download errors:**
- Run `npm run download-files` to download required model files
- Check your internet connection

## Resources

- [LiveKit Agents Documentation](https://docs.livekit.io/agents/)
- [LiveKit Cloud Console](https://cloud.livekit.io/)
- [LiveKit Agent Starter Example](https://github.com/livekit-examples/agent-starter-node)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Deepgram API Documentation](https://developers.deepgram.com/)
- [Cartesia API Documentation](https://docs.cartesia.ai/)

## License

Private - Hackathon Project
