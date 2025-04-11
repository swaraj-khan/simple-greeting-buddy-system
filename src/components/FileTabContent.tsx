
import React from 'react';
import { TabsContent } from './ui/tabs';
import FileCard from './FileCard';
import { FileData } from '@/types/files';
import { AnimatePresence } from 'framer-motion';
import FileGrid from './files/FileGrid';

interface FileTabContentProps {
  value: string;
  files: FileData[];
  onDelete: (id: string) => void;
  showPreview?: boolean;
}

const FileTabContent = ({ value, files, onDelete, showPreview = false }: FileTabContentProps) => {
  return (
    <TabsContent value={value}>
      <FileGrid>
        <AnimatePresence>
          {files.map((file) => (
            <FileCard 
              key={file.id} 
              file={file} 
              onDelete={() => onDelete(file.id)}
              showPreview={showPreview} 
            />
          ))}
        </AnimatePresence>
      </FileGrid>
    </TabsContent>
  );
};

export default FileTabContent;
