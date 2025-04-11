
import { useState } from 'react';
import { FileData, FileType } from '@/types/files';
import { useToast } from '@/hooks/use-toast';
import { createFileUploader } from '@/utils/fileUpload';

// Sample file data
const sampleFiles: FileData[] = [
  {
    id: '1',
    name: 'Daily Chart NIFTY.png',
    type: 'chart',
    size: '2.4 MB',
    uploadDate: '2025-03-28',
    preview: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Weekly Chart BANK.jpg',
    type: 'chart',
    size: '3.1 MB',
    uploadDate: '2025-04-02',
    preview: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Trading Journal 2025.xlsx',
    type: 'journal',
    size: '1.2 MB',
    uploadDate: '2025-04-01',
  },
  {
    id: '4',
    name: 'March Orders.csv',
    type: 'orders',
    size: '842 KB',
    uploadDate: '2025-04-05',
  },
  {
    id: '5',
    name: 'Trading Psychology.pdf',
    type: 'books',
    size: '4.6 MB',
    uploadDate: '2025-03-15',
  },
  {
    id: '6',
    name: 'Market Wizards.pdf',
    type: 'books',
    size: '5.8 MB',
    uploadDate: '2025-03-22',
  },
];

export const useStacksData = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileData[]>(sampleFiles);
  const [activeTab, setActiveTab] = useState<FileType>('chart');
  
  // Filter files by type
  const filteredFiles = files.filter(file => file.type === activeTab);
  
  // File uploader
  const handleFileUpload = (fileType: FileType) => {
    const uploadFile = createFileUploader(toast);
    uploadFile({
      fileType,
      onFileSelected: (file) => {
        // Create new file data
        const newFile: FileData = {
          id: Date.now().toString(),
          name: file.name,
          type: fileType,
          size: formatFileSize(file.size),
          uploadDate: new Date().toISOString().split('T')[0]
        };
        
        // If it's an image, create preview
        if (fileType === 'chart' && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setFiles(prev => [...prev, {
                ...newFile,
                preview: e.target?.result as string
              }]);
            }
          };
          reader.readAsDataURL(file);
        } else {
          setFiles(prev => [...prev, newFile]);
        }
      }
    });
  };
  
  // Delete file handler
  const handleDeleteFile = (id: string) => {
    toast({
      title: "File deleted",
      description: "The selected file has been removed",
    });
    
    setFiles(files.filter(file => file.id !== id));
  };
  
  // Helper to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return {
    files,
    activeTab,
    setActiveTab,
    filteredFiles,
    handleFileUpload,
    handleDeleteFile
  };
};
