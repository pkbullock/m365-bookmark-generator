import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderIcon, GlobeIcon, DownloadIcon, EyeIcon, FileTextIcon } from '@phosphor-icons/react';
import { type Bookmark, type BookmarkTemplate, downloadBookmarkFile } from '@/lib/bookmarks';
import { toast } from 'sonner';

interface BookmarkPreviewProps {
  bookmarks: Bookmark[];
  selectedTemplates?: BookmarkTemplate[];
}

function formatFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove special characters
    .replace(/\s+/g, '-')         // replace spaces with hyphens
    + '.html';
}

export function BookmarkPreview({ bookmarks, selectedTemplates = [] }: BookmarkPreviewProps) {
  const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
    const folder = bookmark.folder || 'Uncategorized';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(bookmark);
    return acc;
  }, {} as Record<string, Bookmark[]>);

  const handleDownload = async () => {
    if (bookmarks.length === 0) {
      toast.error('No bookmarks to download');
      return;
    }

    try {
      let fileName: string;
      if (selectedTemplates.length > 1) {
        fileName = 'import-multiple-bookmarks.html';
      } else if (selectedTemplates.length === 1) {
        fileName = formatFileName(selectedTemplates[0].name);
      } else {
        fileName = 'microsoft-365-bookmarks.html';
      }

      downloadBookmarkFile(bookmarks, fileName);
      toast.success('Bookmark file downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download bookmark file. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <EyeIcon size={20} className="text-primary" />
            </div>
            <h2 className="text-2xl font-light text-foreground">Preview & Download</h2>
          </div>
          <p className="text-muted-foreground font-light max-w-lg">
            Review your bookmark collection and download the file for Edge import
          </p>
        </div>
        <Button
          onClick={handleDownload}
          disabled={bookmarks.length === 0}
          className="px-8 py-3 h-auto text-base shadow-lg hover:shadow-xl transition-shadow"
        >
          <DownloadIcon size={18} className="mr-3" />
          Download Bookmarks
        </Button>
      </div>

      {bookmarks.length > 0 ? (

        <div className="grid gap-8">
          <Card className="border shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="flex items-center justify-between gap-3 text-xl font-medium">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-md flex items-center justify-center">
                    <FileTextIcon size={18} className="text-accent" />
                  </div>
                  Import Instructions
                </div>

              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                <p className="font-medium text-base">To import these bookmarks into Microsoft Edge:</p>
                <div className="bg-fluent-neutral-10 rounded-xl p-6 space-y-4">
                  <ol className="list-decimal list-inside space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-medium min-w-4">1.</span>
                      <span>Download the bookmark file using the button above</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-medium min-w-4">2.</span>
                      <span>Open Microsoft Edge and go to Favourites (Ctrl + Shift + O)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-medium min-w-4">3.</span>
                      <span>Click on the ... at the top and select "Import Favourites"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-medium min-w-4"></span>
                      <span>
                        <strong>OR</strong> Copy the link to jump to the settings{' '}
                        <span className="inline-flex items-center gap-2">
                          <code className="bg-muted px-1 rounded text-primary font-mono text-xs">
                            edge://settings/profiles/importBrowsingData?start=IE11
                          </code>
                          <Button
                            type="button"
                            size="sm"
                            variant="default"
                            className="px-2 py-1 text-xs"
                            onClick={() => {
                              navigator.clipboard.writeText('edge://settings/profiles/importBrowsingData?start=IE11');
                              toast.success('Link copied!');
                            }}
                          >
                            Copy
                          </Button>
                        </span>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-medium min-w-4">4.</span>
                      <span>Next to "Import browser data now" click on "Import"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-medium min-w-4">5.</span>
                      <span>Select "Favorites or bookmarks HTML file" under "Import from"</span>
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="text-primary font-medium min-w-4">6.</span>
                      <span>Choose the downloaded file and click "Import"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span><em>Tip: Be sure to show the bookmarks bar in Edge (Ctrl + Shift + B)</em></span>
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-gradient-to-br from-primary/5 via-primary/3 to-accent/5 border border-primary/20 rounded-xl p-8 shadow-sm min-w-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shadow-sm">
                <GlobeIcon size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-medium">Microsoft 365 Bookmarks</h3>
                <p className="text-sm text-muted-foreground font-light">
                  {bookmarks.length} bookmarks organized in {Object.keys(groupedBookmarks).length} folders
                  {selectedTemplates.length > 0 && (
                    <span> • From {selectedTemplates.length} template{selectedTemplates.length > 1 ? 's' : ''}</span>
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(groupedBookmarks).map(([folder, folderBookmarks]) => (
                <div key={folder} className="ml-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 bg-accent/10 rounded-md flex items-center justify-center">
                      <FolderIcon size={14} className="text-accent" />
                    </div>
                    <span className="font-medium text-base">{folder}</span>
                    <div className="px-2 py-1 bg-fluent-neutral-20 rounded-full">
                      <span className="text-xs font-medium text-muted-foreground">
                        {folderBookmarks.length}
                      </span>
                    </div>
                  </div>
                  <div className="ml-9 space-y-2">
                    {folderBookmarks.map((bookmark) => (
                      <div key={bookmark.id} className="flex items-center gap-3 text-sm p-2 bg-card/50 rounded-lg border border-border/30">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                        <span className="text-foreground truncate font-medium">{bookmark.name}</span>
                        <span className="text-muted-foreground text-xs font-mono bg-fluent-neutral-20 px-2 py-1 rounded flex-1 break-all truncate">
                          {bookmark.url}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>
      ) : (
        <Card className="border shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-fluent-neutral-20 rounded-full flex items-center justify-center mb-8">
              <DownloadIcon size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-medium mb-4">No bookmarks to preview</h3>
            <p className="text-muted-foreground text-center max-w-md font-light leading-relaxed mb-6">
              Select a template to see the preview and download your Microsoft 365 bookmark collection
            </p>
            <div className="flex gap-3">
              <Button variant="outline">
                Go to Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}