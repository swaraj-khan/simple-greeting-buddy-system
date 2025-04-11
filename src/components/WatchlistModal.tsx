import React from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from 'lucide-react';
import WatchlistCard from './WatchlistCard';
import { useIsMobile } from '@/hooks/use-mobile';

// Sample watchlist data
const watchlistData = [
  {
    title: "Breakout Stocks",
    description: "Stocks showing breakout patterns on technical charts",
    items: [
      { name: "Reliance Industries" },
      { name: "HDFC Bank" },
      { name: "Infosys" },
      { name: "TCS" },
      { name: "ICICI Bank" },
      { name: "Bharti Airtel" },
    ]
  },
  {
    title: "Index Options",
    description: "Popular index options with high trading volume",
    items: [
      { name: "Nifty 50" },
      { name: "Bank Nifty" },
      { name: "Fin Nifty" },
      { name: "India VIX" },
      { name: "Nifty Next 50" },
      { name: "Nifty IT" },
      { name: "Nifty Auto" },
    ]
  },
  {
    title: "Banking Stocks",
    description: "Top performing banking and financial stocks",
    items: [
      { name: "HDFC Bank" },
      { name: "ICICI Bank" },
      { name: "SBI" },
      { name: "Kotak Mahindra" },
      { name: "Axis Bank" },
      { name: "IndusInd Bank" },
      { name: "Bandhan Bank" },
      { name: "RBL Bank" },
    ]
  }
];

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WatchlistModal = ({ isOpen, onClose }: WatchlistModalProps) => {
  const isMobile = useIsMobile();
  
  // Direct close handler with debugging and explicit prevention of event bubbling
  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default button behavior
    e.stopPropagation(); // Prevent event bubbling
    console.log("Close button clicked");
    onClose();
  };
  
  return (
    <>
      {/* Separate close button outside the Dialog with explicit styling for cursor and z-index */}
      {isOpen && (
        <div 
          className={`fixed ${isMobile ? 'top-2 right-4' : 'top-4 right-4'} z-[9999]`} 
          style={{ pointerEvents: 'auto' }} // Ensure pointer events are enabled
        >
          <button 
            onClick={handleCloseClick}
            className="p-3 bg-secondary border-2 border-draconic-orange rounded-md hover:bg-secondary/80 transition-colors cursor-pointer"
            aria-label="Close watchlist"
            style={{ cursor: 'pointer' }} // Explicit cursor style
            title="Close watchlist"
          >
            <X className="h-6 w-6 text-draconic-orange" />
          </button>
        </div>
      )}
      
      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => {
          if (!open) {
            console.log("Dialog onOpenChange triggered");
            onClose();
          }
        }}
      >
        <DialogContent 
          className="max-w-5xl p-0 bg-transparent border-0 shadow-none overflow-y-auto max-h-[90vh]"
          style={{ animation: 'none' }}
          closeButton={false}
        >
          {/* Hidden DialogTitle for accessibility */}
          <DialogTitle className="sr-only">Watchlists</DialogTitle>
          
          {/* Added title section with padding to avoid overlap with close button */}
          <div className={`text-center mb-6 ${isMobile ? 'mt-8' : ''}`}>
            <h2 className="text-primary text-3xl font-nova-flat font-bold">Your Virtual Watchlist</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-0">
            {watchlistData.map((watchlist, index) => (
              <WatchlistCard 
                key={`watchlist-${index}`}
                title={watchlist.title}
                description={watchlist.description}
                items={watchlist.items}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WatchlistModal;
