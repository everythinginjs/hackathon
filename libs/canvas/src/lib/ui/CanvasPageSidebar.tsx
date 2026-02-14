import { CanvasPageList } from '../components/CanvasPageList';
import { MiniSidebar } from '../../../../minisidebar/src';
import { useState } from 'react';

export interface CanvasPageSidebarProps {
  className?: string;
}

export function CanvasPageSidebar({ className }: CanvasPageSidebarProps) {
  const [activeTab, setActiveTab] = useState('pages');

  return (
    <aside
      className={`flex border-r border-border flex-shrink-0 ${className || ''}`}
    >
      {/* Mini Icon Sidebar */}
      <MiniSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Page Manager */}
      <div className="w-64 overflow-y-auto">
        <CanvasPageList />
      </div>
    </aside>
  );
}
