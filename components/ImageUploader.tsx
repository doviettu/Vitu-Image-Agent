
import React, { useRef, useState, useCallback } from 'react';
import type { UploadedFile } from '../types';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  uploadedFile: UploadedFile | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, uploadedFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleUploaderClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageUpload(file);
    }
  }, [onImageUpload]);


  return (
    <div 
      onClick={handleUploaderClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative group w-full p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
        ${isDragging ? 'border-cyan-400 bg-gray-700/50' : 'border-gray-600 hover:border-cyan-500 hover:bg-gray-800/50'}
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      {uploadedFile ? (
        <div>
          <img
            src={`data:${uploadedFile.mimeType};base64,${uploadedFile.base64}`}
            alt={uploadedFile.name}
            className="w-full h-auto max-h-80 object-contain rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
             <p className="text-white text-lg font-semibold">Click to change image</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-56 text-gray-500">
          <UploadIcon className="w-12 h-12 mb-4 transition-transform duration-300 group-hover:scale-110" />
          <p className="font-semibold">
            <span className="text-cyan-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm">PNG, JPG, WEBP, etc.</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
