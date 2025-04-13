
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import AlertModal from '@/components/AlertModal';
import { useChatHistory } from '@/hooks/useChatHistory';

const Index = () => {
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(undefined);
  const { currentChatId } = useChatHistory();
  
  useEffect(() => {
    const handleShowAlertDetail = (event: any) => {
      setSelectedAlert(event.detail);
      setAlertModalOpen(true);
    };
    
    window.addEventListener('show-alert-detail', handleShowAlertDetail);
    
    // Handle chat selection from history
    const handleChatSelection = (event: CustomEvent<string>) => {
      setSelectedChatId(event.detail);
    };
    
    window.addEventListener('select-chat', handleChatSelection as EventListener);
    
    return () => {
      window.removeEventListener('show-alert-detail', handleShowAlertDetail);
      window.removeEventListener('select-chat', handleChatSelection as EventListener);
    };
  }, []);
  
  const handleCloseAlertModal = () => {
    console.log("Modal close handler called from Index component");
    setAlertModalOpen(false);
    setSelectedAlert(null);
  };
  
  return (
    <div className="min-h-screen w-full honeycomb-bg main-honeycomb-glow relative overflow-hidden">
      <Header />
      <main className="min-h-screen pt-16 w-full">
        <ChatInterface selectedChatId={selectedChatId} />
      </main>
      
      <AlertModal 
        isOpen={alertModalOpen} 
        onClose={handleCloseAlertModal} 
        alertData={selectedAlert}
      />
    </div>
  );
};

export default Index;
