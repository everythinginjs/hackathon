import { useCanvas } from '../hooks/useCanvas';
import { useCanvasPages } from '../hooks/useCanvasPages';
import * as fabric from 'fabric';
import { useCanvasStore } from '../store/canvas-store';
import { Button } from '@org/ui-components';

export interface CanvasProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  className?: string;
}

export function Canvas({
  width = 800,
  height = 600,
  backgroundColor = '#ffffff',
  className,
}: CanvasProps) {
  const { canvasRef } = useCanvas({ width, height, backgroundColor });

  // Enable automatic page loading/saving when switching pages
  useCanvasPages();

  const { fabricCanvas } = useCanvasStore();

  function addCircle() {
    // This function is just for testing purposes to add a circle to the canvas
    if (fabricCanvas) {
      const circle = new fabric.Circle({
        radius: 50,
        fill: 'red',
        left: 100,
        top: 100,
      });
      fabricCanvas.add(circle);
      fabricCanvas.requestRenderAll();
    }
  }

  return (
    <div
      className={`flex flex-col justify-center items-center w-full h-full overflow-hidden ${
        className || ''
      }`}
    >
      <Button onClick={addCircle} className="mb-4">
        Add Circle
      </Button>
      <canvas ref={canvasRef} className="border border-gray-300 shadow-lg" />
    </div>
  );
}
