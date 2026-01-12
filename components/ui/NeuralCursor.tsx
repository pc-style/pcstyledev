import React, { useState, useEffect } from 'react';

export const NeuralCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-6 h-6 border-2 border-[#ff00ff] rounded-full pointer-events-none z-[9999] transition-transform duration-75 mix-blend-difference"
      style={{
        transform: `translate(${position.x - 12}px, ${position.y - 12}px) scale(${isPointer ? 1.5 : 1})`,
        boxShadow: '0 0 10px #ff00ff'
      }}
    >
      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-[#ff00ff] rounded-full -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};
