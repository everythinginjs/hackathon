import { Title } from '@org/ui-components';
import * as fabric from 'fabric';
import { useShallow } from 'zustand/react/shallow';
import { useCanvas } from '../hooks/useCanvas';
import { useCanvasPages } from '../hooks/useCanvasPages';
import { useCanvasStore } from '../store/canvas-store';
import { usePagesStore } from '../store/pages-store';

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

  const fabricCanvas = useCanvasStore(
    useShallow((state) => state.fabricCanvas)
  );

  const activePageName = usePagesStore(
    useShallow((state) => state.getActivePage()?.name || 'Untitled Page')
  );

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
      style={{
        width,
      }}
      className={`flex flex-col justify-center items-center w-full h-full ${
        className || ''
      }`}
    >
      <Title className="text-muted-foreground self-start mb-1">
        {activePageName}
      </Title>
      <canvas ref={canvasRef} className="border border-gray-300 shadow-lg" />
    </div>
  );
}
