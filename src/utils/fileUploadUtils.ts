
import { FileType } from '@/types/files';
import { toast } from '@/hooks/use-toast';

// Generic file uploader creator function
export const createFileUploader = (toastFn = toast) => {
  // Return a function that takes options
  return (options: {
    fileType: FileType;
    onFileSelected: (file: File) => void;
    multiple?: boolean;
  }) => {
    const { fileType, onFileSelected, multiple = false } = options;
    
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = multiple;
    
    // Set accept attribute based on file type
    if (fileType === 'image') {
      input.accept = 'image/*';
    } else if (fileType === 'document') {
      input.accept = '.pdf,.doc,.docx,.txt';
    }
    
    // Set up file selection handler
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      
      if (!files || files.length === 0) {
        return;
      }
      
      // Handle each selected file
      Array.from(files).forEach(file => {
        // Validate file type
        if (fileType === 'image' && !file.type.startsWith('image/')) {
          toastFn({
            title: "Invalid file type",
            description: "Please select an image file",
            variant: "destructive",
          });
          return;
        }
        
        if (fileType === 'document' && 
            !['.pdf', '.doc', '.docx', '.txt'].some(ext => 
              file.name.toLowerCase().endsWith(ext)
            )) {
          toastFn({
            title: "Invalid file type",
            description: "Please select a valid document file (PDF, DOC, DOCX, TXT)",
            variant: "destructive",
          });
          return;
        }
        
        // Call the callback with the file
        onFileSelected(file);
      });
    };
    
    // Trigger the file selection dialog
    input.click();
  };
};
