import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type BookmarkTemplate } from '@/lib/bookmarks';
import { loadTemplates } from '@/lib/templateService';
import { Check, Sparkle } from '@phosphor-icons/react';

interface TemplateSelectProps {
  selectedTemplate: BookmarkTemplate | null;
  onTemplateSelect: (template: BookmarkTemplate) => void;
}

export function TemplateSelect({ selectedTemplate, onTemplateSelect }: TemplateSelectProps) {
  const [templates, setTemplates] = useState<BookmarkTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTemplateData = async () => {
      try {
        const templateData = await loadTemplates();
        setTemplates(templateData);
      } catch (error) {
        console.error('Failed to load templates:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTemplateData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Sparkle size={20} className="text-primary animate-pulse" />
            </div>
            <h2 className="text-2xl font-light text-foreground">Choose a Template</h2>
          </div>
          <p className="text-muted-foreground font-light">Loading available templates...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse bg-fluent-neutral-10 rounded-lg border" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Sparkle size={20} className="text-primary" />
          </div>
          <h2 className="text-2xl font-light text-foreground">Choose a Template</h2>
        </div>
        <p className="text-muted-foreground font-light max-w-lg mx-auto leading-relaxed">
          Select a predefined Microsoft 365 bookmark collection to get started with your productivity setup
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border shadow-sm ${
              selectedTemplate?.id === template.id 
                ? 'ring-2 ring-primary shadow-lg bg-gradient-to-br from-card to-primary/5' 
                : 'hover:shadow-md'
            }`}
            onClick={() => onTemplateSelect(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-medium text-foreground flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    {template.name}
                  </CardTitle>
                  <CardDescription className="mt-2 font-light leading-relaxed">
                    {template.description}
                  </CardDescription>
                </div>
                {selectedTemplate?.id === template.id && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center ml-3">
                    <Check size={14} className="text-primary-foreground" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-light">
                  {template.bookmarks.length} bookmarks included
                </p>
                <div className="flex -space-x-1">
                  {[...Array(Math.min(3, template.bookmarks.length))].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-6 h-6 bg-fluent-neutral-20 border-2 border-card rounded-full"
                    />
                  ))}
                  {template.bookmarks.length > 3 && (
                    <div className="w-6 h-6 bg-muted border-2 border-card rounded-full flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">+</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}