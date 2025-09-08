import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0"
    >
      {theme === 'light' ? (
        <MoonIcon size={16}  />
      ) : (
        <SunIcon size={16} className="text-white" />
      )}
      <span className="sr-only">
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </span>
    </Button>
  );
}