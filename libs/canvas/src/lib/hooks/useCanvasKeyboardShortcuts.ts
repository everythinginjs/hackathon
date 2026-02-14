import { useEffect } from 'react';
import { usePagesStore } from '../store/pages-store';

/**
 * Hook that handles keyboard shortcuts for canvas page management
 *
 * Shortcuts:
 * - Cmd/Ctrl + N: New page
 * - Cmd/Ctrl + D: Duplicate current page
 * - Cmd/Ctrl + Backspace: Delete current page
 */
export function useCanvasKeyboardShortcuts() {
  const { activePageId, addPage, duplicatePage, deletePage, canDelete } = usePagesStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCtrlOrCmd = isMac ? event.metaKey : event.ctrlKey;

      // Cmd/Ctrl + N: New page
      if (isCtrlOrCmd && event.key === 'n') {
        event.preventDefault();
        addPage();
        return;
      }

      // Cmd/Ctrl + D: Duplicate current page
      if (isCtrlOrCmd && event.key === 'd') {
        event.preventDefault();
        if (activePageId) {
          duplicatePage(activePageId);
        }
        return;
      }

      // Cmd/Ctrl + Backspace: Delete current page
      if (isCtrlOrCmd && event.key === 'Backspace') {
        event.preventDefault();
        if (activePageId && canDelete()) {
          deletePage(activePageId);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePageId, addPage, duplicatePage, deletePage, canDelete]);
}
