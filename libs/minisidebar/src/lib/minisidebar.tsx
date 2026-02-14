import { Button } from '@org/ui-components';
import { FileText, Image, Shapes, Type, Layers } from 'lucide-react';

export interface MiniSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  className?: string;
}

export function MiniSidebar({
  activeTab = 'pages',
  onTabChange,
  className,
}: MiniSidebarProps) {
  const tabs = [
    { id: 'pages', icon: FileText, label: 'Pages' },
    { id: 'elements', icon: Shapes, label: 'Elements' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'images', icon: Image, label: 'Images' },
    { id: 'layers', icon: Layers, label: 'Layers' },
  ];

  return (
    <div
      className={`w-12 bg-muted/30 border-r border-border flex flex-col items-center py-3 gap-1 ${
        className || ''
      }`}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <Button
            key={tab.id}
            variant="ghost"
            size="icon"
            className={`size-9 ${isActive ? 'bg-accent' : ''}`}
            onClick={() => onTabChange?.(tab.id)}
            title={tab.label}
          >
            <Icon className="size-4" />
          </Button>
        );
      })}
    </div>
  );
}
