
import React, { useState } from 'react';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import AlertModal from '@/components/AlertModal';
import LeftDock from '@/components/LeftDock';
import WatchlistModal from '@/components/WatchlistModal';
import StacksModal from '@/components/StacksModal';
import DockSubMenu from '@/components/DockSubMenu';
import { Sparkles, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [watchlistModalOpen, setWatchlistModalOpen] = useState(false);
  const [stacksModalOpen, setStacksModalOpen] = useState(false);
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  React.useEffect(() => {
    const handleShowAlertDetail = (event: any) => {
      setSelectedAlert(event.detail);
      setAlertModalOpen(true);
    };
    
    window.addEventListener('show-alert-detail', handleShowAlertDetail);
    
    return () => {
      window.removeEventListener('show-alert-detail', handleShowAlertDetail);
    };
  }, []);
  
  const handleCloseAlertModal = () => {
    console.log("Modal close handler called from Index component");
    setAlertModalOpen(false);
    setSelectedAlert(null);
  };

  const handleOpenWatchlist = () => {
    console.log("Opening watchlist");
    setWatchlistModalOpen(true);
  };

  const handleCloseWatchlist = () => {
    console.log("Closing watchlist");
    setWatchlistModalOpen(false);
  };

  const handleOpenStacks = () => {
    console.log("Opening stacks");
    setStacksModalOpen(true);
  };

  const handleCloseStacks = () => {
    console.log("Closing stacks");
    setStacksModalOpen(false);
  };

  const handleMobileMenuClick = () => {
    setMobileSubMenuOpen(prev => !prev);
  };

  const handleCloseMobileSubMenu = () => {
    setMobileSubMenuOpen(false);
  };
  
  return (
    <div className="min-h-screen w-full honeycomb-bg main-honeycomb-glow relative overflow-hidden">
      {/* Blur overlay when mobile menu is open */}
      {mobileSubMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-opacity duration-300 md:hidden" 
          onClick={handleCloseMobileSubMenu}
        />
      )}
      
      <Header />
      <main className="min-h-screen pt-16 w-full">
        <ChatInterface />
      </main>
      
      <LeftDock onOpenWatchlist={handleOpenWatchlist} onOpenStacks={handleOpenStacks} />
      
      {/* Mobile dock button */}
      <div className="fixed left-4 bottom-4 md:hidden z-40">
        <button
          className={`p-3 bg-secondary rounded-full text-primary shadow-lg hover:text-accent transition-colors duration-200 focus:outline-none cursor-pointer ${mobileSubMenuOpen ? 'text-accent' : ''}`}
          onClick={handleMobileMenuClick}
          aria-label="Open Dock Menu"
          title="Dock Menu"
        >
          {mobileSubMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Sparkles className="h-6 w-6" />
          )}
        </button>
        
        {/* Mobile submenu */}
        <DockSubMenu
          isOpen={mobileSubMenuOpen}
          onClose={handleCloseMobileSubMenu}
          onWatchlistClick={handleOpenWatchlist}
          onStacksClick={handleOpenStacks}
          isMobile={true}
        />
      </div>
      
      <AlertModal 
        isOpen={alertModalOpen} 
        onClose={handleCloseAlertModal} 
        alertData={selectedAlert}
      />

      <WatchlistModal
        isOpen={watchlistModalOpen}
        onClose={handleCloseWatchlist}
      />

      <StacksModal
        isOpen={stacksModalOpen}
        onClose={handleCloseStacks}
      />
    </div>
  );
};

export default Index;
