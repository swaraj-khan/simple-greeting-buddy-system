
import React from 'react';
import { Upload, Image, FileText } from 'lucide-react';
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
        <DropdownMenuItem onClick={() => handleFileSelection('image')} className="cursor-pointer">
          <Image size={16} className="mr-2" /> Image
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleFileSelection('document')} className="cursor-pointer">
          <FileText size={16} className="mr-2" /> Document (PDF)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FileAttachmentMenu;
