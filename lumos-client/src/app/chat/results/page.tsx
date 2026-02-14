import { Suspense } from 'react';
import { DesignGallery } from './components/DesignGallery';

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<LoadingGallery />}>
        <DesignGallery />
      </Suspense>
    </main>
  );
}

function LoadingGallery() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground">Loading your designs...</p>
      </div>
    </div>
  );
}
