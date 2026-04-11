import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeContext";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ringDashRef = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const trailPos = useRef(Array.from({length: 8}, () => ({ x: 0, y: 0 })));
  const hoveringRef = useRef<"none"|"button"|"card">("none");
  const angleRef = useRef(0);
  const [hovering, setHovering] = useState<"none"|"button"|"card">("none");
  const [visible, setVisible] = useState(false);
  const { mode } = useTheme();

  const accent = mode === "dark" ? "#c0392b" : "#8b0000";
  const accentGlow = mode === "dark" ? "rgba(192,57,43,0.15)" : "rgba(139,0,0,0.1)";

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

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
      let next: "none"|"button"|"card" = "none";
      if (t.closest("button, a, [role='button']")) next = "button";
      else if (t.closest("[data-cursor='card']")) next = "card";
      hoveringRef.current = next;
      setHovering(next);
      updateRing(next);
    };

    const onDown = () => {
      if (!dotRef.current) return;
      dotRef.current.style.transform = "translate(-50%,-50%) scale(3)";
      dotRef.current.style.opacity = "0.4";
    };
    const onUp = () => {
      setTimeout(() => {
        if (!dotRef.current) return;
        dotRef.current.style.transform = "translate(-50%,-50%) scale(1)";
        dotRef.current.style.opacity = hoveringRef.current !== "none" ? "0" : "1";
      }, 150);
    };

    const updateRing = (h: "none"|"button"|"card") => {
      const r = ringRef.current;
      const d = ringDashRef.current;
      const ri = ringInnerRef.current;
      const dot = dotRef.current;
      if (!r || !d || !ri || !dot) return;

      if (h === "card") {
        r.style.width = "68px"; r.style.height = "68px";
        r.style.background = accentGlow;
        r.style.borderColor = accent;
        d.style.opacity = "1";
        ri.innerHTML = `<span style="font-size:10px;font-weight:700;color:${accent};letter-spacing:2px">VIEW</span>`;
        dot.style.opacity = "0";
      } else if (h === "button") {
        r.style.width = "52px"; r.style.height = "52px";
        r.style.background = "rgba(192,57,43,0.08)";
        r.style.borderColor = "rgba(192,57,43,0.6)";
        d.style.opacity = "0";
        ri.innerHTML = "";
        dot.style.opacity = "0";
      } else {
        r.style.width = "32px"; r.style.height = "32px";
        r.style.background = "transparent";
        r.style.borderColor = accent;
        d.style.opacity = "0";
        ri.innerHTML = "";
        dot.style.opacity = "1";
      }
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    let raf: number;
    const tick = () => {
      ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.12);
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }

      angleRef.current += hoveringRef.current === "card" ? 1.2 : 0.4;
      if (ringDashRef.current) {
        ringDashRef.current.style.transform = `rotate(${angleRef.current}deg)`;
      }

      const TRAIL = 8;
      for (let i = 0; i < TRAIL; i++) {
        const target = i === 0 ? mouse.current : trailPos.current[i - 1];
        trailPos.current[i].x = lerp(trailPos.current[i].x, target.x, 0.35 - i * 0.025);
        trailPos.current[i].y = lerp(trailPos.current[i].y, target.y, 0.35 - i * 0.025);
        const el = trailRefs.current[i];
        if (el) {
          el.style.left = `${trailPos.current[i].x}px`;
          el.style.top = `${trailPos.current[i].y}px`;
          el.style.opacity = hoveringRef.current !== "none"
            ? "0"
            : String((1 - i / TRAIL) * 0.45);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

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
  }, [accent, accentGlow]);

  if (!visible) return null;

  const TRAIL = 8;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999]"
        style={{
          width: 8, height: 8,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 0 6px 2px rgba(255,255,255,0.5)",
          transform: "translate(-50%,-50%)",
          transition: "transform 0.15s, opacity 0.2s",
        }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998]"
        style={{
          width: 32, height: 32,
          borderRadius: "50%",
          border: `1.5px solid ${accent}`,
          transform: "translate(-50%,-50%)",
          transition: "width 0.35s cubic-bezier(.23,1,.32,1), height 0.35s cubic-bezier(.23,1,.32,1), background 0.3s, border-color 0.3s",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "fixed",
        }}
      >
        {/* Rotating dashed ring */}
        <div
          ref={ringDashRef}
          style={{
            position: "absolute", inset: -4,
            borderRadius: "50%",
            border: "1px dashed rgba(192,57,43,0.5)",
            opacity: 0,
            transition: "opacity 0.3s",
          }}
        />
        {/* Inner label */}
        <div ref={ringInnerRef} style={{ position: "absolute", inset: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }} />
      </div>

      {/* Trail dots */}
      {Array.from({ length: TRAIL }).map((_, i) => {
        const size = 4 - i * 0.35;
        return (
          <div
            key={i}
            ref={el => { if (el) trailRefs.current[i] = el; }}
            className="fixed pointer-events-none z-[9997]"
            style={{
              width: size, height: size,
              borderRadius: "50%",
              background: accent,
              transform: "translate(-50%,-50%)",
              transition: "opacity 0.2s",
            }}
          />
        );
      })}
    </>
  );
}