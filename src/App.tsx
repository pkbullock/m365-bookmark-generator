import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TemplateSelect } from '@/components/TemplateSelect';
import { BookmarkManager } from '@/components/BookmarkManager';
import { BookmarkPreview } from '@/components/BookmarkPreview';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { type Bookmark, type BookmarkTemplate } from '@/lib/bookmarks';
import { Toaster } from '@/components/ui/sonner';
import { FileTextIcon, GearIcon, EyeIcon } from '@phosphor-icons/react';

function App() {
  const [selectedTemplates, setSelectedTemplates] = useState<BookmarkTemplate[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const handleTemplateSelect = (template: BookmarkTemplate, isSelected: boolean) => {
    if (isSelected) {
      // Add template to selection
      const newSelectedTemplates = [...selectedTemplates, template];
      setSelectedTemplates(newSelectedTemplates);
      // Combine bookmarks from all selected templates
      const combinedBookmarks = newSelectedTemplates.flatMap(t => t.bookmarks);
      setBookmarks(combinedBookmarks);
    } else {
      // Remove template from selection
      const newSelectedTemplates = selectedTemplates.filter(t => t.id !== template.id);
      setSelectedTemplates(newSelectedTemplates);
      // Combine bookmarks from remaining selected templates
      const combinedBookmarks = newSelectedTemplates.flatMap(t => t.bookmarks);
      setBookmarks(combinedBookmarks);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-fluent-neutral-10 flex flex-col">
        <div className="flex-1 border-blue-500">
          <div className="container mx-auto py-8 px-4 max-w-6xl">
            <header className="text-center mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1" />
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-lg hidden sm:flex">
                    <FileTextIcon size={24} className="text-primary-foreground" />
                  </div>
                  <h1 className="text-4xl font-light text-foreground">
                    Microsoft 365 Bookmarks
                  </h1>
                </div>
                <div className="flex-1 flex justify-end items-center gap-2">
                  <span
                    className="flex items-center justify-center h-9 px-3 rounded bg-yellow-400 text-xs font-semibold text-black shadow-sm"
                    style={{ minWidth: '48px' }}
                  >
                    Beta
                  </span>
                  <ThemeToggle />
                </div>
              </div>
              <p className="text-lg font-light text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Generate and download Microsoft 365 bookmark collections for easy import into Microsoft Edge, ideal for users who create new Edge profiles regularly
              </p>
            </header>

            <Card className="mb-8 border shadow-sm bg-gradient-to-r from-card via-card to-fluent-neutral-10">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-medium">
                  <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                    <FileTextIcon size={18} className="text-primary" />
                  </div>
                  Quick Start Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium shadow-sm">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-base mb-2">Choose Template</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Select a predefined collection of Microsoft 365 bookmarks
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium shadow-sm">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-base mb-2">Customize (Optional)</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Add, edit, or remove bookmarks to fit your needs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium shadow-sm">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-base mb-2">Download & Import</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Download the file and import it into Microsoft Edge
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="templates" className="space-y-8">
              <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 border border-border">
                <TabsTrigger value="templates" className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <FileTextIcon size={16} />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="manage" className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <GearIcon size={16} />
                  Manage
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <EyeIcon size={16} />
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="templates" className="space-y-6">
                <TemplateSelect
                  selectedTemplates={selectedTemplates}
                  onTemplateSelect={handleTemplateSelect}
                />
              </TabsContent>

              <TabsContent value="manage" className="space-y-6">
                <BookmarkManager
                  bookmarks={bookmarks}
                  onBookmarksChange={setBookmarks}
                />
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                <BookmarkPreview bookmarks={bookmarks} selectedTemplates={selectedTemplates} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;