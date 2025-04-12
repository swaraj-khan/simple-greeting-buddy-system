
export type FileType = 'image' | 'document';

export interface FileData {
  id: string;
  name: string;
  type: FileType;
  size: number;
  preview?: string;
  uploadDate: string;
  url?: string;
}
