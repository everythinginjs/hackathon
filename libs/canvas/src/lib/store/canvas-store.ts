import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as fabric from 'fabric';

interface CanvasState {
  // Canvas instance
  fabricCanvas: fabric.Canvas | null;

  // Canvas state
  selectedObjects: fabric.Object[];
  zoom: number;
  isPanning: boolean;

  // Actions
  setFabricCanvas: (canvas: fabric.Canvas | null) => void;
  setSelectedObjects: (objects: fabric.Object[]) => void;
  setZoom: (zoom: number) => void;
  setIsPanning: (isPanning: boolean) => void;

  // Canvas operations
  addObject: (object: fabric.Object) => void;
  removeObject: (object: fabric.Object) => void;
  clearCanvas: () => void;
}

export const useCanvasStore = create<CanvasState>()(
  devtools(
    (set, get) => ({
      // Initial state
      fabricCanvas: null,
      selectedObjects: [],
      zoom: 1,
      isPanning: false,

      // Actions
      setFabricCanvas: (canvas) => set({ fabricCanvas: canvas }),

      setSelectedObjects: (objects) => set({ selectedObjects: objects }),

      setZoom: (zoom) => {
        set({ zoom });
        const canvas = get().fabricCanvas;
        if (canvas) {
          canvas.setZoom(zoom);
          canvas.requestRenderAll();
        }
      },

      setIsPanning: (isPanning) => set({ isPanning }),

      // Canvas operations
      addObject: (object) => {
        const canvas = get().fabricCanvas;
        if (canvas) {
          canvas.add(object);
          canvas.requestRenderAll();
        }
      },

      removeObject: (object) => {
        const canvas = get().fabricCanvas;
        if (canvas) {
          canvas.remove(object);
          canvas.requestRenderAll();
        }
      },

      clearCanvas: () => {
        const canvas = get().fabricCanvas;
        if (canvas) {
          canvas.clear();
          canvas.requestRenderAll();
        }
        set({ selectedObjects: [] });
      },
    }),
    { name: 'CanvasStore' }
  )
);
