import { Suspense } from 'react';
import { ChatInterface } from './components/ChatInterface';

export default function ChatPage() {
  return (
    <main className="relative min-h-screen w-full bg-background">
      <Suspense fallback={<ChatLoadingState />}>
        <ChatInterface />
      </Suspense>
    </main>
  );
}

function ChatLoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground">Initializing AI agent...</p>
      </div>
    </div>
  );
}
