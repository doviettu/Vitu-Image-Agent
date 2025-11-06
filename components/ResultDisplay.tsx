import React from 'react';
import { ImageIcon, SparklesIcon, SaveIcon } from './Icons';
import Loader from './Loader';

interface ResultDisplayProps {
  generatedImage: string;
  isLoading: boolean;
  hasModelImage: boolean;
  hasProductImage: boolean;
  onSave: () => void;
  isSaved: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ generatedImage, isLoading, hasModelImage, hasProductImage, onSave, isSaved }) => {
  const Placeholder = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
        {!hasModelImage && <>
            <ImageIcon className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Ảnh của bạn sẽ xuất hiện ở đây</h3>
            <p className="max-w-xs">Bắt đầu bằng cách tải lên ảnh người mẫu.</p>
        </>}
        {hasModelImage && !hasProductImage && <>
            <ImageIcon className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Tuyệt vời!</h3>
            <p className="max-w-xs">Bây giờ, hãy tải lên ảnh sản phẩm.</p>
        </>}
        {hasModelImage && hasProductImage && <>
            <SparklesIcon className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Sẵn sàng ghép ảnh?</h3>
            <p className="max-w-xs">Nhấn nút "Ghép ảnh" để xem kết quả!</p>
        </>}
    </div>
  );

  return (
    <div className="relative w-full aspect-square bg-gray-800/50 rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
            <Loader />
            <p className="mt-4 text-lg font-semibold text-cyan-400">Đang tạo kiệt tác của bạn...</p>
        </div>
      ) : generatedImage ? (
        <>
            <img src={generatedImage} alt="Generated result" className="w-full h-full object-contain" />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                 <button 
                    onClick={onSave}
                    className="flex items-center gap-2 py-2 px-4 bg-gray-900/70 backdrop-blur-sm text-white rounded-lg hover:bg-cyan-500/80 transition-all duration-300 transform hover:scale-105"
                 >
                    <SaveIcon className="w-5 h-5" />
                    Lưu
                 </button>
            </div>
             {isSaved && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 py-2 px-4 bg-green-500/80 backdrop-blur-sm text-white rounded-lg text-sm font-semibold animate-fade-out">
                    Đã lưu vào Bộ sưu tập!
                </div>
            )}
        </>
      ) : (
        <Placeholder />
      )}
    </div>
  );
};

export default ResultDisplay;