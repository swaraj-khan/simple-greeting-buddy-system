
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createFileUploader } from '@/utils/fileUpload';
import { FileData, FileType } from '@/types/files';

// Define the structure for stack files which will be converted to FileData
export interface StackFile {
  id: string;
  name: string;
  type: FileType;
  size: string;
  preview?: string;
}

// Mock data
const mockFiles: StackFile[] = [
  { id: '1', name: 'Q1 Market Analysis.csv', type: 'chart', size: '1.2 MB', preview: '/placeholder.svg' },
  { id: '2', name: 'Weekly Journal.csv', type: 'journal', size: '0.8 MB', preview: '/placeholder.svg' },
  { id: '3', name: 'Order History.csv', type: 'orders', size: '2.4 MB', preview: '/placeholder.svg' },
  { id: '4', name: 'Market Psychology.pdf', type: 'books', size: '4.6 MB', preview: '/placeholder.svg' }
];

export const useStacksData = () => {
  const [activeTab, setActiveTab] = useState<FileType>('chart');
  const [files, setFiles] = useState<StackFile[]>(mockFiles);
  const { toast } = useToast();

  // Convert StackFile to FileData by adding uploadDate
  const getFileData = (files: StackFile[]): FileData[] => {
    return files.map(file => ({
      ...file,
      uploadDate: new Date().toLocaleDateString()
    }));
  };

  // Filter files based on active tab
  const filteredFiles = getFileData(files.filter(file => file.type === activeTab));

  // Handle file upload with proper types
  const handleFileUpload = (fileType: FileType) => {
    const fileUploader = createFileUploader(toast);
    
    fileUploader({
      fileType,
      onFileSelected: (file: File) => {
        // Create a new file entry
        const newFile: StackFile = {
          id: Date.now().toString(),
          name: file.name,
          type: fileType,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          preview: URL.createObjectURL(file)
        };
        
        setFiles(prev => [...prev, newFile]);
      }
    });
  };

  // Handle file deletion
  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    toast({
      title: "File deleted",
      description: "The file has been removed"
    });
  };

  return {
    activeTab,
    setActiveTab,
    filteredFiles,
    handleFileUpload,
    handleDeleteFile
  };
};
