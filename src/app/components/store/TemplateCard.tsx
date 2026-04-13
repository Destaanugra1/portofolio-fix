import React from 'react';
import { useNavigate } from 'react-router';

interface TemplateCardProps {
  title: string;
  category: string;
  price: number;
  finalPrice?: number;
  discountPct?: number;
  badge: "Free" | "Pro";
  isNew: boolean;
  bg: string;
  id?: number;
  imageUrl?: string | null;
  salesCount?: number;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  id,
  title,
  category,
  price,
  finalPrice,
  discountPct = 0,
  badge,
  isNew,
  bg,
  imageUrl,
  salesCount = 0,
}) => {
  const navigate = useNavigate();
  const isFree = price === 0;
  const hasDiscount = discountPct > 0;
  const displayPrice = finalPrice ?? price;

  return (
    <div
      className="border border-border rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow cursor-pointer group"
      style={{ background: "var(--surface)", borderColor: "color-mix(in srgb, var(--text2) 20%, transparent)" }}
      onClick={() => id && navigate(`/template/${id}`)}
    >
      {/* Top Image area */}
      <div
        className="h-[140px] relative flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: bg }}
      >
        {isNew && (
          <div className="absolute top-2 right-2 bg-[#b91c1c] text-white text-[9px] font-medium px-2 py-0.5 rounded-full z-10">
            New
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-[#b91c1c] text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10">
            -{discountPct}%
          </div>
        )}
        <div className={`absolute top-2 left-2 text-[9px] font-medium px-2 py-0.5 rounded-full z-10 ${
          badge === 'Free' ? 'bg-[#d1fae5] text-[#065f46]' : 'bg-[#fef3c7] text-[#92400e]'
        }`}>
          {badge}
        </div>

        {imageUrl ? (
          <img
            src={`https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_400,h_280/${imageUrl}`}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-[75%] aspect-[16/9] bg-black/20 border border-white/10 rounded overflow-hidden flex items-center justify-center">
            <span className="text-white/20 text-xs font-medium">Preview</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div className="mb-3">
          <span className="text-[9px] tracking-[1.5px] text-[#b91c1c] font-bold uppercase mb-1 block">
            {category}
          </span>
          <h3 className="text-[13px] font-medium mb-1 line-clamp-1" style={{ color: "var(--text1)", transition: "color 0.4s" }}>
            {title}
          </h3>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span className="text-[10px] font-medium opacity-70" style={{ color: "var(--text2)" }}>
              {salesCount} Terjual
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-[11px] line-through opacity-50" style={{ color: "var(--text2)" }}>
                  Rp {price.toLocaleString("id-ID")}
                </span>
                <span className="text-[14px] font-bold text-[#b91c1c]">
                  Rp {displayPrice.toLocaleString("id-ID")}
                </span>
              </>
            ) : (
              <span className={`text-[14px] font-medium ${isFree ? 'text-[#059669]' : ''}`} style={!isFree ? { color: "var(--text1)", transition: "color 0.4s" } : {}}>
                {isFree ? "Gratis" : `Rp ${price.toLocaleString("id-ID")}`}
              </span>
            )}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); id && navigate(`/template/${id}`); }}
            className="px-[10px] py-[4px] border rounded-[6px] text-[10px] font-medium cursor-pointer hover:bg-black/5 transition-all"
            style={{ color: "var(--text1)", borderColor: "color-mix(in srgb, var(--text2) 30%, transparent)" }}
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
};
