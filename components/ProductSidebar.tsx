
import React from 'react';
import { DetectedProduct } from '../types';

interface ProductSidebarProps {
  products: DetectedProduct[];
  isAnalyzing: boolean;
}

export const ProductSidebar: React.FC<ProductSidebarProps> = ({ products, isAnalyzing }) => {
  return (
    <div className="w-full md:w-80 bg-white border-l border-slate-200 h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-bold text-slate-800">Detected Products</h2>
        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
          {products.length} Items
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isAnalyzing && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="rounded-lg bg-slate-200 h-16 w-16"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
            <p className="text-center text-xs text-slate-400 italic">Analyzing frame with Gemini AI...</p>
          </div>
        )}

        {!isAnalyzing && products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-300 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm">Pause the video to detect products</p>
          </div>
        )}

        {!isAnalyzing && products.map((product) => (
          <div key={product.id} 
               className="group p-3 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer shadow-sm hover:shadow-md"
               onClick={() => window.open(product.shoppingUrl, '_blank')}>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                 <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                 </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                  {product.label}
                </h4>
                <div className="flex items-center gap-1 mt-1">
                   <div className="flex text-yellow-400">
                     {[1,2,3,4,5].map(s => (
                       <svg key={s} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                       </svg>
                     ))}
                   </div>
                   <span className="text-[10px] text-slate-400">(4.8)</span>
                </div>
                <button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1">
                   <span>Shop Now</span>
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                   </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <p className="text-[10px] text-slate-400 text-center">
          Powered by Gemini 3 Flash and Advanced Visual AI
        </p>
      </div>
    </div>
  );
};
