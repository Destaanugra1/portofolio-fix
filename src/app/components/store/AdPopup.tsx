import React, { useEffect, useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { useLocation } from 'react-router';

type AdPopupData = {
  id: number;
  type: 'ad';
  title: string;
  message: string | null;
  imageUrl: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  showOnDev?: boolean;
};

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const SESSION_KEY = "xenon_ad_popup_dismissed";

function cloudinaryUrl(publicId: string) {
  if (!publicId) return "";
  if (publicId.startsWith("http")) return publicId;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,w_1200,h_675/${publicId}`;
}

export function AdPopup() {
  const [popup, setPopup] = useState<AdPopupData | null>(null);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const fetchPopup = async () => {
      try {
        const res = await fetch(`${API_URL}/store/popup?path=${encodeURIComponent(location.pathname)}`);
        const data = await res.json();
        if (data.success && data.data?.ad) {
          const adData = data.data.ad;
          
          // Check for localhost / dev mode
          const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
          if (isLocalhost && !adData.showOnDev) {
            return; // skip showing
          }

          setPopup(adData);
          // Delay appearance by 1.5s
          setTimeout(() => {
            setAnimating(true);
            setTimeout(() => setVisible(true), 50);
          }, 1500);
        }
      } catch (err) {
        console.error("AdPopup fetch error:", err);
      }
    };

    fetchPopup();
  }, [location.pathname]);

  const handleClose = () => {
    setVisible(false);
    sessionStorage.setItem(SESSION_KEY, "1");
    setTimeout(() => {
      setAnimating(false);
      setPopup(null);
    }, 400);
  };

  if (!popup || !animating) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{
        background: visible ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(4px)" : "none",
        transition: "background 0.4s ease, backdrop-filter 0.4s ease",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.92) translateY(20px)",
          transition: "opacity 0.4s cubic-bezier(0.34,1.56,0.64,1), transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          maxWidth: "840px",
          width: "100%",
        }}
      >
        {/* Card */}
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: "var(--surface)",
            border: "1px solid color-mix(in srgb, var(--text2) 15%, transparent)",
          }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/80 transition-all"
          >
            <X size={20} />
          </button>

          {/* Image */}
          {popup.imageUrl && (
            <div className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden relative">
              <img
                src={cloudinaryUrl(popup.imageUrl)}
                alt={popup.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to bottom, transparent 50%, var(--surface) 100%)",
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className={`px-6 pb-6 md:px-10 md:pb-10 ${popup.imageUrl ? "pt-4 md:pt-6" : "pt-10"}`}>
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 text-[10px] md:text-sm font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-[#b91c1c]/15 text-[#b91c1c] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b91c1c] animate-pulse inline-block" />
              Promo Spesial
            </span>

            {/* Title */}
            <h2
              className="text-2xl md:text-4xl font-black leading-tight mb-3 md:mb-5"
              style={{ color: "var(--text1)" }}
            >
              {popup.title}
            </h2>

            {/* Message */}
            {popup.message && (
              <p className="text-sm md:text-lg leading-relaxed mb-6 md:mb-8" style={{ color: "var(--text2)" }}>
                {popup.message}
              </p>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              {popup.buttonText && popup.buttonUrl && (
                <a
                  href={popup.buttonUrl}
                  target={popup.buttonUrl.startsWith("http") ? "_blank" : "_self"}
                  rel="noreferrer"
                  onClick={handleClose}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#b91c1c] hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5"
                >
                  {popup.buttonText}
                  <ExternalLink size={14} />
                </a>
              )}
              <button
                onClick={handleClose}
                className={`${popup.buttonText ? "flex-shrink-0 px-4" : "flex-1"} py-3 rounded-xl font-semibold text-sm transition-colors border`}
                style={{
                  borderColor: "color-mix(in srgb, var(--text2) 25%, transparent)",
                  color: "var(--text2)",
                }}
              >
                {popup.buttonText ? "Tutup" : "Mengerti"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
