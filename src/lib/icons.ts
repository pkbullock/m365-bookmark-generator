export interface Icon {
  id: string;
  base64Data: string;
}

export interface IconRepository {
  icons: Icon[];
}

export function getIconById(iconId: string, icons: Icon[]): Icon | undefined {
  return icons.find(icon => icon.id === iconId);
}

export function validateBase64Icon(base64Data: string): boolean {
  try {
    // Check if it's a valid base64 string and appears to be an image
    if (!base64Data || typeof base64Data !== 'string') {
      return false;
    }
    
    // Should start with data:image/ for a valid image data URL
    const dataUrlRegex = /^data:image\/(png|jpg|jpeg|gif|svg\+xml|webp|bmp|ico);base64,/i;
    return dataUrlRegex.test(base64Data);
  } catch {
    return false;
  }
}

export function createIconDataUrl(iconData: string): string {
  // If it's already a complete data URL, return as is
  if (iconData.startsWith('data:image/')) {
    return iconData;
  }
  
  // Otherwise, assume it's base64 PNG data and construct the data URL
  return `data:image/png;base64,${iconData}`;
}