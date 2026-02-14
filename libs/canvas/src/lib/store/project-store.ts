import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ProjectState {
  // Canvas dimensions (applies to all pages)
  canvasWidth: number;
  canvasHeight: number;

  // Actions
  setCanvasDimensions: (width: number, height: number) => void;
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    (set) => ({
      // Default canvas dimensions
      canvasWidth: 800,
      canvasHeight: 600,

      // Set canvas dimensions
      setCanvasDimensions: (width, height) =>
        set({ canvasWidth: width, canvasHeight: height }),
    }),
    { name: 'ProjectStore' }
  )
);
