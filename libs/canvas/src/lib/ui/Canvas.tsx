import { useCanvas } from '../hooks/useCanvas';
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

  return (
    <div
      className={`flex justify-center items-center w-full h-full overflow-hidden ${
        className || ''
      }`}
    >
      <canvas ref={canvasRef} className="border border-gray-300 shadow-lg" />
    </div>
  );
}
