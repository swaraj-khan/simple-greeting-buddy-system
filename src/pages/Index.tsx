
import React, { useState } from 'react';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import AlertModal from '@/components/AlertModal';

const Index = () => {
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  
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
  
  return (
    <div className="min-h-screen w-full honeycomb-bg main-honeycomb-glow relative overflow-hidden">
      <Header />
      <main className="min-h-screen pt-16 w-full">
        <ChatInterface />
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
