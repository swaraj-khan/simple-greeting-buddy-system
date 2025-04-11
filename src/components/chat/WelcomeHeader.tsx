
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface WelcomeHeaderProps {
  isVisible: boolean;
}

const WelcomeHeader = ({ isVisible }: WelcomeHeaderProps) => {
  const isMobile = useIsMobile();

  if (!isVisible) return null;

  return (
    <div className={`absolute ${isMobile ? 'top-12 md:top-20 lg:top-22' : 'top-20 lg:top-22'} left-1/2 -translate-x-1/2 text-center mb-8 w-full px-4 z-10`}>
      <h1 
        className="text-2xl sm:text-3xl md:text-4xl font-bold whitespace-nowrap overflow-hidden text-ellipsis" 
        style={{ fontFamily: '"Nova Flat", system-ui', fontWeight: 400 }}
        ref={(el) => {
          if (el && isMobile) {
            if (el.clientHeight > 40) {
              el.parentElement?.classList.remove('top-12');
              el.parentElement?.classList.add('top-6');
            }
          }
        }}
      >
        What are we <span className="text-draconic-orange">hunting</span> today?
      </h1>
    </div>
  );
};

export default WelcomeHeader;
