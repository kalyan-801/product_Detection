
import React, { useRef } from 'react';

interface VideoUploaderProps {
  onVideoSelect: (file: File) => void;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onVideoSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-300 rounded-2xl bg-white hover:border-blue-500 transition-colors cursor-pointer group"
         onClick={() => fileInputRef.current?.click()}>
      <input 
        type="file" 
        className="hidden" 
        accept="video/*" 
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-800">Upload a Video</h3>
      <p className="text-slate-500 text-sm mt-1">Click to browse or drag and drop a video file</p>
    </div>
  );
};
