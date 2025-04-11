
import React from 'react';
import { Upload, Image, FileText, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { FileType } from '@/types/files';

interface FileUploadMenuProps {
  handleFileSelection: (fileType: FileType) => void;
}

const FileUploadMenu = ({ handleFileSelection }: FileUploadMenuProps) => {
  const isMobile = useIsMobile();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          size={isMobile ? "icon" : "default"}
        >
          <Upload className="h-4 w-4" />
          {!isMobile && <span>Upload</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur-sm">
        <DropdownMenuLabel>Select file type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleFileSelection('chart')} className="cursor-pointer">
          <Image size={16} className="mr-2" /> Trading Chart
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleFileSelection('journal')} className="cursor-pointer">
          <FileText size={16} className="mr-2" /> Trading Journal
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleFileSelection('orders')} className="cursor-pointer">
          <FileText size={16} className="mr-2" /> Past Orders
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleFileSelection('books')} className="cursor-pointer">
          <BookOpen size={16} className="mr-2" /> Books
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FileUploadMenu;
