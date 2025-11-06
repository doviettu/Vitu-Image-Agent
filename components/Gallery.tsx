import React from 'react';
import type { GalleryItem } from '../types';
import { TrashIcon } from './Icons';

interface GalleryProps {
    items: GalleryItem[];
    onDelete: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ items, onDelete }) => {
    if (items.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-400 mb-2">Bộ sưu tập của bạn trống</h2>
                <p className="text-gray-500">Lưu các tác phẩm bạn tạo để xem chúng ở đây.</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {items.map(item => (
                    <div key={item.id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col group">
                        <div className="p-4 flex-grow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs text-gray-500">Đã tạo vào</p>
                                    <p className="text-sm font-semibold text-gray-300">{new Date(item.createdAt).toLocaleDateString()}</p>
                                </div>
                                <button onClick={() => onDelete(item.id)} className="p-2 rounded-full text-gray-500 hover:bg-red-500/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1 font-bold text-center">Người mẫu</p>
                                    <img 
                                        src={`data:${item.modelImageFile.mimeType};base64,${item.modelImageFile.base64}`} 
                                        alt="Uploaded model" 
                                        className="w-full aspect-square object-cover rounded-md"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1 font-bold text-center">Sản phẩm</p>
                                    <img 
                                        src={`data:${item.productImageFile.mimeType};base64,${item.productImageFile.base64}`} 
                                        alt="Uploaded product" 
                                        className="w-full aspect-square object-cover rounded-md"
                                    />
                                </div>
                            </div>
                            
                            <div>
                               <h3 className="text-base font-bold text-gray-300 mb-2">Kết quả đã tạo ({item.generatedImages.length})</h3>
                               <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-2">
                                  {item.generatedImages.map((genImg, index) => (
                                      <div key={index} className="flex items-center gap-3 bg-gray-900/50 p-2 rounded-md">
                                          <img src={genImg.imageUrl} alt={`Generated image ${index + 1}`} className="w-16 h-16 object-cover rounded"/>
                                          <p className="text-sm text-gray-300 flex-1">Biến thể {index + 1}</p>
                                      </div>
                                  ))}
                               </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;