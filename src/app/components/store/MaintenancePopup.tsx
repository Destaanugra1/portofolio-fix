import React, { useEffect, useState } from 'react';

type MaintenanceData = {
  id: number;
  type: 'maintenance';
  title: string;
  message: string | null;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export function MaintenancePopup() {
  const [popup, setPopup] = useState<MaintenanceData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        const res = await fetch(`${API_URL}/store/popup`);
        const data = await res.json();
        if (data.success && data.data?.maintenance) {
          setPopup(data.data.maintenance);
          setTimeout(() => setVisible(true), 50);
        }
      } catch (err) {
        console.error("MaintenancePopup fetch error:", err);
      }
    };
    fetchPopup();
  }, []);

  // Lock body scroll when maintenance is active
  useEffect(() => {
    if (popup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [popup]);

  if (!popup) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center px-4"
      style={{
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          width: "100%",
          transform: visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
          transition: "transform 0.6s cubic-bezier(0.34,1.56,0.64,1)",
          textAlign: "center",
        }}
      >
        {/* Animated Gear/Wrench Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Outer rotating ring */}
            <div
              className="w-24 h-24 rounded-full border-4 border-dashed border-orange-400/40 animate-spin"
              style={{ animationDuration: "8s" }}
            />
            {/* Inner icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-orange-400/15 flex items-center justify-center border border-orange-400/30">
                <svg
                  className="text-orange-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
            </div>
            {/* Orbiting dot */}
            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: "3s" }}
            >
              <div className="w-3 h-3 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.8)] absolute -top-1.5 left-1/2 -translate-x-1/2" />
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-orange-400 bg-orange-400/10 border border-orange-400/20 px-4 py-1.5 rounded-full mb-5">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse inline-block" />
          Maintenance Mode
        </div>

        {/* Title */}
        <h1
          className="text-3xl font-black mb-3 leading-tight"
          style={{ color: "white" }}
        >
          {popup.title}
        </h1>

        {/* Message */}
        {popup.message && (
          <p
            className="text-base leading-relaxed mb-8 mx-auto"
            style={{ color: "rgba(255,255,255,0.6)", maxWidth: "320px" }}
          >
            {popup.message}
          </p>
        )}

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
          <span className="text-white/30 text-xs font-mono">• • •</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </div>

        {/* Progress bar (decorative infinite) */}
        <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-300"
            style={{
              width: "40%",
              animation: "maintenance-progress 2.5s ease-in-out infinite alternate",
            }}
          />
        </div>

        <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.3)" }}>
          Mohon tunggu — kami sedang bekerja keras untuk Anda
        </p>
      </div>

      {/* Inline animation keyframe */}
      <style>{`
        @keyframes maintenance-progress {
          from { margin-left: 0%; }
          to { margin-left: 60%; }
        }
      `}</style>
    </div>
  );
}
