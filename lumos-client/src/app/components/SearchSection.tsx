'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea, Button, Badge, Card } from '@org/ui-components';
import { Sparkles, ArrowRight } from 'lucide-react';

export function SearchSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      return;
    }

    setIsLoading(true);

    // Navigate to chat page with the query
    const encodedQuery = encodeURIComponent(searchQuery);
    router.push(`/chat?query=${encodedQuery}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without modifiers)
    if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
    // Allow Command+Enter or Ctrl+Enter or Shift+Enter for new line (default behavior)
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10">
      {/* Badge */}
      <div className="flex justify-center">
        <Badge variant="outline" className="gap-2 px-4 py-2 text-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-medium">AI Design Platform</span>
          <ArrowRight className="w-3 h-3" />
        </Badge>
      </div>

      {/* Headline Section */}
      <div className="text-center space-y-3">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Designs in seconds
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto">
          If you imagine it, we create it.
        </p>
      </div>

      {/* Search Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          {/* Search Bar Container */}
          <div className="rounded-2xl bg-card/80 backdrop-blur-md border border-border shadow-lg overflow-hidden">
            {/* Input Area */}
            <div className="relative">
              <Textarea
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your design idea and get AI-generated results in seconds..."
                className="min-h-[100px] max-h-[300px] resize-none text-base border-0 bg-transparent px-6 py-4 pr-24 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
                disabled={isLoading}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="outline"
                size="icon"
                disabled={!searchQuery.trim() || isLoading}
                className="absolute bottom-4 right-4"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Popular Searches */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          'Minimalist product mockup',
          'Vibrant social media carousel',
          'Professional presentation deck',
          'Eye-catching event flyer',
          'Modern brand identity kit',
          'Sleek app landing page',
        ].map((search) => (
          <Badge
            key={search}
            variant="outline"
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => setSearchQuery(search)}
          >
            {search}
          </Badge>
        ))}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: '⚡',
            title: 'Lightning Fast',
            description: 'Get 5 design variations in seconds',
          },
          {
            icon: '🎨',
            title: 'AI-Powered',
            description: 'Advanced AI understands your vision',
          },
          {
            icon: '✨',
            title: 'Fully Editable',
            description: 'Customize every aspect in our editor',
          },
        ].map((feature) => (
          <Card
            key={feature.title}
            className="p-4 bg-card/30 backdrop-blur-sm gap-2"
          >
            <div className="text-2xl">{feature.icon}</div>
            <h3 className="font-semibold text-sm">{feature.title}</h3>
            <p className="text-xs text-muted-foreground">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
