
import React from 'react';
import { Upload, Image, FileText, BookOpen } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { FileType } from '@/types/files';

interface FileAttachmentMenuProps {
  handleFileSelection: (fileType: FileType) => void;
}

const FileAttachmentMenu: React.FC<FileAttachmentMenuProps> = ({ handleFileSelection }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground flex items-center gap-2 ml-2">
          <Upload size={16} />
          <span>Attach</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
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

export default FileAttachmentMenu;
