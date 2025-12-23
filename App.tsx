
import React, { useState, useRef, useEffect } from 'react';
import { VideoUploader } from './components/VideoUploader';
import { ProductSidebar } from './components/ProductSidebar';
import { DetectionOverlay } from './components/DetectionOverlay';
import { detectProductsInFrame } from './services/geminiService';
import { DetectedProduct } from './types';

const App: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [products, setProducts] = useState<DetectedProduct[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleVideoSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setProducts([]);
    setIsPaused(false);
  };

  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Match canvas size to video actual pixels
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get base64 string without data:image/jpeg;base64, prefix
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    const base64 = dataUrl.split(',')[1];
    
    setIsAnalyzing(true);
    setProducts([]);
    
    try {
      const result = await detectProductsInFrame(base64);
      setProducts(result.products);
    } catch (error) {
      console.error("Detection failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onPlay = () => {
    setIsPaused(false);
    setProducts([]);
  };

  const onPause = () => {
    setIsPaused(true);
    captureFrame();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-hidden h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
             </svg>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            ShopVision AI
          </h1>
        </div>
        
        {videoSrc && (
          <button 
            onClick={() => { setVideoSrc(null); setProducts([]); }}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-100 flex items-center justify-center relative">
          {!videoSrc ? (
            <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-800 mb-3">Your Interactive Shopping Journey</h2>
                <p className="text-slate-500">Upload any video, pause to detect products, and shop instantly.</p>
              </div>
              <VideoUploader onVideoSelect={handleVideoSelect} />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {[
                  { title: 'AI Powered', desc: 'State-of-the-art visual recognition using Gemini API.', icon: '✨' },
                  { title: 'Instant Shop', desc: 'Direct links to major retailers for products you see.', icon: '🛒' },
                  { title: 'Seamless UI', desc: 'Elegant bounding box interaction on paused frames.', icon: '📱' }
                ].map((feature, i) => (
                  <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <h4 className="font-bold text-slate-800 mb-1">{feature.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center group">
              <div className="relative max-w-full max-h-full bg-black rounded-2xl shadow-2xl overflow-hidden border-4 border-white">
                <video 
                  ref={videoRef}
                  src={videoSrc}
                  className="max-h-[80vh] w-auto block"
                  controls
                  onPlay={onPlay}
                  onPause={onPause}
                />
                
                {/* Overlay only shows when paused */}
                {isPaused && (
                  <DetectionOverlay products={products} videoRef={videoRef} />
                )}

                {isAnalyzing && (
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        <span className="text-white font-medium text-sm tracking-widest uppercase">Detecting Products...</span>
                      </div>
                   </div>
                )}
              </div>
              
              {/* Hidden Canvas for Frame Capture */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <ProductSidebar products={products} isAnalyzing={isAnalyzing} />
      </main>

      {/* Persistence Notice */}
      <div className="fixed bottom-4 left-6 z-20">
         <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">AI Vision Active</span>
         </div>
      </div>
    </div>
  );
};

export default App;
