import React from 'react';

interface TemplateCardProps {
  title: string;
  category: string;
  price: number;
  badge: "Free" | "Pro";
  isNew: boolean;
  bg: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  title, 
  category, 
  price, 
  badge, 
  isNew, 
  bg,
}) => {
  const isFree = price === 0;
  
  return (
    <div className="border border-border rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow" style={{ background: "var(--surface)", borderColor: "color-mix(in srgb, var(--text2) 20%, transparent)" }}>
      {/* Top Image area */}
      <div 
        className="h-[120px] relative flex items-center justify-center"
        style={{ backgroundColor: bg }}
      >
        {isNew && (
          <div className="absolute top-2 right-2 bg-[#b91c1c] text-white text-[9px] font-medium px-2 py-0.5 rounded-full z-10">
            New
          </div>
        )}
        <div className={`absolute top-2 left-2 text-[9px] font-medium px-2 py-0.5 rounded-full z-10 ${
          badge === 'Free' ? 'bg-[#d1fae5] text-[#065f46]' : 'bg-[#fef3c7] text-[#92400e]'
        }`}>
          {badge}
        </div>
        
        <div className="w-[75%] aspect-[16/9] bg-black/20 border border-white/10 rounded overflow-hidden flex items-center justify-center">
           <span className="text-white/20 text-xs font-medium">Preview</span>
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[9px] tracking-[1.5px] text-[#b91c1c] font-bold uppercase mb-1 block">
            {category}
          </span>
          <h3 className="text-[13px] font-medium mb-[10px]" style={{ color: "var(--text1)", transition: "color 0.4s" }}>
            {title}
          </h3>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <span className={`text-[14px] font-medium ${isFree ? 'text-[#059669]' : ''}`} style={!isFree ? { color: "var(--text1)", transition: "color 0.4s" } : {}}>
            {isFree ? "Gratis" : `Rp ${price.toLocaleString("id-ID")}`}
          </span>
          <div className="flex gap-[6px]">
            <button className="px-[10px] py-[4px] border rounded-[6px] text-[10px] font-medium cursor-pointer hover:bg-black/5" style={{ color: "var(--text1)", borderColor: "color-mix(in srgb, var(--text2) 30%, transparent)", transition: "all 0.4s" }}>
              Preview
            </button>
            <button className="px-[10px] py-[4px] bg-[#b91c1c] text-white rounded-[6px] text-[10px] font-medium hover:bg-red-700 transition-colors cursor-pointer">
              {isFree ? "Download" : "Beli"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
