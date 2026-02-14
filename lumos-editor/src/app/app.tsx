import {
  Canvas,
  CanvasPageSidebar,
  useCanvasKeyboardShortcuts,
} from '@org/canvas';
import { useTheme } from '@org/theme-mode';
import { Moon, Sun } from 'lucide-react';

export function App() {
  // Enable keyboard shortcuts for page management
  useCanvasKeyboardShortcuts();

  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen w-screen bg-background">
      {/* Page management sidebar */}
      <CanvasPageSidebar />

      {/* Canvas area */}
      <main className="flex-1 grid place-items-center relative">
        <Canvas />

        {/* Theme toggle button - fixed position */}
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 p-2 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 hover:bg-accent transition-colors z-50"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </main>
    </div>
  );
}

export default App;
