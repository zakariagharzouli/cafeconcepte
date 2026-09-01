import React from 'react';

export default function IphoneFrame({ children, className = '' }) {
  return (
    <div
      className={`relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-900 border-[10px] rounded-[2.5rem] h-full w-full shadow-2xl overflow-hidden ${className}`}
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 0 4px rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Dynamic Island / Notch */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-50 flex items-center justify-end px-2">
        <div className="w-2 h-2 bg-[#1a1a2e] rounded-full border border-gray-700"></div>
      </div>

      {/* Screen Area */}
      <div className="w-full h-full bg-[#0d0d12] text-white pt-8 pb-4 px-3 overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
}
