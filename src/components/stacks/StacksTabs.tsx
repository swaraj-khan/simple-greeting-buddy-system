
import React from 'react';
import { TabsList, TabsTrigger } from '../ui/tabs';
import { Image, FileText, FileSpreadsheet, BookOpen } from 'lucide-react';
import { FileType } from '@/types/files';

interface StacksTabsProps {
  activeTab: FileType;
  setActiveTab: (tab: FileType) => void;
  isMobile: boolean;
}

const StacksTabs: React.FC<StacksTabsProps> = ({ activeTab, setActiveTab, isMobile }) => {
  return (
    <TabsList className="grid grid-cols-4 w-full md:w-auto">
      <TabsTrigger 
        value="chart" 
        className="flex items-center gap-2 justify-center"
        onClick={() => setActiveTab('chart')}
        data-state={activeTab === 'chart' ? 'active' : ''}
      >
        <Image size={isMobile ? 16 : 20} />
        {!isMobile && <span className="hidden md:inline">Charts</span>}
      </TabsTrigger>
      
      <TabsTrigger 
        value="journal" 
        className="flex items-center gap-2 justify-center"
        onClick={() => setActiveTab('journal')}
        data-state={activeTab === 'journal' ? 'active' : ''}
      >
        <FileSpreadsheet size={isMobile ? 16 : 20} />
        {!isMobile && <span className="hidden md:inline">Journal</span>}
      </TabsTrigger>
      
      <TabsTrigger 
        value="orders" 
        className="flex items-center gap-2 justify-center"
        onClick={() => setActiveTab('orders')}
        data-state={activeTab === 'orders' ? 'active' : ''}
      >
        <FileText size={isMobile ? 16 : 20} />
        {!isMobile && <span className="hidden md:inline">Orders</span>}
      </TabsTrigger>
      
      <TabsTrigger 
        value="books" 
        className="flex items-center gap-2 justify-center"
        onClick={() => setActiveTab('books')}
        data-state={activeTab === 'books' ? 'active' : ''}
      >
        <BookOpen size={isMobile ? 16 : 20} />
        {!isMobile && <span className="hidden md:inline">Books</span>}
      </TabsTrigger>
    </TabsList>
  );
};

export default StacksTabs;
