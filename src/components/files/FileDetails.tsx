
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

interface FileDetailsProps {
  name: string;
  size: string;
  uploadDate: string;
  onDelete: () => void;
}

const FileDetails: React.FC<FileDetailsProps> = ({ name, size, uploadDate, onDelete }) => {
  return (
    <>
      <div className="flex justify-between items-start gap-2 mb-1">
        <h3 className="font-medium text-sm truncate flex-1" title={name}>
          {name}
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{size}</span>
        <span>{uploadDate}</span>
      </div>
    </>
  );
};

export default FileDetails;
