import { Heart, Shield } from '@phosphor-icons/react';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span>All data processed locally in your browser</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built with</span>
            <Heart size={16} className="text-destructive" />
            <span>by Paul Bullock</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            This application does not store or share any of your data on servers. 
            All bookmark processing and management happens entirely within your browser for maximum privacy and security.
          </p>
        </div>
      </div>
    </footer>
  );
}