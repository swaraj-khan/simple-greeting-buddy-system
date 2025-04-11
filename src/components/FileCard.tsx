
import React from 'react';
import { Card, CardContent } from './ui/card';
import { FileData } from '@/types/files';
import { motion } from 'framer-motion';
import FilePreview from './files/FilePreview';
import FileDetails from './files/FileDetails';

interface FileCardProps {
  file: FileData;
  onDelete: () => void;
  showPreview?: boolean;
}

const FileCard = ({ file, onDelete, showPreview = false }: FileCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
        <div className="w-full aspect-video flex items-center justify-center bg-secondary/30 p-0 m-0">
          <FilePreview 
            type={file.type}
            preview={file.preview}
            name={file.name}
            showPreview={showPreview}
          />
        </div>
        
        <CardContent className="p-3">
          <FileDetails 
            name={file.name}
            size={file.size}
            uploadDate={file.uploadDate}
            onDelete={onDelete}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FileCard;
