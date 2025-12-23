
import React from 'react';
import { DetectedProduct } from '../types';

interface DetectionOverlayProps {
  products: DetectedProduct[];
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const DetectionOverlay: React.FC<DetectionOverlayProps> = ({ products, videoRef }) => {
  if (!videoRef.current || products.length === 0) return null;

  const rect = videoRef.current.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
      {products.map((product) => {
        // Gemini returns 0-1000 normalized coordinates
        const top = (product.box.ymin / 1000) * height;
        const left = (product.box.xmin / 1000) * width;
        const boxWidth = ((product.box.xmax - product.box.xmin) / 1000) * width;
        const boxHeight = ((product.box.ymax - product.box.ymin) / 1000) * height;

        return (
          <div
            key={product.id}
            className="absolute border-2 border-yellow-400 bg-yellow-400/10 transition-all pointer-events-auto cursor-pointer group"
            style={{
              top: `${top}px`,
              left: `${left}px`,
              width: `${boxWidth}px`,
              height: `${boxHeight}px`,
            }}
            onClick={() => window.open(product.shoppingUrl, '_blank')}
          >
            <div className="absolute -top-7 left-0 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 whitespace-nowrap rounded-t-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <span>{product.label}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            
            {/* Visual Indicator Pulser */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full" />
          </div>
        );
      })}
    </div>
  );
};
