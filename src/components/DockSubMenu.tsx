
import React, { useRef, useEffect } from 'react';
import { Brain, SquareSplitVertical } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { CSSProperties } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SubMenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface DockSubMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onWatchlistClick: () => void;
  onStacksClick: () => void;
  isMobile?: boolean;
}

const PulseIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const DockSubMenu = ({ isOpen, onClose, onWatchlistClick, onStacksClick, isMobile = false }: DockSubMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const detectedMobile = useIsMobile();
  
  const isMobileDevice = isMobile || detectedMobile;
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const menuItems: SubMenuItem[] = [
    {
      id: 'watchlist',
      icon: <PulseIcon className="h-5 w-5" />,
      label: 'Watchlist',
      onClick: onWatchlistClick
    },
    {
      id: 'stacks',
      icon: <Brain className="h-5 w-5" />,
      label: 'Stacks',
      onClick: onStacksClick
    },
    {
      id: 'splitView',
      icon: <SquareSplitVertical className="h-5 w-5" />,
      label: 'Split View',
      onClick: () => console.log('Split View clicked')
    }
  ];

  if (!isOpen) return null;

  const menuStyle: CSSProperties = isMobileDevice ? 
    { 
      position: 'fixed', 
      bottom: '5rem', 
      left: '3.5rem', 
      opacity: isOpen ? 1 : 0,
      pointerEvents: isOpen ? 'auto' : 'none',
      zIndex: 50
    } : 
    { 
      position: 'fixed', 
      left: '2.5rem', 
      top: '50%', 
      transform: 'translateY(-50%)',
      opacity: isOpen ? 1 : 0,
      pointerEvents: isOpen ? 'auto' : 'none',
      zIndex: 50
    };

  return (
    <div 
      ref={menuRef}
      className="fixed z-50 transition-all duration-300 ease-in-out"
      style={menuStyle}
    >
      <TooltipProvider delayDuration={300}>
        {menuItems.map((item, index) => {
          let x, y;
          
          if (isMobileDevice) {
            const baseAngle = 90;
            const angleSpread = 42;
            const angle = baseAngle - (index * angleSpread);
            const distance = 100;
            const radians = (angle * Math.PI) / 180;
            
            x = Math.cos(radians) * distance;
            y = Math.sin(radians) * distance * -1;
          } else {
            if (index === 1) {
              x = 120;
              y = -26; // Move Stacks icon up more
            } else if (index === 0) {
              const angle = -45;
              const distance = 120;
              const radians = (angle * Math.PI) / 180;
              x = Math.cos(radians) * distance;
              y = Math.sin(radians) * distance - 26; // Adjust Watchlist position
            } else {
              const angle = 45;
              const distance = 120;
              const radians = (angle * Math.PI) / 180;
              x = Math.cos(radians) * distance;
              y = Math.sin(radians) * distance - 26; // Adjust Split View position
            }
          }
          
          return (
            <div 
              key={item.id}
              className="absolute transition-all duration-300 ease-in-out"
              style={{ 
                transform: `translate(${x}px, ${y}px) scale(${isOpen ? 1 : 0.5})`,
                opacity: isOpen ? 1 : 0,
              }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={item.onClick}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-primary hover:text-accent border-2 border-primary/30 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none"
                    aria-label={item.label}
                  >
                    {item.icon}
                  </button>
                </TooltipTrigger>
                <TooltipContent side={isMobileDevice ? "top" : "right"}>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          );
        })}
      </TooltipProvider>
    </div>
  );
};

export default DockSubMenu;
