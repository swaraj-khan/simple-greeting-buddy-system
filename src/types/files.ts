
// Define the file types
export type FileType = 'chart' | 'journal' | 'orders' | 'books';

export type FileData = {
  id: string;
  name: string;
  type: FileType;
  size: string;
  uploadDate: string;
  preview?: string;
};
