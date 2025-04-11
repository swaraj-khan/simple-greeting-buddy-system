
import React from 'react';
import { X } from 'lucide-react';

interface CollapsedChatButtonProps {
  onExpand: () => void;
}

const CollapsedChatButton = ({ onExpand }: CollapsedChatButtonProps) => {
  return (
    <button 
      onClick={onExpand}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-full bg-draconic-orange text-white flex items-center justify-center shadow-lg hover:bg-draconic-orange-light transition-all animate-flow-effect"
    >
      <X size={24} />
    </button>
  );
};

export default CollapsedChatButton;
