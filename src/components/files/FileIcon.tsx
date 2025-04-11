
import React from 'react';
import { Image, FileSpreadsheet, FileText, BookOpen } from 'lucide-react';
import { FileType } from '@/types/files';

interface FileIconProps {
  fileType: FileType;
  className?: string;
}

const FileIcon: React.FC<FileIconProps> = ({ fileType, className }) => {
  switch (fileType) {
    case 'chart':
      return <Image className={className || "h-12 w-12 text-muted-foreground"} />;
    case 'journal':
      return <FileSpreadsheet className={className || "h-12 w-12 text-muted-foreground"} />;
    case 'orders':
      return <FileText className={className || "h-12 w-12 text-muted-foreground"} />;
    case 'books':
      return <BookOpen className={className || "h-12 w-12 text-muted-foreground"} />;
    default:
      return <FileText className={className || "h-12 w-12 text-muted-foreground"} />;
  }
};

export default FileIcon;
