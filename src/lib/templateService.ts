import { type BookmarkTemplate } from '@/lib/bookmarks';
import templatesData from '@/data/templates.json';

export async function loadTemplates(): Promise<BookmarkTemplate[]> {
  // In a real-world scenario, this could be an actual API call
  // For now, we're importing the JSON file directly
  return templatesData as BookmarkTemplate[];
}

export function getTemplateById(id: string): BookmarkTemplate | undefined {
  return templatesData.find(template => template.id === id) as BookmarkTemplate | undefined;
}