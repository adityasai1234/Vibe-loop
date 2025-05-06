import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(prev => !prev)}
      className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-700 transition-colors focus:outline-none"
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={`${
          isDark ? 'translate-x-7' : 'translate-x-1'
        } inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white transition-transform`}
      >
        {isDark ? (
          <Moon size={14} className="text-gray-900" />
        ) : (
          <Sun size={14} className="text-gray-900" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;