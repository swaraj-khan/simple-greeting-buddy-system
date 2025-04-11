
import React from 'react';
import FileIcon from './FileIcon';
import { FileType } from '@/types/files';

interface FilePreviewProps {
  type: FileType;
  preview?: string;
  name: string;
  showPreview: boolean;
}

const FilePreview: React.FC<FilePreviewProps> = ({ type, preview, name, showPreview }) => {
  if (showPreview && preview) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <img 
          src={preview} 
          alt={name}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <FileIcon fileType={type} />
    </div>
  );
};

export default FilePreview;
