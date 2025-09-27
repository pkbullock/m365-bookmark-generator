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
        <header className="text-center">
          <div className="container mx-auto py-8 px-4 max-w-6xl">
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
          </div>
        </header>

        <main className="flex-1 border-blue-500">
          <div className="container mx-auto py-8 px-4 max-w-6xl">

            <Tabs defaultValue="templates" className="space-y-8" role="navigation">
              <TabsList className="h-auto w-full max-w-4xl mx-auto grid grid-cols-3 border border-border min-w-0 items-start">
                <TabsTrigger
                  value="templates"
                  className="flex flex-col items-center gap-1 px-3 py-2 w-full min-w-0
                              data-[state=active]:bg-primary
                              data-[state=active]:text-primary-foreground
                              data-[state=active]:shadow-lg
                              data-[state=active]:border-b-4
                              data-[state=active]:border-blue-500
                              transition-all"
                >
                  <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold mb-2 mx-auto">
                    1
                  </span>
                  <span className="flex items-center gap-2 mb-1 justify-center">
                    <FileTextIcon size={16} />
                    <span className="font-medium">Templates</span>
                  </span>
                  <div className="h-18 text-xs text-muted-foreground mt-1 leading-normal break-words whitespace-normal text-center">
                    Select a predefined collection of Microsoft 365 bookmarks
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="manage"
                  className="flex flex-col items-center gap-1 px-3 py-2 w-full min-w-0
                              data-[state=active]:bg-primary
                              data-[state=active]:text-primary-foreground
                              data-[state=active]:shadow-lg
                              data-[state=active]:border-b-4
                              data-[state=active]:border-blue-500
                              transition-all"
                >
                  <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold mb-2 mx-auto">
                    2
                  </span>
                  <span className="flex items-center gap-2 mb-1 justify-center">
                    <GearIcon size={16} />
                    <span className="font-medium">Customize</span>
                  </span>
                  <div className="h-18 text-xs text-muted-foreground mt-1 leading-normal break-words whitespace-normal text-center">
                    Remove bookmarks to fit your needs
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="preview"
                  className="flex flex-col items-center gap-1 px-3 py-2 w-full min-w-0
                              data-[state=active]:bg-primary
                              data-[state=active]:text-primary-foreground
                              data-[state=active]:shadow-lg
                              data-[state=active]:border-b-4
                              data-[state=active]:border-blue-500
                              transition-all"
                >
                  <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold mb-2 mx-auto">
                    3
                  </span>
                  <span className="flex items-center gap-2 mb-1 justify-center">
                    <EyeIcon size={16} />
                    <span className="font-medium">Preview</span>
                  </span>
                  <div className="h-18 text-xs text-muted-foreground mt-1 leading-normal break-words whitespace-normal text-center">
                    Download the file and import it into Microsoft Edge
                  </div>
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
        </main>
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;