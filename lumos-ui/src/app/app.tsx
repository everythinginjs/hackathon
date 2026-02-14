import {
  Canvas,
  CanvasPageSidebar,
  useCanvasKeyboardShortcuts,
} from '@org/canvas';

export function App() {
  // Enable keyboard shortcuts for page management
  useCanvasKeyboardShortcuts();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Page management sidebar */}
      <CanvasPageSidebar />

      {/* Canvas area */}
      <main className="flex-1 overflow-hidden">
        <Canvas />
      </main>
    </div>
  );
}

export default App;
