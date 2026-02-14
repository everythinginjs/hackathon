import { Title } from '@org/ui-components';
import { useShallow } from 'zustand/react/shallow';
import { useCanvas } from '../hooks/useCanvas';
import { useCanvasPages } from '../hooks/useCanvasPages';
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

  const activePageName = usePagesStore(
    useShallow((state) => state.getActivePage()?.name || 'Untitled Page')
  );

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
