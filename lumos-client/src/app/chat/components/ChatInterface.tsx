'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Textarea } from '@org/ui-components';
import { Send, Sparkles, Loader2, ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

type ChatState = 'initializing' | 'questioning' | 'generating' | 'complete';

export function ChatInterface() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('query') || '';

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chatState, setChatState] = useState<ChatState>('initializing');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize chat with user's initial query
    if (initialQuery) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: initialQuery,
        timestamp: new Date(),
      };

      setMessages([userMessage]);

      // Simulate AI agent starting the conversation
      setTimeout(() => {
        startAgentConversation(initialQuery);
      }, 1000);
    }
  }, [initialQuery]);

  const startAgentConversation = async (query: string) => {
    setIsTyping(true);
    setChatState('questioning');

    // Simulate agent thinking
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const agentMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'agent',
      content: `Great! I'll help you create "${query}". To make the perfect design, I have a few questions:

1. **What's the primary purpose** of this design? (e.g., marketing, branding, social media, etc.)

2. **Who is your target audience?** (e.g., young professionals, families, tech enthusiasts, etc.)

3. **Do you have any specific color preferences** or brand colors to include?

Let's start with the first question - what's the primary purpose?`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, agentMessage]);
    setIsTyping(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate agent processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Determine which question to ask next based on message count
    const userMessageCount = messages.filter((m) => m.role === 'user').length + 1;

    let agentResponse = '';

    if (userMessageCount === 2) {
      agentResponse = `Perfect! Now, **who is your target audience?** This will help me tailor the design to resonate with the right people.`;
    } else if (userMessageCount === 3) {
      agentResponse = `Excellent! Last question: **Do you have any specific color preferences** or brand colors you'd like me to incorporate?`;
    } else if (userMessageCount >= 4) {
      setChatState('generating');
      agentResponse = `Amazing! I have all the information I need. Let me create 5 unique design variations for you...`;

      // Simulate design generation
      setTimeout(() => {
        router.push('/chat/results?designs=generated');
      }, 3000);
    }

    const agentMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'agent',
      content: agentResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, agentMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold">Lumos AI Designer</h1>
                <p className="text-xs text-muted-foreground">
                  {chatState === 'initializing' && 'Initializing...'}
                  {chatState === 'questioning' && 'Asking questions'}
                  {chatState === 'generating' && 'Generating designs...'}
                  {chatState === 'complete' && 'Complete'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">Connected</span>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 bg-muted rounded-lg px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {chatState === 'generating' && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-lg border bg-card">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <span className="text-sm font-medium">
                    Generating 5 unique design variations...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      {chatState !== 'generating' && (
        <div className="sticky bottom-0 bg-background border-t">
          <div className="container mx-auto px-4 py-4 max-w-4xl">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your answer... (Press Enter to send, Shift+Enter for new line)"
                className="resize-none max-h-32"
                rows={1}
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                size="icon"
                className="h-10 w-10 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI is helping you create the perfect design. Answer honestly for best results.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
      )}

      <div
        className={`flex-1 max-w-[80%] ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-lg'
            : 'bg-muted rounded-lg'
        } px-4 py-3`}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        <div
          className={`text-xs mt-1 ${
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-semibold">
          U
        </div>
      )}
    </div>
  );
}
