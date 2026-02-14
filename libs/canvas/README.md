# @org/canvas

A canvas library built with Fabric.js for creating and managing multi-page canvas projects.

## Features

- **Multi-page canvas management** - Create, delete, duplicate, and reorder pages
- **Auto-save functionality** - Event-based auto-save with debouncing (500ms)
- **Automatic thumbnails** - Dynamic thumbnail generation with proper aspect ratio
- **Keyboard shortcuts** - Built-in keyboard shortcuts for common operations
- **Project-level configuration** - Centralized canvas dimensions management
- **Zustand state management** - Efficient state management with Zustand

## Installation

This library is part of the monorepo and uses Nx workspace configuration.

## Usage

### Basic Canvas Setup

```typescript
import { Canvas } from '@org/canvas';

function App() {
  return (
    <Canvas
      width={800}
      height={600}
      backgroundColor="#ffffff"
    />
  );
}
```

### Multi-page Management

```typescript
import { CanvasPageSidebar } from '@org/canvas';

function App() {
  return (
    <div className="flex h-screen">
      <CanvasPageSidebar />
      <Canvas width={800} height={600} />
    </div>
  );
}
```

### Using Stores

**IMPORTANT: Always use `useShallow` to prevent unnecessary re-renders**

```typescript
import { useShallow } from 'zustand/react/shallow';
import { useCanvasStore, usePagesStore, useProjectStore } from '@org/canvas';

function MyComponent() {
  // ✅ CORRECT: Using useShallow to subscribe only to specific properties
  const { fabricCanvas, addObject, removeObject } = useCanvasStore(
    useShallow((state) => ({
      fabricCanvas: state.fabricCanvas,
      addObject: state.addObject,
      removeObject: state.removeObject,
    }))
  );

  // ✅ CORRECT: Page management with useShallow
  const { pages, activePageId, addPage, deletePage } = usePagesStore(
    useShallow((state) => ({
      pages: state.pages,
      activePageId: state.activePageId,
      addPage: state.addPage,
      deletePage: state.deletePage,
    }))
  );

  // ✅ CORRECT: Project configuration with useShallow
  const { canvasWidth, canvasHeight } = useProjectStore(
    useShallow((state) => ({
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
    }))
  );

  // ❌ WRONG: Without useShallow - subscribes to entire store
  // const { fabricCanvas } = useCanvasStore(); // Don't do this!
}
```

**Why use `useShallow`?**
- **Performance**: Only re-renders when the specific properties you select change
- **Efficiency**: Without `useShallow`, the component re-renders on ANY store change
- **Best Practice**: Prevents unnecessary re-renders across your application

### Thumbnail Utilities

```typescript
import { calculateThumbnailDimensions } from '@org/canvas';

const { thumbnailWidth, thumbnailHeight, scale } = calculateThumbnailDimensions(
  800,  // canvas width
  600,  // canvas height
  220,  // max thumbnail width
  300   // max thumbnail height
);
```

## API Reference

### Components

- **`Canvas`** - Main canvas component with Fabric.js integration
- **`CanvasPageSidebar`** - Sidebar with page list and controls
- **`CanvasPageList`** - Page list component with thumbnails

### Stores

- **`useCanvasStore`** - Canvas state and operations
  - `fabricCanvas`: Fabric.js canvas instance
  - `addObject()`, `removeObject()`, `clearCanvas()`
  - `saveCanvasData()`, `loadCanvasData()`
  - `generateThumbnail()`: Generates thumbnail with proper aspect ratio

- **`usePagesStore`** - Page management
  - `pages`: Array of canvas pages
  - `activePageId`: Currently active page
  - `addPage()`, `deletePage()`, `duplicatePage()`
  - `movePageUp()`, `movePageDown()`
  - `updatePageData()`: Update canvas data and thumbnail

- **`useProjectStore`** - Project-level configuration
  - `canvasWidth`, `canvasHeight`: Project canvas dimensions
  - `setCanvasDimensions()`: Update canvas dimensions

### Hooks

- **`useCanvas()`** - Initialize Fabric.js canvas
- **`useCanvasPages()`** - Auto-save and page switching logic
- **`useCanvasKeyboardShortcuts()`** - Keyboard shortcuts for canvas operations

### Utilities

- **`calculateThumbnailDimensions()`** - Calculate thumbnail dimensions with aspect ratio

## Auto-save Behavior

The canvas automatically saves:
- **On canvas modifications** - Using Fabric.js events (`object:modified`, `object:added`, `object:removed`)
- **Debounced to 500ms** - Prevents excessive saves during rapid edits
- **Before page switches** - Ensures no data loss when navigating between pages
- **Includes thumbnails** - Generates 220x300 max thumbnails with proper aspect ratio

## Thumbnail Generation

Thumbnails are automatically generated with:
- **Aspect ratio preservation** - Matches canvas aspect ratio exactly
- **Max dimensions** - Fits within 220x300 bounds
- **High quality** - PNG format with 0.8 quality
- **Retina support** - Enabled for crisp display on high-DPI screens

Example: 800x600 canvas (4:3) → 220x165 thumbnail

## Performance Best Practices

### Always Use `useShallow` with Zustand Stores

When accessing Zustand stores, **always** use `useShallow` to prevent unnecessary re-renders:

```typescript
import { useShallow } from 'zustand/react/shallow';

// ✅ GOOD - Only re-renders when fabricCanvas changes
const fabricCanvas = useCanvasStore(
  useShallow((state) => state.fabricCanvas)
);

// ✅ GOOD - Only re-renders when any selected property changes
const { pages, activePageId, addPage } = usePagesStore(
  useShallow((state) => ({
    pages: state.pages,
    activePageId: state.activePageId,
    addPage: state.addPage,
  }))
);

// ❌ BAD - Re-renders on ANY store change, even unrelated ones
const { pages } = usePagesStore();
```

### Why This Matters

Without `useShallow`:
- Component re-renders whenever **ANY** property in the store changes
- Even if you only use `fabricCanvas`, changes to `zoom` or `isPanning` trigger re-renders
- Can cause performance issues in complex applications

With `useShallow`:
- Component only re-renders when **selected properties** change
- React can efficiently compare the shallow object returned by your selector
- Significant performance improvement, especially with frequent store updates

### Example Impact

```typescript
// Without useShallow - 100 re-renders per second
const { fabricCanvas } = useCanvasStore(); // Re-renders on zoom, pan, selection, etc.

// With useShallow - Only re-renders when fabricCanvas instance changes
const fabricCanvas = useCanvasStore(
  useShallow((state) => state.fabricCanvas)
);
```

## Running unit tests

Run `nx test canvas` to execute the unit tests via [Vitest](https://vitest.dev/).
