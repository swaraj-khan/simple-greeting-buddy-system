
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileType } from "@/types/files";
import { useAuth } from "@/contexts/AuthContext";

// Extended file info for uploaded files
export interface UploadedFile {
  id: string;
  name: string;
  type: FileType;
  size: number;
  url: string;
}

interface FileUploadOptions {
  fileType: FileType;
  onFileSelected: (file: File, uploadedFile?: UploadedFile) => void;
}

export const createFileUploader = (toast: ReturnType<typeof useToast>['toast']) => {
  return ({ fileType, onFileSelected }: FileUploadOptions) => {
    const input = document.createElement('input');
    input.type = 'file';
    
    switch (fileType) {
      case 'image':
        input.accept = 'image/*';
        break;
      case 'document':
        input.accept = '.pdf';
        break;
    }
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      
      if (file) {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          toast({
            title: "File too large",
            description: "Please upload a file smaller than 10MB",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "File selected",
          description: `${file.name} (${fileType}) selected successfully`,
        });
        
        onFileSelected(file);
      }
    };
    
    input.click();
  };
};

export const useFileUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const uploadFile = async (file: File, fileType: FileType): Promise<UploadedFile | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload files",
        variant: "destructive"
      });
      return null;
    }

    try {
      const bucketId = fileType === 'document' ? 'user_documents' : 'user_images';
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucketId)
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      const { data: urlData } = await supabase.storage
        .from(bucketId)
        .getPublicUrl(fileName);

      return {
        id: data.path,
        name: file.name,
        type: fileType,
        size: file.size,
        url: urlData.publicUrl
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file to storage",
        variant: "destructive"
      });
      return null;
    }
  };

  return { uploadFile };
};
