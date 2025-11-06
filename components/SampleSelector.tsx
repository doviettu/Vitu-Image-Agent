import React from 'react';
import type { SampleImage } from '../types';

interface SampleSelectorProps {
  samples: SampleImage[];
  onSelect: (prompt: string) => void;
}

const SampleSelector: React.FC<SampleSelectorProps> = ({ samples, onSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {samples.map((sample) => (
        <div
          key={sample.id}
          onClick={() => onSelect(sample.prompt)}
          className="relative rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 group hover:scale-105 hover:shadow-lg hover:shadow-gray-700/50 focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:scale-105 focus:shadow-lg focus:shadow-cyan-500/30"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(sample.prompt); }}
        >
          <img src={sample.url} alt={sample.name} className="w-full h-full object-cover aspect-square" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/60 transition-colors"></div>
          <p className="absolute bottom-2 left-3 font-bold text-white text-sm sm:text-base">
            {sample.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SampleSelector;