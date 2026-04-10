import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeContext";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const [hovering, setHovering] = useState<"none" | "button" | "card">("none");
  const [clicking, setClicking] = useState(false);
  const { mode } = useTheme();
  const [visible, setVisible] = useState(false);

  const accent = mode === "dark" ? "#00e676" : "#8b0000";

  useEffect(() => {
    // Check if device has fine pointer (not touch)
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
      if (!visible) setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("button, a, [role='button']")) setHovering("button");
      else if (t.closest("[data-cursor='card']")) setHovering("card");
      else setHovering("none");
    };

    const onDown = () => setClicking(true);
    const onUp = () => setTimeout(() => setClicking(false), 200);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    // Ring lerp
    let raf: number;
    const lerp = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }
      raf = requestAnimationFrame(lerp);
    };
    raf = requestAnimationFrame(lerp);

    // Hide default cursor
    document.body.style.cursor = "none";
    const style = document.createElement("style");
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf);
      document.body.style.cursor = "";
      style.remove();
    };
  }, [visible]);

  if (!visible) return null;

  const ringSize = hovering === "card" ? 64 : hovering === "button" ? 52 : 32;
  const dotHidden = hovering !== "none";

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999]"
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: accent,
          transform: `translate(-50%, -50%) scale(${clicking ? 2 : dotHidden ? 0 : 1})`,
          transition: "transform 0.2s, background 0.3s, opacity 0.2s",
          opacity: dotHidden ? 0 : 1,
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998] flex items-center justify-center"
        style={{
          width: ringSize,
          height: ringSize,
          borderRadius: "50%",
          border: `2px solid ${accent}`,
          background: hovering !== "none" ? `${accent}26` : "transparent",
          transform: "translate(-50%, -50%)",
          transition: "width 0.3s, height 0.3s, background 0.3s, border-color 0.3s",
        }}
      >
        {hovering === "card" && (
          <span style={{ fontSize: 12, fontWeight: 700, color: accent }}>VIEW</span>
        )}
      </div>
    </>
  );
}
