
import React from 'react';

interface FileGridProps {
  children: React.ReactNode;
}

const FileGrid: React.FC<FileGridProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {children}
    </div>
  );
};

export default FileGrid;
