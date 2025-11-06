export interface UploadedFile {
  base64: string;
  mimeType: string;
  name: string;
}

export interface GalleryItem {
  id: string;
  modelImageFile: UploadedFile;
  productImageFile: UploadedFile;
  generatedImages: {
    imageUrl: string;
  }[];
  createdAt: string;
}

// FIX: Add missing SampleImage interface to fix type errors.
export interface SampleImage {
  id: string;
  url: string;
  name: string;
  prompt: string;
}
