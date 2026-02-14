'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@org/ui-components';
import { ArrowLeft, Edit, Download, Heart, Share2, Sparkles } from 'lucide-react';

interface Design {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  colors: string[];
}

// Mock generated designs
const MOCK_DESIGNS: Design[] = [
  {
    id: '1',
    title: 'Design Variation 1',
    description: 'Modern minimalist approach with clean lines',
    thumbnail: 'https://via.placeholder.com/600x400/8B5CF6/FFFFFF?text=Design+1',
    colors: ['#8B5CF6', '#EC4899', '#06B6D4'],
  },
  {
    id: '2',
    title: 'Design Variation 2',
    description: 'Bold and vibrant color palette',
    thumbnail: 'https://via.placeholder.com/600x400/EC4899/FFFFFF?text=Design+2',
    colors: ['#EC4899', '#F59E0B', '#10B981'],
  },
  {
    id: '3',
    title: 'Design Variation 3',
    description: 'Professional corporate style',
    thumbnail: 'https://via.placeholder.com/600x400/06B6D4/FFFFFF?text=Design+3',
    colors: ['#06B6D4', '#3B82F6', '#6366F1'],
  },
  {
    id: '4',
    title: 'Design Variation 4',
    description: 'Playful and creative design',
    thumbnail: 'https://via.placeholder.com/600x400/F59E0B/FFFFFF?text=Design+4',
    colors: ['#F59E0B', '#EF4444', '#8B5CF6'],
  },
  {
    id: '5',
    title: 'Design Variation 5',
    description: 'Elegant and sophisticated look',
    thumbnail: 'https://via.placeholder.com/600x400/6366F1/FFFFFF?text=Design+5',
    colors: ['#6366F1', '#8B5CF6', '#EC4899'],
  },
];

export function DesignGallery() {
  const router = useRouter();
  const [hoveredDesign, setHoveredDesign] = useState<string | null>(null);
  const [likedDesigns, setLikedDesigns] = useState<Set<string>>(new Set());

  const handleEditDesign = (designId: string) => {
    // Redirect to lumos-editor with design data
    const editorUrl = `http://localhost:4200?designId=${designId}&source=ai-generation`;
    window.open(editorUrl, '_blank');
  };

  const toggleLike = (designId: string) => {
    setLikedDesigns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(designId)) {
        newSet.delete(designId);
      } else {
        newSet.add(designId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/chat')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-semibold text-lg">Your AI-Generated Designs</h1>
                <p className="text-sm text-muted-foreground">
                  5 unique variations ready to edit
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Create New
            </Button>
          </div>
        </div>
      </header>

      {/* Success Message */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-lg border bg-card p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">
                  Your designs are ready!
                </h2>
                <p className="text-muted-foreground">
                  We've created 5 unique design variations based on your preferences. Click on
                  any design to edit it in our powerful design editor, or download them
                  directly.
                </p>
              </div>
            </div>
          </div>

          {/* Design Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_DESIGNS.map((design) => (
              <div
                key={design.id}
                className="group relative"
                onMouseEnter={() => setHoveredDesign(design.id)}
                onMouseLeave={() => setHoveredDesign(null)}
              >
                <div className="relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-200 hover:shadow-md">
                  {/* Design Thumbnail */}
                  <div className="relative aspect-[3/2] overflow-hidden bg-muted">
                    <img
                      src={design.thumbnail}
                      alt={design.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Hover Overlay */}
                    <div
                      className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${
                        hoveredDesign === design.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center gap-2 p-4">
                        <Button
                          onClick={() => handleEditDesign(design.id)}
                          size="lg"
                        >
                          <Edit className="w-4 h-4" />
                          Edit in Editor
                        </Button>
                      </div>

                      <div className="absolute top-3 right-3 flex gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(design.id);
                          }}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              likedDesigns.has(design.id)
                                ? 'fill-red-500 text-red-500'
                                : ''
                            }`}
                          />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle share
                          }}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Design Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{design.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {design.description}
                      </p>
                    </div>

                    {/* Color Palette */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Colors:</span>
                      <div className="flex gap-1">
                        {design.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditDesign(design.id)}
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-3 h-3" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="mt-12 text-center space-y-4">
            <p className="text-muted-foreground">
              Not quite what you were looking for?
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => router.push('/chat')}>
                <ArrowLeft className="w-4 h-4" />
                Refine with AI
              </Button>
              <Button
                onClick={() => router.push('/')}
              >
                <Sparkles className="w-4 h-4" />
                Start New Design
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
