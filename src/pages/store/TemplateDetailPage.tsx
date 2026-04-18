import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, ShoppingCart, Tag, ImageOff } from "lucide-react";
import { CheckoutModal } from "../../app/components/store/CheckoutModal";
import { apiFetch } from "../../lib/apiClient";
import TemplatePage from "../../app/pages/store/TemplatePage";
import RecommendedProducts from "../../app/components/cardRender/rekomendasi";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";

function cloudinaryUrl(publicId: string, w = 800, h = 560) {
  if (!publicId) return "";
  if (publicId.startsWith("http")) return publicId;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,w_${w},h_${h}/${publicId}`;
}

/** Image with pan-on-hover (mouse tracking) */
function PanImage({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("translate(0%, 0%) scale(1)");
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 2;  // -1 to +1
    const y = ((e.clientY - top) / height - 0.5) * 2;  // -1 to +1
    const panX = -x * 6;  // percentage shift
    const panY = -y * 6;
    setTransform(`translate(${panX}%, ${panY}%) scale(1.08)`);
  };

  const handleMouseLeave = () => {
    setTransform("translate(0%, 0%) scale(1)");
    setIsHovering(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl bg-[#1e1b4b]"
      style={{ aspectRatio: "16/10", cursor: isHovering ? "zoom-in" : "default" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform,
            transition: isHovering ? "transform 0.1s linear" : "transform 0.4s ease",
            willChange: "transform",
          }}
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageOff size={40} className="text-white/20" />
        </div>
      )}

      {/* Subtle vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.3)" }}
      />
    </div>
  );
}

export default function TemplateDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await apiFetch(`${API_URL}/store/products/${slug}`);
        const data = await res.json();
        if (data.success && data.data) {
          setProduct(data.data);
        } else {
          setError("Produk tidak ditemukan.");
        }
      } catch (e) {
        setError("Gagal memuat produk.");
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetch_();
  }, [slug, API_URL]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">{error || "Produk tidak ditemukan."}</p>
        <button
          onClick={() => navigate("/template")}
          className="px-5 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
        >
          Kembali ke Store
        </button>
      </div>
    );
  }

  const { title, description, category, price, finalPrice, discountPct, imageUrls, badge, salesCount } = product;
  const hasDiscount = discountPct > 0;
  const isFree = price === 0;
  const checkoutPrice = finalPrice ?? price;
  const isLongDescription = description && description.length > 200;

  const activeImageSrc = imageUrls.length > 0 ? cloudinaryUrl(imageUrls[activeIndex]) : "";

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg)", transition: "background 0.4s" }}>
      <div className="max-w-[960px] mx-auto px-4 pt-8">
        {/* Back */}
        <button
          onClick={() => navigate("/template")}
          className="flex items-center gap-2 text-sm mb-8 transition-colors hover:text-[#b91c1c]"
          style={{ color: "var(--text2)" }}
        >
          <ArrowLeft size={16} /> Kembali ke Template Store
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ── LEFT: Image Gallery ── */}
          <div className="flex flex-col gap-4">
            {/* Main image with pan-on-hover */}
            <PanImage
              src={activeImageSrc}
              alt={title}
            />

            {/* Thumbnails */}
            {imageUrls.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {imageUrls.map((imgId: string, i: number) => {
                  const thumbSrc = cloudinaryUrl(imgId, 160, 100);
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`w-16 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                        i === activeIndex
                          ? "border-[#b91c1c] ring-1 ring-[#b91c1c]/40"
                          : "border-transparent hover:border-white/30"
                      }`}
                    >
                      <img src={thumbSrc} alt={`thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="flex flex-col gap-5 pt-1">
            {/* Category & Badge */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-[2px] font-bold uppercase text-[#b91c1c]">
                {category}
              </span>
              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                badge === "Free" ? "bg-[#d1fae5] text-[#065f46]" : "bg-[#fef3c7] text-[#92400e]"
              }`}>
                {badge}
              </span>
              {hasDiscount && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#b91c1c] text-white">
                  -{discountPct}% OFF
                </span>
              )}
              <div className="ml-auto flex items-center gap-1 opacity-80" style={{ color: "var(--text2)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <span className="text-[11px] font-medium">{salesCount || 0} Terjual</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-black leading-tight" style={{ color: "var(--text1)" }}>
              {title}
            </h1>

            {/* Price */}
            <div className="flex flex-col gap-1">
              {hasDiscount ? (
                <>
                  <span
                    className="text-base line-through opacity-50"
                    style={{ color: "var(--text2)" }}
                  >
                    Rp {price.toLocaleString("id-ID")}
                  </span>
                  <span className="text-3xl font-black text-[#b91c1c]">
                    Rp {checkoutPrice.toLocaleString("id-ID")}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Tag size={13} className="text-[#b91c1c]" />
                    <span className="text-xs text-[#b91c1c] font-semibold">
                      Hemat Rp {(price - checkoutPrice).toLocaleString("id-ID")}
                    </span>
                  </div>
                </>
              ) : (
                <span className={`text-3xl font-black ${isFree ? "text-[#059669]" : ""}`} style={!isFree ? { color: "var(--text1)" } : {}}>
                  {isFree ? "Gratis" : `Rp ${price.toLocaleString("id-ID")}`}
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: "color-mix(in srgb, var(--text2) 15%, transparent)" }} />

            {/* Description */}
            {description && (
              <div className="flex flex-col">
                <div 
                  className={`text-sm leading-7 whitespace-pre-wrap relative overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[2000px]' : 'max-h-[160px]'} [&_p]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-[var(--text1)] [&_h2]:mt-4 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold [&_em]:italic [&_a]:text-[#b91c1c] [&_a]:underline`} 
                  style={{ color: "var(--text2)" }}
                >
                  <div dangerouslySetInnerHTML={{ __html: description }} />
                  {!isExpanded && isLongDescription && (
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-16" 
                      style={{ background: "linear-gradient(to top, var(--bg) 0%, transparent 100%)" }}
                    />
                  )}
                </div>
                {isLongDescription && (
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="self-start mt-2 text-sm font-semibold text-[#b91c1c] hover:underline cursor-pointer"
                  >
                    {isExpanded ? "Tutup kembali" : "Lihat semua"}
                  </button>
                )}
              </div>
            )}

            {/* Buy button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-auto flex items-center justify-center gap-2 w-full py-4 bg-[#b91c1c] hover:bg-red-700 text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5"
            >
              <ShoppingCart size={18} />
              {isFree ? "Download Gratis" : "Beli Sekarang"}
            </button>

            {/* <p className="text-center text-xs" style={{ color: "var(--text2)" }}>
              Produk digital — file dikirim setelah pembayaran dikonfirmasi
            </p> */}
          </div>
        </div>

        {/* Rekomendasi — full width, di luar grid 2-kolom */}
        <RecommendedProducts currentId={product?.id} />
      </div>

      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        template={product ? { id: product.id, title: product.title, price: checkoutPrice } : null}
      />
    </div>
  );
}
