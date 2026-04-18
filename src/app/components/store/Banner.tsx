import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { apiFetch } from '../../../lib/apiClient';
// import BannerImg from './../../../assets/banner1.png'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";

function cloudinaryUrl(publicId: string) {
  if (!publicId) return "";
  if (publicId.startsWith("http")) return publicId;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto,f_auto/${publicId}`;
}

interface BannerProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeCategory: string;
  setActiveCategory: (val: string) => void;
  categories: string[];
}

export const Banner: React.FC<BannerProps> = ({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  categories,
}) => {
  const [desktopImage, setDesktopImage] = useState("");
  const [mobileImage, setMobileImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await apiFetch(`${API_URL}/store/banners`);
        const result = await res.json();
        if (result.success && result.data) {
          setDesktopImage(cloudinaryUrl(result.data.desktopImageUrl));
          setMobileImage(cloudinaryUrl(result.data.mobileImageUrl));
        }
      } catch (e) {
        console.error("Failed to load banner", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBanner();
  }, []);

  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center h-[100vh]" style={{ backgroundColor: "var(--bg)" }}>
      {/* Background Image (Dynamic Split for Desktop/Mobile) */}
      {loading ? (
        <div className="absolute inset-0 w-full h-full z-0 animate-pulse bg-gray-900/50" />
      ) : desktopImage && mobileImage ? (
        <picture className="absolute inset-0 w-full h-full z-0">
          <source media="(max-width: 768px)" srcSet={mobileImage} />
          <img 
            src={desktopImage} 
            alt="Promo Banner" 
            className="w-full h-full object-cover object-center" 
          />
        </picture>
      ) : (
        <img 
          src="null"
          alt="ini Banner" 
          className="absolute inset-0 w-full h-full z-0 bg-gray-900/50" 
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      )}
      {/* Dark overlay to ensure text remains readable */}
      <div className="absolute inset-0 bg-black/30 z-0 pointer-events-none" />
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none z-0" />
      
      <div className="max-w-[900px] mx-auto px-4 sm:px-8 py-10 relative z-10 text-center flex flex-col items-center">

        <div className="w-full max-w-2xl flex flex-wrap sm:flex-nowrap gap-[10px]">
          <div className="w-full sm:w-auto sm:flex-1 flex min-w-[200px] items-center bg-white rounded-lg h-[42px] px-[14px]">
            <Search className="text-gray-400 w-5 h-5 mr-2 flex-shrink-0" />
            <input 
              type="text"
              placeholder="Cari template..."
              className="w-full h-full bg-transparent outline-none text-[#111111] text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  document.getElementById('template-grid')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </div>
          <select 
            className="w-full sm:w-auto h-[42px] rounded-lg bg-white/15 text-white min-w-[140px] px-3 outline-none border-none text-sm cursor-pointer"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="text-black">{cat}</option>
            ))}
          </select>
          <button 
            onClick={() => document.getElementById('template-grid')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto h-[42px] rounded-lg bg-white font-medium text-[#b91c1c] px-6 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cari
          </button>
        </div>

        <div className="mt-[1.2rem] flex flex-wrap justify-center gap-2">
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full text-[12px] px-[14px] py-[5px] border cursor-pointer transition-all ${
                  isActive 
                    ? 'bg-white text-[#b91c1c] border-white' 
                    : 'bg-transparent text-white/80 border-white/30 hover:border-white/60'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>
      </div>
  );
};
 