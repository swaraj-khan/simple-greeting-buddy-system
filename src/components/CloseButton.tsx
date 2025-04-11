
import React from 'react';
import { X } from 'lucide-react';

interface CloseButtonProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const CloseButton = ({ isOpen, onClose, isMobile }: CloseButtonProps) => {
  if (!isOpen) return null;
  
  return (
    <div 
      className={`fixed ${isMobile ? 'top-2 right-4' : 'top-4 right-4'} z-[9999]`} 
      style={{ pointerEvents: 'auto' }}
    >
      <button 
        onClick={onClose}
        className="p-3 bg-secondary border-2 border-draconic-orange rounded-md hover:bg-secondary/80 transition-colors cursor-pointer"
        aria-label="Close stacks"
        title="Close stacks"
      >
        <X className="h-6 w-6 text-draconic-orange" />
      </button>
    </div>
  );
};

export default CloseButton;
