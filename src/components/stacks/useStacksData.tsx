
import { useState, useEffect } from 'react';
import { FileType } from '@/types/files';

export interface StackFile {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document';
  url: string;
  createdAt: string;
  size: number;
}

export interface StackData {
  id: string;
  name: string;
  files: StackFile[];
}

export const useStacksData = () => {
  const [data, setData] = useState<StackData[]>([
    {
      id: '1',
      name: 'Research',
      files: [
        {
          id: '1',
          name: 'Market Analysis.pdf',
          type: 'pdf',
          url: '/placeholder.svg',
          createdAt: '2023-11-10T10:00:00Z',
          size: 2500000
        },
        {
          id: '2',
          name: 'Competitor Research.pdf',
          type: 'pdf',
          url: '/placeholder.svg',
          createdAt: '2023-11-09T14:30:00Z',
          size: 1800000
        }
      ]
    },
    {
      id: '2',
      name: 'Reports',
      files: [
        {
          id: '3',
          name: 'Q3 Financial Report.pdf',
          type: 'pdf',
          url: '/placeholder.svg',
          createdAt: '2023-10-15T09:00:00Z',
          size: 3200000
        }
      ]
    },
    {
      id: '3',
      name: 'Images',
      files: [
        {
          id: '4',
          name: 'Product Mockup.png',
          type: 'image',
          url: '/placeholder.svg',
          createdAt: '2023-11-05T11:20:00Z',
          size: 1500000
        }
      ]
    }
  ]);
  
  const [activeTab, setActiveTab] = useState<number>(0);
  const [filteredFiles, setFilteredFiles] = useState<StackFile[]>([]);

  useEffect(() => {
    if (activeTab === 0) {
      // All files
      setFilteredFiles(data.flatMap(stack => stack.files));
    } else {
      // Files from specific stack (subtract 1 because first tab is "All")
      const stackIndex = activeTab - 1;
      setFilteredFiles(data[stackIndex]?.files || []);
    }
  }, [activeTab, data]);

  const handleFileUpload = (file: File, fileType: FileType, stackId: string) => {
    const newFile: StackFile = {
      id: Math.random().toString(36).substring(7),
      name: file.name,
      type: fileType === 'image' ? 'image' : 'document',
      url: URL.createObjectURL(file),
      createdAt: new Date().toISOString(),
      size: file.size
    };

    setData(prevData => 
      prevData.map(stack => 
        stack.id === stackId 
          ? { ...stack, files: [...stack.files, newFile] } 
          : stack
      )
    );
  };

  const handleDeleteFile = (fileId: string) => {
    setData(prevData => 
      prevData.map(stack => ({
        ...stack,
        files: stack.files.filter(file => file.id !== fileId)
      }))
    );
  };

  return { 
    data, 
    setData,
    activeTab,
    setActiveTab,
    filteredFiles,
    handleFileUpload,
    handleDeleteFile
  };
};
