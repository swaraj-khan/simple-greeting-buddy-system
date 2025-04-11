
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from '@/hooks/use-mobile';
import CloseButton from './CloseButton';
import ModalHeader from './ModalHeader';
import StacksContent from './stacks/StacksContent';
import { useStacksData } from './stacks/useStacksData';

interface StacksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StacksModal = ({ isOpen, onClose }: StacksModalProps) => {
  const isMobile = useIsMobile();
  const { 
    activeTab,
    setActiveTab,
    filteredFiles,
    handleFileUpload,
    handleDeleteFile
  } = useStacksData();
  
  return (
    <>
      {/* Close button outside Dialog */}
      <CloseButton isOpen={isOpen} onClose={onClose} isMobile={isMobile} />
      
      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent 
          className="max-w-5xl p-0 bg-transparent border-0 shadow-none overflow-y-auto max-h-[90vh]"
          style={{ animation: 'none' }}
          closeButton={false}
        >
          {/* Hidden DialogTitle for accessibility */}
          <DialogTitle className="sr-only">Your Knowledge Stacks</DialogTitle>
          
          <ModalHeader isMobile={isMobile} />
          
          <StacksContent 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            filteredFiles={filteredFiles}
            handleDeleteFile={handleDeleteFile}
            handleFileUpload={handleFileUpload}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StacksModal;
