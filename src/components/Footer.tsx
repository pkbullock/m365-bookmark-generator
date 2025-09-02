import { HeartIcon, ShieldIcon } from '@phosphor-icons/react';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldIcon size={16} />
              <span>All data processed locally in your browser. No bookmarks are read or automatically changed.</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built with</span>
            <HeartIcon size={16} className="text-destructive" />
            <span>by <a href="https://pkbullock.com">Paul Bullock</a></span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            This application does not store or share any of your data on servers. 
            All bookmark processing and management happens entirely within your browser for maximum privacy and security. Created under MIT license.
            This app is provided as is without warranty of any kind, either express or implied, including any implied warranties of fitness for a particular purpose, merchantability, or non-infringement.
            In no event shall the authors or copyright holders be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the software or the use or other dealings in the software.
            Users are responsible for ensuring the suitability of this application for their specific needs.
          </p>
        </div>
      </div>
    </footer>
  );
}