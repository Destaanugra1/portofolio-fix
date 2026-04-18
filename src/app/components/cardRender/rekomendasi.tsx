import React, { useMemo } from "react";
import { useNavigate } from "react-router";
import { useStoreGlobally } from "../../components/store/StoreContext";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";

function cloudinaryUrl(publicId: string) {
  if (!publicId) return "";
  if (publicId.startsWith("http")) return publicId;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,w_600,h_420/${publicId}`;
}

interface Props {
  currentId?: string | number;
}

const RecommendedProducts = ({ currentId }: Props) => {
  const { templates, loading } = useStoreGlobally();
  const navigate = useNavigate();

  const randomProducts = useMemo(() => {
    const filtered = templates.filter((item) => item.id !== currentId);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, [templates, currentId]);

  if (loading || randomProducts.length === 0) return null;

  return (
    <section className="mt-16 mb-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p
            className="text-[10px] uppercase tracking-[3px] font-bold mb-1"
            style={{ color: "var(--text2)" }}
          >
            Pilihan Untuk Kamu
          </p>
          <h2
            className="text-xl font-black"
            style={{ color: "var(--text1)" }}
          >
            Produk Rekomendasi
          </h2>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {randomProducts.slice(0, 4).map((item, index) => {
          const isFree = item.price === 0;
          const hasDiscount = (item.discountPct ?? 0) > 0;
          const displayPrice = item.finalPrice ?? item.price;
          const imageId = item.imageUrls?.[0] ?? item.imageUrl ?? null;
          const imageSrc = imageId ? cloudinaryUrl(imageId) : null;

          return (
            <div
              key={item.id}
              onClick={() => navigate(`/template/${item.slug || item.id}`)}
              className="group relative flex flex-col overflow-hidden rounded-2xl cursor-pointer"
              style={{
                background: "var(--surface)",
                border: "1px solid color-mix(in srgb, var(--text2) 15%, transparent)",
                transition: "all 0.3s ease",
              }}
            >
              {/* Image Container */}
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "16/10", backgroundColor: item.bg || "#1e1b4b" }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-[#b91c1c]/10 to-transparent z-[1] pointer-events-none" />

                {/* Ranking badge */}
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-white border border-white/10">
                  #{index + 1}
                </div>

                {/* Free / Pro badge */}
                <div
                  className={`absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                    item.badge === "Free"
                      ? "bg-[#d1fae5] text-[#065f46]"
                      : "bg-[#fef3c7] text-[#92400e]"
                  }`}
                >
                  {item.badge}
                </div>

                {/* Discount badge */}
                {hasDiscount && (
                  <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#b91c1c] text-white">
                    -{item.discountPct}% OFF
                  </div>
                )}

                {/* Image */}
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white/20 text-xs font-medium">Preview</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="flex flex-col flex-1 p-3 gap-2">
                {/* Category */}
                <span className="text-[9px] tracking-[1.5px] font-bold uppercase text-[#b91c1c]">
                  {item.category}
                </span>

                {/* Title */}
                <h3
                  className="text-[12px] sm:text-[13px] font-semibold leading-tight line-clamp-2"
                  style={{ color: "var(--text1)" }}
                >
                  {item.title}
                </h3>

                {/* Price + CTA */}
                <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: "1px solid color-mix(in srgb, var(--text2) 10%, transparent)" }}>
                  <div className="flex flex-col">
                    {hasDiscount ? (
                      <>
                        <span className="text-[10px] line-through opacity-40" style={{ color: "var(--text2)" }}>
                          Rp {item.price.toLocaleString("id-ID")}
                        </span>
                        <span className="text-[13px] font-black text-[#b91c1c]">
                          Rp {displayPrice.toLocaleString("id-ID")}
                        </span>
                      </>
                    ) : (
                      <span
                        className={`text-[13px] font-bold ${isFree ? "text-[#059669]" : ""}`}
                        style={!isFree ? { color: "var(--text1)" } : {}}
                      >
                        {isFree ? "Gratis" : `Rp ${item.price.toLocaleString("id-ID")}`}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/template/${item.slug || item.id}`);
                    }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-white bg-[#b91c1c] hover:bg-red-700 transition-all whitespace-nowrap"
                  >
                    Lihat →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: Lihat semua */}
      <div className="mt-5 text-center sm:hidden">
        <button
          onClick={() => navigate("/template")}
          className="text-sm font-semibold text-[#b91c1c] hover:underline"
        >
          Lihat Semua Produk
        </button>
      </div>
    </section>
  );
};

export default RecommendedProducts;