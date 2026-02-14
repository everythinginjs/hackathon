import {
  type JobContext,
  type JobProcess,
  ServerOptions,
  cli,
  defineAgent,
  inference,
  metrics,
  voice,
} from '@livekit/agents';
import * as livekit from '@livekit/agents-plugin-livekit';
import * as silero from '@livekit/agents-plugin-silero';
import { BackgroundVoiceCancellation } from '@livekit/noise-cancellation-node';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { LumosAgent } from './agent.js';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

export default defineAgent({
  // Pre-warm the Silero VAD model during initialization
  prewarm: async (proc: JobProcess) => {
    proc.userData.vad = await silero.VAD.load();
  },

  // Main agent entry point
  entry: async (ctx: JobContext) => {
    // Create voice session with AI models
    const session = new voice.AgentSession({
      stt: new inference.STT({
        model: 'deepgram/nova-3',      // Speech-to-Text: Deepgram Nova 3
        language: 'multi',              // Multi-language support
      }),
      llm: new inference.LLM({
        model: 'openai/gpt-4o-mini',    // Language Model: GPT-4o-mini
      }),
      tts: new inference.TTS({
        model: 'cartesia/sonic-3',      // Text-to-Speech: Cartesia Sonic 3
        voice: '79a125e8-cd45-4c13-8a67-188112f4dd22', // British Lady voice
      }),
      turnDetection: new livekit.turnDetector.MultilingualModel(),
      vad: ctx.proc.userData.vad! as silero.VAD,
      voiceOptions: {
        preemptiveGeneration: true,     // Generate responses while listening
      },
    });

    // Track usage metrics
    const usageCollector = new metrics.UsageCollector();
    session.on(voice.AgentSessionEventTypes.MetricsCollected, (ev) => {
      metrics.logMetrics(ev.metrics);
      usageCollector.collect(ev.metrics);
    });

    // Log usage summary on shutdown
    ctx.addShutdownCallback(async () => {
      console.log(`Usage Summary: ${JSON.stringify(usageCollector.getSummary())}`);
    });

    // Start the session
    await session.start({
      agent: new LumosAgent(),
      room: ctx.room,
      inputOptions: {
        noiseCancellation: BackgroundVoiceCancellation(), // LiveKit Cloud noise cancellation
      },
    });

    // Connect to the room
    await ctx.connect();

    // Send initial greeting
    session.generateReply({
      instructions: 'Greet the user in a friendly and helpful manner. Introduce yourself as Lumos.',
    });
  },
});

// Run the agent CLI
cli.runApp(
  new ServerOptions({
    agent: fileURLToPath(import.meta.url),
    agentName: 'lumos-agent',
  }),
);
