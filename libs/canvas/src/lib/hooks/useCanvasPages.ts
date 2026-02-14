import { useEffect } from 'react';
import { useCanvasStore } from '../store/canvas-store';
import { usePagesStore } from '../store/pages-store';

/**
 * Hook that integrates canvas-store and pages-store
 * Automatically saves/loads canvas data when switching between pages
 */
export function useCanvasPages() {
  const { fabricCanvas, saveCanvasData, loadCanvasData, generateThumbnail } =
    useCanvasStore();
  const {
    pages,
    activePageId,
    getActivePage,
    updatePageData,
    setActivePage: setActivePageInStore,
  } = usePagesStore();

  // Save canvas data when switching pages
  const switchToPage = (pageId: string) => {
    // Save current page data AND thumbnail before switching
    if (fabricCanvas && activePageId) {
      const canvasData = saveCanvasData();
      const thumbnail = generateThumbnail();
      if (canvasData) {
        updatePageData(activePageId, canvasData, thumbnail || undefined);
      }
    }

    // Switch to new page
    setActivePageInStore(pageId);
  };

  // Subscribe to page changes and generate thumbnail for the previous page
  useEffect(() => {
    if (!fabricCanvas) return;

    const unsubscribe = usePagesStore.subscribe((state, prevState) => {
      // When activePageId changes, save thumbnail for the previous page
      if (
        state.activePageId !== prevState.activePageId &&
        prevState.activePageId
      ) {
        const canvasData = saveCanvasData();
        const thumbnail = generateThumbnail();

        if (canvasData) {
          updatePageData(
            prevState.activePageId,
            canvasData,
            thumbnail || undefined
          );
        }
      }
    });

    return unsubscribe;
  }, [fabricCanvas, saveCanvasData, generateThumbnail, updatePageData]);

  // Load canvas data when active page changes
  useEffect(() => {
    if (!fabricCanvas || !activePageId) return;

    const activePage = getActivePage();
    if (!activePage) return;

    // Load canvas data for the active page
    if (activePage.canvasData) {
      loadCanvasData(activePage.canvasData);
    } else {
      // Clear canvas for new pages
      fabricCanvas.clear();
      fabricCanvas.requestRenderAll();
    }
  }, [activePageId, fabricCanvas, getActivePage, loadCanvasData]);

  // Auto-save current page data AND thumbnail periodically (every 2 seconds)
  useEffect(() => {
    if (!fabricCanvas || !activePageId) return;

    const interval = setInterval(() => {
      const canvasData = saveCanvasData();
      const thumbnail = generateThumbnail();
      if (canvasData) {
        updatePageData(activePageId, canvasData, thumbnail || undefined);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [
    fabricCanvas,
    activePageId,
    saveCanvasData,
    generateThumbnail,
    updatePageData,
  ]);

  return {
    pages,
    activePageId,
    switchToPage,
  };
}
