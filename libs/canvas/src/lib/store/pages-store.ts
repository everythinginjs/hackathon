import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface CanvasPage {
  id: string;
  name: string;
  canvasData: string | null; // Serialized fabric canvas JSON
  thumbnail?: string; // Optional thumbnail data URL
  createdAt: Date;
  updatedAt: Date;
}

interface PagesState {
  // State
  pages: CanvasPage[];
  activePageId: string | null;

  // Actions
  addPage: (afterPageId?: string) => void;
  deletePage: (pageId: string) => void;
  duplicatePage: (pageId: string) => void;
  movePageUp: (pageId: string) => void;
  movePageDown: (pageId: string) => void;
  setActivePage: (pageId: string) => void;
  updatePageData: (
    pageId: string,
    canvasData: string,
    thumbnail?: string
  ) => void;
  renamePage: (pageId: string, newName: string) => void;

  // Helpers
  getActivePage: () => CanvasPage | null;
  getPageIndex: (pageId: string) => number;
  canMoveUp: (pageId: string) => boolean;
  canMoveDown: (pageId: string) => boolean;
  canDelete: () => boolean;
}

const generateId = () =>
  `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const createNewPage = (
  name: string,
  canvasData: string | null = null
): CanvasPage => ({
  id: generateId(),
  name,
  canvasData,
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const usePagesStore = create<PagesState>()(
  devtools(
    (set, get) => ({
      // Initial state
      pages: [createNewPage('Page 1')],
      activePageId: null,

      // Initialize active page
      ...(() => {
        const initialPage = createNewPage('Page 1');
        return {
          pages: [initialPage],
          activePageId: initialPage.id,
        };
      })(),

      // Add a new page after the specified page (or after active page if not specified)
      addPage: (afterPageId) => {
        const { pages, activePageId } = get();
        const targetPageId = afterPageId || activePageId;
        const targetIndex = pages.findIndex((p) => p.id === targetPageId);

        const newPage = createNewPage(`Page ${pages.length + 1}`);
        const newPages = [...pages];
        newPages.splice(targetIndex + 1, 0, newPage);

        set({
          pages: newPages,
          activePageId: newPage.id,
        });
      },

      // Delete a page (cannot delete if only one page remains)
      deletePage: (pageId) => {
        const { pages, activePageId } = get();

        // Cannot delete the last page
        if (pages.length <= 1) {
          return;
        }

        const pageIndex = pages.findIndex((p) => p.id === pageId);
        if (pageIndex === -1) return;

        const newPages = pages.filter((p) => p.id !== pageId);

        // Determine new active page
        let newActivePageId = activePageId;
        if (activePageId === pageId) {
          // If we deleted the active page, select the next page or previous page
          if (pageIndex < newPages.length) {
            newActivePageId = newPages[pageIndex].id;
          } else {
            newActivePageId = newPages[pageIndex - 1].id;
          }
        }

        set({
          pages: newPages,
          activePageId: newActivePageId,
        });
      },

      // Duplicate a page (creates a copy after the original)
      duplicatePage: (pageId) => {
        const { pages } = get();
        const pageIndex = pages.findIndex((p) => p.id === pageId);
        if (pageIndex === -1) return;

        const originalPage = pages[pageIndex];
        const duplicatedPage = createNewPage(
          `${originalPage.name} (copy)`,
          originalPage.canvasData
        );

        const newPages = [...pages];
        newPages.splice(pageIndex + 1, 0, duplicatedPage);

        set({
          pages: newPages,
          activePageId: duplicatedPage.id,
        });
      },

      // Move page up (toward the beginning of the list)
      movePageUp: (pageId) => {
        const { pages } = get();
        const pageIndex = pages.findIndex((p) => p.id === pageId);

        // Cannot move up if already at the beginning
        if (pageIndex <= 0) return;

        const newPages = [...pages];
        [newPages[pageIndex - 1], newPages[pageIndex]] = [
          newPages[pageIndex],
          newPages[pageIndex - 1],
        ];

        set({ pages: newPages });
      },

      // Move page down (toward the end of the list)
      movePageDown: (pageId) => {
        const { pages } = get();
        const pageIndex = pages.findIndex((p) => p.id === pageId);

        // Cannot move down if already at the end
        if (pageIndex === -1 || pageIndex >= pages.length - 1) return;

        const newPages = [...pages];
        [newPages[pageIndex], newPages[pageIndex + 1]] = [
          newPages[pageIndex + 1],
          newPages[pageIndex],
        ];

        set({ pages: newPages });
      },

      // Set the active page
      setActivePage: (pageId) => {
        set({ activePageId: pageId });
      },

      // Update page data (canvas state and thumbnail)
      updatePageData: (pageId, canvasData, thumbnail) => {
        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === pageId
              ? {
                  ...page,
                  canvasData,
                  thumbnail: thumbnail || page.thumbnail,
                  updatedAt: new Date(),
                }
              : page
          ),
        }));
      },

      // Rename a page
      renamePage: (pageId, newName) => {
        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === pageId
              ? { ...page, name: newName, updatedAt: new Date() }
              : page
          ),
        }));
      },

      // Get the currently active page
      getActivePage: () => {
        const { pages, activePageId } = get();
        return pages.find((p) => p.id === activePageId) || null;
      },

      // Get the index of a page
      getPageIndex: (pageId) => {
        return get().pages.findIndex((p) => p.id === pageId);
      },

      // Check if a page can move up
      canMoveUp: (pageId) => {
        const index = get().getPageIndex(pageId);
        return index > 0;
      },

      // Check if a page can move down
      canMoveDown: (pageId) => {
        const { pages } = get();
        const index = get().getPageIndex(pageId);
        return index !== -1 && index < pages.length - 1;
      },

      // Check if deletion is allowed
      canDelete: () => {
        return get().pages.length > 1;
      },
    }),
    { name: 'PagesStore' }
  )
);
