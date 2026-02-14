import { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { useCanvasStore } from '../store/canvas-store';

interface UseCanvasOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
}

export function useCanvas(options: UseCanvasOptions = {}) {
  const { width = 800, height = 600, backgroundColor = '#ffffff' } = options;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { fabricCanvas, setFabricCanvas, setSelectedObjects } =
    useCanvasStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor,
    });

    // Set up selection events
    canvas.on('selection:created', (e) => {
      const selected = canvas.getActiveObjects();
      setSelectedObjects(selected);
    });

    canvas.on('selection:updated', (e) => {
      const selected = canvas.getActiveObjects();
      setSelectedObjects(selected);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObjects([]);
    });

    // Store canvas instance in zustand
    setFabricCanvas(canvas);

    // Cleanup
    return () => {
      canvas.dispose();
      setFabricCanvas(null);
    };
  }, [width, height, backgroundColor, setFabricCanvas, setSelectedObjects]);

  return {
    canvasRef,
    fabricCanvas,
  };
}
