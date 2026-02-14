import { Button } from '@org/ui-components';
import { ChevronDown, ChevronUp, Copy, Plus, Trash2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { usePagesStore } from '../store/pages-store';
import { useProjectStore } from '../store/project-store';
import { calculateThumbnailDimensions } from '../utils/thumbnail';

export function CanvasPageList() {
  const {
    pages,
    activePageId,
    addPage,
    deletePage,
    duplicatePage,
    movePageUp,
    movePageDown,
    setActivePage,
    canMoveUp,
    canMoveDown,
    canDelete,
  } = usePagesStore(
    useShallow((state) => ({
      pages: state.pages,
      activePageId: state.activePageId,
      addPage: state.addPage,
      deletePage: state.deletePage,
      duplicatePage: state.duplicatePage,
      movePageUp: state.movePageUp,
      movePageDown: state.movePageDown,
      setActivePage: state.setActivePage,
      canMoveUp: state.canMoveUp,
      canMoveDown: state.canMoveDown,
      canDelete: state.canDelete,
    }))
  );

  const { canvasHeight, canvasWidth } = useProjectStore(
    useShallow((state) => ({
      canvasHeight: state.canvasHeight,
      canvasWidth: state.canvasWidth,
    }))
  );

  // Calculate thumbnail dimensions using shared utility
  const { thumbnailWidth, thumbnailHeight } = calculateThumbnailDimensions(
    canvasWidth,
    canvasHeight
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">
          Pages {pages.length}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => addPage()}
          className="size-8"
          title="Add new page"
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {/* Pages Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-3">
          {pages.map((page, index) => {
            const isActive = page.id === activePageId;
            const canMoveUpPage = canMoveUp(page.id);
            const canMoveDownPage = canMoveDown(page.id);
            const canDeletePage = canDelete();

            return (
              <div key={page.id} className="flex flex-col gap-2">
                {/* Page Preview */}
                {/* Hover actions overlay */}
                <div className="flex justify-between">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      movePageUp(page.id);
                    }}
                    disabled={!canMoveUpPage}
                    className="size-7 bg-background/90 hover:bg-background"
                    title="Move up"
                  >
                    <ChevronUp className="size-3.5" />
                  </Button>

                  <div>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicatePage(page.id);
                      }}
                      className="size-7 bg-background/90 hover:bg-background"
                      title="Duplicate"
                    >
                      <Copy className="size-3.5" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePage(page.id);
                      }}
                      disabled={!canDeletePage}
                      className="size-7"
                      title="Delete"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      movePageDown(page.id);
                    }}
                    disabled={!canMoveDownPage}
                    className="size-7 bg-background/90 hover:bg-background"
                    title="Move down"
                  >
                    <ChevronDown className="size-3.5" />
                  </Button>
                </div>
                <div
                  onClick={() => setActivePage(page.id)}
                  className={`
                    relative rounded-lg border-2 cursor-pointer
                    transition-all duration-200
                    ${
                      isActive
                        ? 'border-primary shadow-md ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50 hover:shadow-sm'
                    }
                  `}
                >
                  {/* Thumbnail or placeholder */}
                  <div
                    style={{ width: thumbnailWidth, height: thumbnailHeight }}
                    className="w-full h-full bg-muted rounded-md overflow-hidden flex items-center justify-center"
                  >
                    {page.thumbnail ? (
                      <img
                        src={page.thumbnail}
                        alt={page.name}
                        width={thumbnailWidth}
                        height={thumbnailHeight}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <span className="text-2xl font-light">{index + 1}</span>
                        <span className="text-xs mt-1">Empty</span>
                      </div>
                    )}
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
                  )}
                </div>

                {/* Page name */}
                <div className="text-center">
                  <p className="text-xs font-medium text-foreground truncate px-1">
                    {page.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
