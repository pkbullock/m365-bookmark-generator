import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrashIcon, FolderIcon, FolderOpenIcon, GearIcon, LinkIcon } from '@phosphor-icons/react';
import { type Bookmark} from '@/lib/bookmarks';
import { getIconById, type Icon } from '@/lib/icons';
import { toast } from 'sonner';
import iconData from '@/data/icons.json';

interface BookmarkManagerProps {
  bookmarks: Bookmark[];
  onBookmarksChange: (bookmarks: Bookmark[]) => void;
}

export function BookmarkManager({ bookmarks, onBookmarksChange }: BookmarkManagerProps) {
  const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
    const folder = bookmark.folder || 'Uncategorized';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(bookmark);
    return acc;
  }, {} as Record<string, Bookmark[]>);

  const icons = (iconData as { icons: Icon[] }).icons;
 
  const handleDeleteBookmark = (bookmarkId: string) => {
    const updatedBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
    onBookmarksChange(updatedBookmarks);
    toast.success('Bookmark removed');
  };

  const handleBookmarkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <GearIcon size={20} className="text-primary" />
            </div>
            <h2 className="text-2xl font-light text-foreground">Manage Bookmarks</h2>
          </div>
          <p className="text-muted-foreground font-light">Remove unwanted bookmarks from your collection</p>
        </div>
      </div>
      <div className="space-y-4">
        {Object.entries(groupedBookmarks).map(([folder, folderBookmarks]) => (
          <Card key={folder} className="border shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="flex items-center gap-3 text-lg font-medium">
                <div className="w-8 h-8 bg-accent/10 rounded-md flex items-center justify-center">
                  <FolderOpenIcon size={18} className="text-accent" />
                </div>
                <span>{folder}</span>
                <div className="w-7 h-7 flex items-center justify-center bg-fluent-neutral-20 rounded-full">
                  <span className="text-xs font-medium text-muted-foreground">
                    {folderBookmarks.length}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-1">
                {folderBookmarks.map((bookmark) => {
                  const icon = bookmark.iconId ? getIconById(bookmark.iconId, icons) : null;
                  return (
                    <div
                      key={bookmark.id}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-fluent-neutral-10 to-transparent rounded-lg border border-border/30 hover:border-border transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {icon && (
                          <div className="w-4 h-4 flex-shrink-0">
                            <img 
                              src={icon.base64Data} 
                              alt={`${bookmark.name} icon`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 flex items-center gap-3">
                          <h4 className="font-medium text-sm truncate flex-shrink-0">{bookmark.name}</h4>
                          <button
                            onClick={() => handleBookmarkClick(bookmark.url)}
                            className="text-xs text-primary hover:text-primary/80 underline underline-offset-2 truncate font-mono bg-fluent-neutral-20 px-2 py-1 rounded cursor-pointer transition-colors hover:bg-fluent-neutral-30 flex items-center gap-1 min-w-0 flex-1"
                          >
                            <LinkIcon size={12} className="flex-shrink-0" />
                            <span className="truncate">{bookmark.url}</span>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-8 h-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDeleteBookmark(bookmark.id)}
                        >
                          <TrashIcon size={14} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bookmarks.length === 0 && (
        <Card className="border shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-fluent-neutral-20 rounded-full flex items-center justify-center mb-6">
              <FolderIcon size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-3">No bookmarks yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md font-light leading-relaxed">
              Start by selecting a template to manage your Microsoft 365 bookmark collection before download
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}