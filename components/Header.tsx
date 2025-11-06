import React from 'react';
import { CreateIcon, GalleryIcon } from './Icons';

type View = 'creator' | 'gallery';

interface HeaderProps {
    activeView: View;
    onNavigate: (view: View) => void;
}

const NavButton: React.FC<{
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            isActive
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
        }`}
    >
        {children}
    </button>
);

const Header: React.FC<HeaderProps> = ({ activeView, onNavigate }) => {
    return (
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
            <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                    Image Agent
                </h1>
                <p className="mt-1 text-sm text-gray-400">Ghép ảnh người mẫu và sản phẩm của bạn bằng AI</p>
            </div>
            <nav className="flex items-center gap-2 p-1 bg-gray-800 rounded-lg">
                <NavButton isActive={activeView === 'creator'} onClick={() => onNavigate('creator')}>
                    <CreateIcon className="w-5 h-5"/>
                    Trình tạo
                </NavButton>
                <NavButton isActive={activeView === 'gallery'} onClick={() => onNavigate('gallery')}>
                    <GalleryIcon className="w-5 h-5"/>
                    Bộ sưu tập
                </NavButton>
            </nav>
        </header>
    );
};

export default Header;