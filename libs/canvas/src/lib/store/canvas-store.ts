import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as fabric from 'fabric';
import { calculateThumbnailDimensions } from '../utils/thumbnail';

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

  // Canvas data operations
  saveCanvasData: () => string | null;
  loadCanvasData: (canvasData: string) => void;
  generateThumbnail: (width?: number, height?: number) => string | null;
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

      // Canvas data operations
      saveCanvasData: () => {
        const canvas = get().fabricCanvas;
        if (!canvas) return null;
        return JSON.stringify(canvas.toJSON());
      },

      loadCanvasData: (canvasData) => {
        const canvas = get().fabricCanvas;
        if (!canvas) return;

        try {
          const data = JSON.parse(canvasData);
          canvas.loadFromJSON(data, () => {
            canvas.requestRenderAll();
          });
        } catch (error) {
          console.error('Failed to load canvas data:', error);
        }
      },

      generateThumbnail: (maxWidth = 220, maxHeight = 300) => {
        const canvas = get().fabricCanvas;
        if (!canvas) return null;

        try {
          // Get the canvas dimensions
          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();

          // Calculate thumbnail dimensions using shared utility
          const { scale } = calculateThumbnailDimensions(
            canvasWidth,
            canvasHeight,
            maxWidth,
            maxHeight
          );

          // Generate thumbnail with scaling
          const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 0.8,
            enableRetinaScaling: true,
            multiplier: scale,
          });

          return dataURL;
        } catch (error) {
          console.error('Failed to generate thumbnail:', error);
          return null;
        }
      },
    }),
    { name: 'CanvasStore' }
  )
);
