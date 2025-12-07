import React from 'react';
import { Target } from 'lucide-react';

const Logo: React.FC<{ light?: boolean }> = ({ light = false }) => {
  return (
    <div className="flex items-center gap-2 select-none cursor-pointer">
      <div className={`p-1.5 rounded-lg ${light ? 'bg-white/10' : 'bg-itaca-dark'}`}>
        <Target className={`w-6 h-6 ${light ? 'text-itaca-light' : 'text-white'}`} />
      </div>
      <span className={`text-xl font-bold tracking-tight ${light ? 'text-white' : 'text-itaca-dark'}`}>
        Itaca<span className="text-itaca-light">Tech</span>
      </span>
    </div>
  );
};

export default Logo;