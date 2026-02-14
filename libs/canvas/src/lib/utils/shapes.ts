import * as fabric from 'fabric';

/**
 * Default shape properties
 */
const DEFAULT_SHAPE_OPTIONS = {
  fill: '#3b82f6', // blue-500
  stroke: '#1e40af', // blue-800
  strokeWidth: 2,
  selectable: true,
  hasControls: true,
};

/**
 * Shape factory functions
 */
export const ShapeFactory = {
  /**
   * Creates a rectangle shape
   */
  createRectangle: (options?: Partial<fabric.RectProps>) => {
    return new fabric.Rect({
      width: 150,
      height: 100,
      ...DEFAULT_SHAPE_OPTIONS,
      ...options,
    });
  },

  /**
   * Creates a circle shape
   */
  createCircle: (options?: Partial<fabric.CircleProps>) => {
    return new fabric.Circle({
      radius: 60,
      ...DEFAULT_SHAPE_OPTIONS,
      ...options,
    });
  },

  /**
   * Creates a triangle shape
   */
  createTriangle: (options?: Partial<fabric.TriangleProps>) => {
    return new fabric.Triangle({
      width: 120,
      height: 120,
      ...DEFAULT_SHAPE_OPTIONS,
      ...options,
    });
  },

  /**
   * Creates a line shape
   */
  createLine: (options?: Partial<fabric.LineProps>) => {
    return new fabric.Line([50, 50, 200, 50], {
      stroke: '#3b82f6',
      strokeWidth: 3,
      selectable: true,
      hasControls: true,
      ...options,
    });
  },

  /**
   * Creates a polygon shape (pentagon)
   */
  createPolygon: (options?: Partial<fabric.PolygonProps>) => {
    // Pentagon points (5 sides)
    const points = [
      { x: 50, y: 0 },
      { x: 100, y: 38 },
      { x: 82, y: 100 },
      { x: 18, y: 100 },
      { x: 0, y: 38 },
    ];

    return new fabric.Polygon(points, {
      ...DEFAULT_SHAPE_OPTIONS,
      ...options,
    });
  },

  /**
   * Creates a star shape
   */
  createStar: (options?: Partial<fabric.PolygonProps>) => {
    // 5-point star
    const points = [];
    const outerRadius = 60;
    const innerRadius = 30;
    const numPoints = 5;

    for (let i = 0; i < numPoints * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI / numPoints) * i - Math.PI / 2;
      points.push({
        x: Math.cos(angle) * radius + outerRadius,
        y: Math.sin(angle) * radius + outerRadius,
      });
    }

    return new fabric.Polygon(points, {
      ...DEFAULT_SHAPE_OPTIONS,
      ...options,
    });
  },
};

/**
 * Shape metadata for UI display
 */
export interface ShapeMetadata {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  description: string;
  factory: keyof typeof ShapeFactory;
}

export const AVAILABLE_SHAPES: ShapeMetadata[] = [
  {
    id: 'rectangle',
    name: 'Rectangle',
    icon: 'Square',
    description: 'Add a rectangle shape',
    factory: 'createRectangle',
  },
  {
    id: 'circle',
    name: 'Circle',
    icon: 'Circle',
    description: 'Add a circle shape',
    factory: 'createCircle',
  },
  {
    id: 'triangle',
    name: 'Triangle',
    icon: 'Triangle',
    description: 'Add a triangle shape',
    factory: 'createTriangle',
  },
  {
    id: 'line',
    name: 'Line',
    icon: 'Minus',
    description: 'Add a line',
    factory: 'createLine',
  },
  {
    id: 'polygon',
    name: 'Polygon',
    icon: 'Pentagon',
    description: 'Add a polygon shape',
    factory: 'createPolygon',
  },
  {
    id: 'star',
    name: 'Star',
    icon: 'Star',
    description: 'Add a star shape',
    factory: 'createStar',
  },
];
