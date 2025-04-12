
import { useState } from 'react';
import { FileData, FileType } from '@/types/files';

export interface StackData {
  id: number;
  name: string;
  value: number;
  category: string;
  description?: string;
}

export const useStacksData = () => {
  const [data, setData] = useState<StackData[]>([
    {
      id: 1,
      name: 'AAPL',
      value: 150,
      category: 'technology',
      description: 'Apple Inc. - Technology company that designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.'
    },
    {
      id: 2,
      name: 'MSFT',
      value: 300,
      category: 'technology',
      description: 'Microsoft Corporation - Technology company that develops, licenses, and supports software, services, devices, and solutions.'
    },
    {
      id: 3,
      name: 'GOOGL',
      value: 2500,
      category: 'technology',
      description: 'Alphabet Inc. - Technology company that specializes in Internet-related services and products.'
    },
    {
      id: 4,
      name: 'AMZN',
      value: 3000,
      category: 'consumer',
      description: 'Amazon.com, Inc. - Online retailer and cloud services provider.'
    },
    {
      id: 5,
      name: 'TSLA',
      value: 700,
      category: 'automotive',
      description: 'Tesla, Inc. - Automotive and clean energy company.'
    },
    {
      id: 6,
      name: 'FB',
      value: 300,
      category: 'technology',
      description: 'Meta Platforms, Inc. - Technology company that focuses on social media and virtual reality.'
    },
    {
      id: 7,
      name: 'NFLX',
      value: 500,
      category: 'entertainment',
      description: 'Netflix, Inc. - Entertainment company that provides streaming media and video-on-demand online.'
    }
  ]);

  // Add the missing properties
  const [activeTab, setActiveTab] = useState<FileType>('chart');
  const [files, setFiles] = useState<FileData[]>([]);

  // Filter files based on active tab
  const filteredFiles = files.filter(file => file.type === activeTab);

  // Handle file upload
  const handleFileUpload = (fileType: FileType) => {
    console.log(`Uploading file of type: ${fileType}`);
    // Simulate file upload - in a real app, this would handle the actual upload
    const newFile: FileData = {
      id: `file-${Date.now()}`,
      name: `New ${fileType} file`,
      type: fileType,
      size: '10 KB',
      uploadDate: new Date().toLocaleDateString(),
      preview: fileType === 'chart' ? '/placeholder.svg' : undefined
    };
    
    setFiles(prev => [...prev, newFile]);
  };

  // Handle file delete
  const handleDeleteFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
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

export default useStacksData;
