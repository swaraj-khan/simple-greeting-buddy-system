
import React from 'react';

interface ModalHeaderProps {
  isMobile: boolean;
}

const ModalHeader = ({ isMobile }: ModalHeaderProps) => {
  return (
    <div className={`text-center mb-6 ${isMobile ? 'mt-8' : ''}`}>
      <h2 className="text-primary text-3xl font-nova-flat font-bold">Your Knowledge Stacks</h2>
    </div>
  );
};

export default ModalHeader;
