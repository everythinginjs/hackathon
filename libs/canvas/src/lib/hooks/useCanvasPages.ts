import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCanvasStore } from '../store/canvas-store';
import { usePagesStore } from '../store/pages-store';

/**
 * Hook that integrates canvas-store and pages-store
 * Automatically saves/loads canvas data when switching between pages
 */
export function useCanvasPages() {
  const { fabricCanvas, saveCanvasData, loadCanvasData, generateThumbnail } =
    useCanvasStore(
      useShallow((state) => ({
        fabricCanvas: state.fabricCanvas,
        saveCanvasData: state.saveCanvasData,
        loadCanvasData: state.loadCanvasData,
        generateThumbnail: state.generateThumbnail,
      }))
    );

  const { pages, activePageId, getActivePage, updatePageData } = usePagesStore(
    useShallow((state) => ({
      pages: state.pages,
      activePageId: state.activePageId,
      getActivePage: state.getActivePage,
      updatePageData: state.updatePageData,
      setActivePage: state.setActivePage,
    }))
  );

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

  // Auto-save on canvas modifications using Fabric.js events with debouncing
  useEffect(() => {
    if (!fabricCanvas || !activePageId) return;

    let debounceTimeout: NodeJS.Timeout | null = null;

    const saveWithDebounce = () => {
      // Clear existing timeout
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      // Set new timeout to save after 500ms of no activity
      debounceTimeout = setTimeout(() => {
        const canvasData = saveCanvasData();
        const thumbnail = generateThumbnail();
        if (canvasData) {
          updatePageData(activePageId, canvasData, thumbnail || undefined);
        }
      }, 500);
    };

    // Listen to canvas modification events
    fabricCanvas.on('object:modified', saveWithDebounce);
    fabricCanvas.on('object:added', saveWithDebounce);
    fabricCanvas.on('object:removed', saveWithDebounce);

    return () => {
      // Cleanup event listeners
      fabricCanvas.off('object:modified', saveWithDebounce);
      fabricCanvas.off('object:added', saveWithDebounce);
      fabricCanvas.off('object:removed', saveWithDebounce);

      // Clear pending timeout
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
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
  };
}
