import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash, Folder, FolderOpen, Settings } from '@phosphor-icons/react';
import { type Bookmark, validateUrl, generateUniqueId } from '@/lib/bookmarks';
import { toast } from 'sonner';

interface BookmarkManagerProps {
  bookmarks: Bookmark[];
  onBookmarksChange: (bookmarks: Bookmark[]) => void;
}

export function BookmarkManager({ bookmarks, onBookmarksChange }: BookmarkManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [newBookmark, setNewBookmark] = useState({ name: '', url: '', folder: '' });

  const folders = Array.from(new Set(bookmarks.map(b => b.folder).filter(Boolean))) as string[];
  const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
    const folder = bookmark.folder || 'Uncategorized';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(bookmark);
    return acc;
  }, {} as Record<string, Bookmark[]>);

  const handleAddBookmark = () => {
    if (!newBookmark.name.trim() || !newBookmark.url.trim()) {
      toast.error('Please fill in both name and URL');
      return;
    }

    if (!validateUrl(newBookmark.url)) {
      toast.error('Please enter a valid URL');
      return;
    }

    const bookmark: Bookmark = {
      id: generateUniqueId(),
      name: newBookmark.name.trim(),
      url: newBookmark.url.trim(),
      folder: newBookmark.folder || undefined
    };
    
    onBookmarksChange([...bookmarks, bookmark]);
    setNewBookmark({ name: '', url: '', folder: '' });
    setIsAddDialogOpen(false);
    toast.success('Bookmark added successfully');
  };

  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setNewBookmark({
      name: bookmark.name,
      url: bookmark.url,
      folder: bookmark.folder || ''
    });
  };

  const handleUpdateBookmark = () => {
    if (!editingBookmark) return;

    if (!newBookmark.name.trim() || !newBookmark.url.trim()) {
      toast.error('Please fill in both name and URL');
      return;
    }

    if (!validateUrl(newBookmark.url)) {
      toast.error('Please enter a valid URL');
      return;
    }

    const updatedBookmarks = bookmarks.map(b => 
      b.id === editingBookmark.id 
        ? { ...b, name: newBookmark.name.trim(), url: newBookmark.url.trim(), folder: newBookmark.folder || undefined }
        : b
    );

    onBookmarksChange(updatedBookmarks);
    setEditingBookmark(null);
    setNewBookmark({ name: '', url: '', folder: '' });
    toast.success('Bookmark updated successfully');
  };

  const handleDeleteBookmark = (bookmarkId: string) => {
    const updatedBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
    onBookmarksChange(updatedBookmarks);
    toast.success('Bookmark removed');
  };

  const BookmarkForm = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="bookmark-name" className="text-sm font-medium">Bookmark Name</Label>
        <Input
          id="bookmark-name"
          value={newBookmark.name}
          onChange={(e) => setNewBookmark(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Microsoft Teams"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bookmark-url" className="text-sm font-medium">URL</Label>
        <Input
          id="bookmark-url"
          value={newBookmark.url}
          onChange={(e) => setNewBookmark(prev => ({ ...prev, url: e.target.value }))}
          placeholder="https://teams.microsoft.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bookmark-folder" className="text-sm font-medium">Folder (Optional)</Label>
        <Select value={newBookmark.folder} onValueChange={(value) => setNewBookmark(prev => ({ ...prev, folder: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select or create folder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No folder</SelectItem>
            {folders.map(folder => (
              <SelectItem key={folder} value={folder}>{folder}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={newBookmark.folder}
          onChange={(e) => setNewBookmark(prev => ({ ...prev, folder: e.target.value }))}
          placeholder="Or type new folder name"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Settings size={20} className="text-primary" />
            </div>
            <h2 className="text-2xl font-light text-foreground">Manage Bookmarks</h2>
          </div>
          <p className="text-muted-foreground font-light">Add, edit, or remove bookmarks from your collection</p>
        </div>
        <div>
          <Button 
            className="px-6 py-2 h-auto" 
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus size={16} className="mr-2" />
            Add Bookmark
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="border shadow-2xl">
              <DialogHeader className="pb-4">
                <DialogTitle className="text-xl font-medium">Add New Bookmark</DialogTitle>
              </DialogHeader>
              <BookmarkForm />
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddBookmark}
                >
                  Add Bookmark
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {editingBookmark && (
        <Dialog open={!!editingBookmark} onOpenChange={(open) => {
          if (!open) setEditingBookmark(null);
        }}>
          <DialogContent className="border shadow-2xl">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-medium">Edit Bookmark</DialogTitle>
            </DialogHeader>
            <BookmarkForm />
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <Button 
                variant="outline" 
                onClick={() => setEditingBookmark(null)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateBookmark}
              >
                Update Bookmark
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="space-y-6">
        {Object.entries(groupedBookmarks).map(([folder, folderBookmarks]) => (
          <Card key={folder} className="border shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="flex items-center gap-3 text-lg font-medium">
                <div className="w-8 h-8 bg-accent/10 rounded-md flex items-center justify-center">
                  <FolderOpen size={18} className="text-accent" />
                </div>
                <span>{folder}</span>
                <div className="px-2 py-1 bg-fluent-neutral-20 rounded-full">
                  <span className="text-xs font-medium text-muted-foreground">
                    {folderBookmarks.length}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {folderBookmarks.map((bookmark) => (
                  <div 
                    key={bookmark.id} 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-fluent-neutral-10 to-transparent rounded-lg border border-border/30 hover:border-border transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate mb-1">{bookmark.name}</h4>
                      <p className="text-xs text-muted-foreground truncate font-mono bg-fluent-neutral-20 px-2 py-1 rounded">
                        {bookmark.url}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0"
                        onClick={() => handleEditBookmark(bookmark)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDeleteBookmark(bookmark.id)}
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bookmarks.length === 0 && (
        <Card className="border shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-fluent-neutral-20 rounded-full flex items-center justify-center mb-6">
              <Folder size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-3">No bookmarks yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md font-light leading-relaxed">
              Start by selecting a template or add your first bookmark to begin building your collection
            </p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus size={16} className="mr-2" />
              Add First Bookmark
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}