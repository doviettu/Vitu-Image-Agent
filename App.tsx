import React, { useState, useCallback } from 'react';
import type { UploadedFile, GalleryItem } from './types';
import { generateImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Header from './components/Header';
import Gallery from './components/Gallery';
import { SparklesIcon } from './components/Icons';

// A custom hook to synchronize state with localStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}


const App: React.FC = () => {
  const [view, setView] = useState<'creator' | 'gallery'>('creator');
  const [gallery, setGallery] = useLocalStorage<GalleryItem[]>('image-agent-gallery', []);

  // Creator state
  const [modelImageFile, setModelImageFile] = useState<UploadedFile | null>(null);
  const [productImageFile, setProductImageFile] = useState<UploadedFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const [isLoadingGeneration, setIsLoadingGeneration] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleModelImageUpload = useCallback(async (file: File) => {
    setError('');
    setGeneratedImage('');
    setProductImageFile(null);
    setIsSaved(false);
    setCurrentSessionId(crypto.randomUUID());

    try {
      const base64String = await fileToBase64(file);
      const newFile: UploadedFile = {
        base64: base64String.split(',')[1],
        mimeType: file.type,
        name: file.name,
      };
      setModelImageFile(newFile);
    } catch (err) {
      console.error(err);
      setError('Không thể xử lý ảnh người mẫu. Vui lòng thử lại.');
    }
  }, []);
  
  const handleProductImageUpload = useCallback(async (file: File) => {
    if (!modelImageFile) {
        setError("Vui lòng tải lên ảnh người mẫu trước.");
        return;
    }
    setError('');
    try {
      const base64String = await fileToBase64(file);
      const newFile: UploadedFile = {
        base64: base64String.split(',')[1],
        mimeType: file.type,
        name: file.name,
      };
      setProductImageFile(newFile);
    } catch (err) {
      console.error(err);
      setError('Không thể xử lý ảnh sản phẩm. Vui lòng thử lại.');
    }
  }, [modelImageFile]);


  const handleGenerateClick = useCallback(async () => {
    if (!modelImageFile || !productImageFile) {
      setError('Vui lòng tải lên cả ảnh người mẫu và ảnh sản phẩm.');
      return;
    }
    setError('');
    setGeneratedImage('');
    setIsLoadingGeneration(true);
    setIsSaved(false);

    try {
      const generatedImgResult = await generateImage(modelImageFile, productImageFile);
      setGeneratedImage(`data:image/png;base64,${generatedImgResult}`);
    } catch (err) {
      console.error(err);
      setError('Không thể tạo ảnh mới. Mô hình có thể có các hạn chế về nội dung. Vui lòng thử một ảnh khác.');
    } finally {
      setIsLoadingGeneration(false);
    }
  }, [modelImageFile, productImageFile]);

  const handleSaveToGallery = useCallback(() => {
    if (!currentSessionId || !modelImageFile || !productImageFile || !generatedImage) return;

    setGallery(prevGallery => {
        const existingItemIndex = prevGallery.findIndex(item => item.id === currentSessionId);
        const newGeneratedImage = { imageUrl: generatedImage };

        if (existingItemIndex > -1) {
            // Update existing item
            const updatedGallery = [...prevGallery];
            const existingItem = updatedGallery[existingItemIndex];
            existingItem.generatedImages.push(newGeneratedImage);
            return updatedGallery;
        } else {
            // Add new item
            const newItem: GalleryItem = {
                id: currentSessionId,
                modelImageFile,
                productImageFile,
                generatedImages: [newGeneratedImage],
                createdAt: new Date().toISOString(),
            };
            return [newItem, ...prevGallery];
        }
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000); // Hide notification after 2 seconds
  }, [currentSessionId, modelImageFile, productImageFile, generatedImage, setGallery]);
  
  const handleRemoveFromGallery = (id: string) => {
    if(window.confirm('Bạn có chắc chắn muốn xóa mục này khỏi bộ sưu tập không?')) {
        setGallery(gallery.filter(item => item.id !== id));
    }
  };

  const CreatorView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Controls Column */}
      <div className="flex flex-col gap-8">
        <section>
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-cyan-500 pb-2">1. Tải lên ảnh người mẫu</h2>
          <ImageUploader onImageUpload={handleModelImageUpload} uploadedFile={modelImageFile} />
        </section>
        
        {modelImageFile && (
          <section>
            <h2 className="text-2xl font-bold mb-4 border-b-2 border-cyan-500 pb-2">2. Tải lên ảnh sản phẩm</h2>
            <ImageUploader onImageUpload={handleProductImageUpload} uploadedFile={productImageFile} />
          </section>
        )}
        
        <div className="sticky bottom-4">
          <button
            onClick={handleGenerateClick}
            disabled={!modelImageFile || !productImageFile || isLoadingGeneration}
            className="w-full flex items-center justify-center gap-3 text-lg font-bold py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
          >
            <SparklesIcon className="w-6 h-6" />
            {isLoadingGeneration ? 'Đang ghép ảnh...' : '3. Ghép ảnh'}
          </button>
        </div>
      </div>

      {/* Result Column */}
      <div className="lg:sticky top-8 self-start">
        <ResultDisplay 
          generatedImage={generatedImage} 
          isLoading={isLoadingGeneration}
          hasModelImage={!!modelImageFile}
          hasProductImage={!!productImageFile}
          onSave={handleSaveToGallery}
          isSaved={isSaved}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header activeView={view} onNavigate={setView} />

        {error && (
            <div className="my-4 p-4 bg-red-900/50 text-red-300 border border-red-700 rounded-lg text-center">
                <p>{error}</p>
            </div>
        )}

        <main className="mt-8">
          {view === 'creator' ? <CreatorView /> : <Gallery items={gallery} onDelete={handleRemoveFromGallery} />}
        </main>
      </div>
    </div>
  );
};

export default App;