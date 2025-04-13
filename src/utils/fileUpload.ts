
import { useToast } from "@/hooks/use-toast";

interface FileUploadOptions {
  fileType: 'chart' | 'journal' | 'orders' | 'books';
  onFileSelected: (file: File) => void;
}

export const createFileUploader = (toast: ReturnType<typeof useToast>['toast']) => {
  return ({ fileType, onFileSelected }: FileUploadOptions) => {
    const input = document.createElement('input');
    input.type = 'file';
    
    switch (fileType) {
      case 'chart':
        input.accept = 'image/*';
        break;
      case 'journal':
      case 'orders':
        input.accept = '.csv,.xlsx,.xls';
        break;
      case 'books':
        input.accept = '.pdf';
        break;
    }
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please upload a file smaller than 5MB",
            variant: "destructive"
          });
          return;
        }
        
        toast({
          title: "File attached",
          description: `${file.name} (${fileType}) attached successfully`,
        });
        
        onFileSelected(file);
      }
    };
    
    input.click();
  };
};
