
import React from 'react';
import { Tabs, TabsContent } from '../ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import FileTabContent from '../FileTabContent';
import { FileData, FileType } from '@/types/files';
import StacksTabs from './StacksTabs';
import FileUploadMenu from '../FileUploadMenu';

interface StacksContentProps {
  activeTab: FileType;
  setActiveTab: (tab: FileType) => void;
  filteredFiles: FileData[];
  handleDeleteFile: (id: string) => void;
  handleFileUpload: (fileType: FileType) => void;
}

const StacksContent: React.FC<StacksContentProps> = ({
  activeTab,
  setActiveTab,
  filteredFiles,
  handleDeleteFile,
  handleFileUpload
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-background/90 backdrop-blur-sm rounded-lg border border-border/30 shadow-lg p-6">
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(v) => setActiveTab(v as FileType)}>
        <div className="flex justify-between items-center mb-6">
          <StacksTabs activeTab={activeTab} setActiveTab={setActiveTab} isMobile={isMobile} />
          
          <div className={isMobile ? "ml-4" : ""}>
            <FileUploadMenu handleFileSelection={handleFileUpload} />
          </div>
        </div>
        
        <FileTabContent 
          value="chart" 
          files={filteredFiles} 
          onDelete={handleDeleteFile} 
          showPreview={true} 
        />
        
        <FileTabContent 
          value="journal" 
          files={filteredFiles} 
          onDelete={handleDeleteFile} 
        />
        
        <FileTabContent 
          value="orders" 
          files={filteredFiles} 
          onDelete={handleDeleteFile} 
        />
        
        <FileTabContent 
          value="books" 
          files={filteredFiles} 
          onDelete={handleDeleteFile} 
        />
      </Tabs>
    </div>
  );
};

export default StacksContent;
