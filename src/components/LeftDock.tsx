
import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import DockSubMenu from './DockSubMenu';
import { useIsMobile } from '@/hooks/use-mobile';

interface LeftDockProps {
  onOpenWatchlist: () => void;
  onOpenStacks: () => void;
}

const LeftDock = ({ onOpenWatchlist, onOpenStacks }: LeftDockProps) => {
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleDockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSubMenuOpen(prev => !prev);
  };

  const handleCloseSubMenu = () => {
    setSubMenuOpen(false);
  };

  const handleWatchlistClick = () => {
    console.log("Watchlist option clicked from submenu");
    setSubMenuOpen(false); // Close submenu
    onOpenWatchlist(); // Open watchlist modal
  };

  const handleStacksClick = () => {
    console.log("Stacks option clicked from submenu");
    setSubMenuOpen(false); // Close submenu
    onOpenStacks(); // Open stacks modal
  };

  return (
    <>
      {/* Blur overlay when menu is open */}
      {subMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-opacity duration-300" 
          onClick={handleCloseSubMenu}
        />
      )}
      
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden md:block">
        <div className="flex flex-col gap-4 bg-secondary p-2 rounded-tr-md rounded-br-md">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`p-2 text-primary hover:text-accent transition-colors duration-200 cursor-pointer focus:outline-none ${subMenuOpen ? 'text-accent' : ''}`}
                onClick={handleDockClick}
                title="Dock Menu"
              >
                {subMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Sparkles className="h-6 w-6" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{subMenuOpen ? 'Close Menu' : 'Dock Menu'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        {/* Radial Submenu */}
        <DockSubMenu 
          isOpen={subMenuOpen} 
          onClose={handleCloseSubMenu} 
          onWatchlistClick={handleWatchlistClick}
          onStacksClick={handleStacksClick}
          isMobile={false} // Explicitly pass false for desktop
        />
      </div>
    </>
  );
};

export default LeftDock;
