import { useShallow } from 'zustand/react/shallow';
import { useCanvasStore } from '../store/canvas-store';
import { ShapeFactory, AVAILABLE_SHAPES } from '../utils/shapes';
import {
  Square,
  Circle,
  Triangle,
  Minus,
  Pentagon,
  Star,
} from 'lucide-react';
import { Button } from '@org/ui-components';

// Map icon names to Lucide components
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Square,
  Circle,
  Triangle,
  Minus,
  Pentagon,
  Star,
};

export function ElementsPanel() {
  const { fabricCanvas, addObject } = useCanvasStore(
    useShallow((state) => ({
      fabricCanvas: state.fabricCanvas,
      addObject: state.addObject,
    }))
  );

  const handleAddShape = (shapeId: string) => {
    console.log('handleAddShape called with:', shapeId);

    if (!fabricCanvas) {
      console.error('No fabricCanvas available');
      return;
    }

    const shapeMetadata = AVAILABLE_SHAPES.find((s) => s.id === shapeId);
    if (!shapeMetadata) {
      console.error('Shape metadata not found for:', shapeId);
      return;
    }

    console.log('Creating shape:', shapeMetadata.factory);

    // Create the shape using the factory
    const shape = ShapeFactory[shapeMetadata.factory]();

    console.log('Shape created:', shape);

    // Position shape at canvas center
    const canvasCenter = fabricCanvas.getVpCenter();

    // Get shape bounds for centering
    const shapeBounds = shape.getBoundingRect();

    shape.set({
      left: canvasCenter.x - shapeBounds.width / 2,
      top: canvasCenter.y - shapeBounds.height / 2,
    });

    console.log('Adding shape to canvas at:', {
      left: shape.left,
      top: shape.top,
      center: canvasCenter,
    });

    // Add to canvas using the store action
    addObject(shape);

    console.log('Shape added, total objects:', fabricCanvas.getObjects().length);

    // Select the newly added shape
    fabricCanvas.setActiveObject(shape);
    fabricCanvas.requestRenderAll();

    console.log('Canvas re-rendered');
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Elements</h2>
      </div>

      {/* Shapes Section */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Shapes */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Shapes
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_SHAPES.map((shape) => {
                const IconComponent = ICON_MAP[shape.icon];
                return (
                  <Button
                    key={shape.id}
                    variant="outline"
                    onClick={() => handleAddShape(shape.id)}
                    className="h-auto flex flex-col items-center justify-center p-4 hover:bg-accent hover:text-accent-foreground"
                    title={shape.description}
                  >
                    {IconComponent && (
                      <IconComponent className="size-8 mb-2" />
                    )}
                    <span className="text-xs font-medium">{shape.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Placeholder for future sections */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              More Elements
            </h3>
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-border rounded-lg">
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
