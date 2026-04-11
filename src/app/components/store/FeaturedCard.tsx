import React from 'react';

export const FeaturedCard = () => {
  return (
    <div className="max-w-[900px] mx-auto px-4 pt-[1.5rem]">
      <h3 className="text-[11px] tracking-[2px] mb-[1rem] uppercase font-semibold" style={{ color: "var(--text2)", transition: "color 0.4s" }}>
        FEATURED
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-[1.6fr_1fr] border rounded-[14px] overflow-hidden" style={{ background: "var(--surface)", borderColor: "color-mix(in srgb, var(--text2) 20%, transparent)", transition: "background 0.4s, border-color 0.4s" }}>
        {/* Left - Image area */}
        <div className="bg-[#1a1a2e] relative flex items-center justify-center p-6 sm:h-auto h-[180px]">
          <div className="absolute top-4 left-4 bg-[#b91c1c] text-white text-[10px] font-medium px-3 py-1 rounded-full z-10">
            New
          </div>
          <div className="w-[80%] aspect-[16/9] bg-black/40 border border-white/10 rounded-lg flex items-center justify-center relative shadow-lg">
            <span className="text-white/40 text-sm font-medium">Preview Template</span>
          </div>
        </div>
        
        {/* Right - Info area */}
        <div className="p-[1.5rem] flex flex-col justify-center">
          <span className="text-[10px] tracking-[2px] text-[#b91c1c] font-bold uppercase mb-2 block">
            LANDING PAGE
          </span>
          <h2 className="text-[18px] font-medium mb-2" style={{ color: "var(--text1)", transition: "color 0.4s" }}>SaaS Landing Pro</h2>
          <p className="text-[12px] leading-[1.6] mb-4" style={{ color: "var(--text2)", transition: "color 0.4s" }}>
            Tingkatkan konversi produk SaaS Anda dengan template landing page profesional. Desain modern, responsif, dan mudah disesuaikan.
          </p>
          
          <div className="flex items-end gap-3 mb-6">
            <span className="text-[22px] font-medium text-[#b91c1c]">Rp 89.000</span>
            <span className="text-[13px] line-through mb-[4px]" style={{ color: "var(--text2)", transition: "color 0.4s" }}>Rp 150.000</span>
            <span className="bg-[#fef3c7] text-[#92400e] text-[10px] font-medium px-2 py-0.5 rounded-full mb-[4px]">Pro</span>
          </div>
          
          <div className="flex gap-[8px]">
            <button className="flex-1 h-[36px] items-center justify-center border-[0.5px] bg-transparent rounded-[8px] text-[12px] cursor-pointer hover:bg-black/5" style={{ color: "var(--text1)", borderColor: "color-mix(in srgb, var(--text2) 30%, transparent)", transition: "all 0.4s" }}>
              Preview
            </button>
            <button className="flex-1 h-[36px] items-center justify-center bg-[#b91c1c] text-white rounded-[8px] text-[12px] font-medium hover:bg-red-700 transition-colors cursor-pointer">
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
