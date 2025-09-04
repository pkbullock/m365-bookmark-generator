import { getIconById, validateBase64Icon, type Icon, type IconRepository } from './icons';
import iconData from '../data/icons.json';

export interface Bookmark {
  id: string;
  name: string;
  url: string;
  folder?: string;
  iconId?: string;
}

export interface BookmarkFolder {
  name: string;
  bookmarks: Bookmark[];
}

export interface BookmarkTemplate {
  id: string;
  name: string;
  description: string;
  bookmarks: Bookmark[];
}



export function generateBookmarkFile(bookmarks: Bookmark[]): string {
  const folders = groupBookmarksByFolder(bookmarks);
  const timestamp = new Date().toISOString();
  const icons = (iconData as IconRepository).icons;
  
  let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><H3 ADD_DATE="${Math.floor(Date.now() / 1000)}" LAST_MODIFIED="${Math.floor(Date.now() / 1000)}" PERSONAL_TOOLBAR_FOLDER="true">Microsoft 365 Bookmarks</H3>
    <DL><p>
`;

  Object.entries(folders).forEach(([folderName, folderBookmarks]) => {
    if (folderName !== 'root') {
      html += `        <DT><H3 ADD_DATE="${Math.floor(Date.now() / 1000)}" LAST_MODIFIED="${Math.floor(Date.now() / 1000)}">${folderName}</H3>
        <DL><p>
`;
      folderBookmarks.forEach(bookmark => {
        const iconAttribute = getIconAttribute(bookmark, icons);
        html += `            <DT><A HREF="${bookmark.url}"${iconAttribute} ADD_DATE="${Math.floor(Date.now() / 1000)}">${bookmark.name}</A>
`;
      });
      html += `        </DL><p>
`;
    }
  });

  // Add root bookmarks (those without a folder)
  if (folders.root && folders.root.length > 0) {
    folders.root.forEach(bookmark => {
      const iconAttribute = getIconAttribute(bookmark, icons);
      html += `        <DT><A HREF="${bookmark.url}"${iconAttribute} ADD_DATE="${Math.floor(Date.now() / 1000)}">${bookmark.name}</A>
`;
    });
  }

  html += `    </DL><p>
</DL><p>`;

  return html;
}

export function downloadBookmarkFile(bookmarks: Bookmark[], filename: string = 'microsoft-365-bookmarks.html'): void {
  try {
    const content = generateBookmarkFile(bookmarks);
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    // Add to document, click, and cleanup
    document.body.appendChild(link);
    link.click();
    
    // Cleanup with a small delay to ensure download starts
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('Failed to download bookmark file');
  }
}

function getIconAttribute(bookmark: Bookmark, icons: Icon[]): string {
  if (!bookmark.iconId) {
    return '';
  }
  
  const icon = getIconById(bookmark.iconId, icons);
  if (!icon || !validateBase64Icon(icon.base64Data)) {
    return '';
  }
  
  return ` ICON="${icon.base64Data}"`;
}

function groupBookmarksByFolder(bookmarks: Bookmark[]): Record<string, Bookmark[]> {
  return bookmarks.reduce((acc, bookmark) => {
    const folder = bookmark.folder || 'root';
    if (!acc[folder]) {
      acc[folder] = [];
    }
    acc[folder].push(bookmark);
    return acc;
  }, {} as Record<string, Bookmark[]>);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function generateUniqueId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}