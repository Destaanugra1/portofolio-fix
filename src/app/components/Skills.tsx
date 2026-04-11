import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useTheme } from "./ThemeContext";
import type { TechItem, GroupConfig } from "../../types/tech";

// Data
const LEFT_GROUPS: GroupConfig[] = [
  {
    id: "backend",
    label: "Backend",
    color: "#3b82f6",
    items: [
      { id: "python", name: "Python", desc: "Core Logic", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { id: "fastapi", name: "FastAPI", desc: "API Framework", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
      { id: "firebase", name: "Firebase", desc: "BaaS & Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
      { id: "nodejs", name: "Node.js", desc: "Runtime Environment", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    ]
  },
  {
    id: "api",
    label: "API",
    color: "#22c55e",
    items: [
      { id: "graphql", name: "GraphQL", desc: "Query Language", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
    ]
  },
  {
    id: "frontend",
    label: "Frontend",
    color: "#f0c070",
    items: [
      { id: "react", name: "React", desc: "UI Library", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { id: "vue", name: "Vue.js", desc: "Progressive Framework", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
    ]
  },
  {
    id: "language",
    label: "Language",
    color: "#f97316",
    items: [
      { id: "javascript", name: "JavaScript", desc: "Web Scripting", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { id: "typescript", name: "TypeScript", desc: "Type-safe JS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    ]
  },
  {
    id: "styling",
    label: "Styling",
    color: "#e879f9",
    items: [
      { id: "html", name: "HTML5", desc: "Markup", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
      { id: "css", name: "CSS3", desc: "Styling", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
      { id: "tailwind", name: "Tailwind CSS", desc: "Utility-first CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
    ]
  }
];

const RIGHT_TOOLS: TechItem[] = [
  { id: "docker", name: "Docker", desc: "Containerization", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", color: "#2496ED" },
  { id: "flutter", name: "Flutter", desc: "Cross-platform Mobile", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg", color: "#02569B" },
  { id: "git", name: "Git", desc: "Version Control", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", color: "#F05032" },
  { id: "kubernetes", name: "Kubernetes", desc: "Orchestration", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg", color: "#326CE5" },
  { id: "vscode", name: "VS Code", desc: "Code Editor", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg", color: "#007ACC" },
  { id: "postman", name: "Postman", desc: "API Testing", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg", color: "#FF6C37" },
  { id: "figma", name: "Figma", desc: "UI/UX Design", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", color: "#F24E1E" },
];

export function Skills() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Element position tracking
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const centerNodeRef = useRef<HTMLDivElement>(null);
  
  // Interaction State
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoveredIdRef = useRef<string | null>(null);

  // Scroll Glow State
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "center center"]
  });
  const scrollRatioRef = useRef<number>(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    scrollRatioRef.current = latest;
  });

  // scroll glow bounds
  const [tooltip, setTooltip] = useState<{ show: boolean; x: number; y: number; title: string; desc: string; color: string }>({ show: false, x: 0, y: 0, title: "", desc: "", color: "#fff" });

  const { mode } = useTheme();
  const themeModeRef = useRef(mode);

  useEffect(() => {
    themeModeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    hoveredIdRef.current = hoveredId;
  }, [hoveredId]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    
    // Cached positions to prevent getBoundingClientRect layout thrashing every frame
    const posCache = {
      center: { x: 0, y: 0 },
      items: new Map<string, { x: number, y: number }>()
    };

    const getCenterPos = (el: HTMLElement, containerRect: DOMRect) => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2
      };
    };

    const cachePositions = () => {
      if (!containerRef.current) return;
      const cRect = containerRef.current.getBoundingClientRect();
      
      if (centerNodeRef.current) {
        posCache.center = getCenterPos(centerNodeRef.current, cRect);
      }
      
      itemRefs.current.forEach((el, id) => {
        posCache.items.set(id, getCenterPos(el, cRect));
      });
    };

    const resizeCanvas = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
      
      // Update cache whenever layout size changes
      cachePositions();
    };

    // Give react time to render DOM nodes before first cache
    setTimeout(() => resizeCanvas(), 100);
    window.addEventListener("resize", resizeCanvas);

    const drawPaths = () => {
      const isDark = themeModeRef.current === 'dark';

      // Adaptive Background clearing (transparent to allow theme background)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const drawBezier = (startX: number, startY: number, endX: number, endY: number, color: string, isActive: boolean, isFaded: boolean) => {
        const distX = Math.abs(endX - startX);
        const distY = Math.abs(endY - startY);
        
        // Use wave physics
        const wave = Math.sin(time + (startY * 0.01)) * 30;
        const waveE = isActive ? wave : wave * 0.5;

        // Adaptive Bezier Control Points based on mobile vs desktop layout
        let cp1x, cp1y, cp2x, cp2y;
        if (window.innerWidth < 768) {
          // Mobile: Vertical curve hierarchy
          cp1x = startX + waveE;
          cp1y = startY + distY * 0.4 * Math.sign(endY - startY);
          cp2x = endX - waveE;
          cp2y = endY - distY * 0.4 * Math.sign(endY - startY);
        } else {
          // Desktop: Horizontal curve hierarchy
          cp1x = startX + distX * 0.4 * Math.sign(endX - startX);
          cp1y = startY + waveE;
          cp2x = endX - distX * 0.4 * Math.sign(endX - startX);
          cp2y = endY - waveE;
        }

        const buildPath = () => {
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        };

        const scrollFactor = scrollRatioRef.current;
        // In light mode, drawing prominent thin lines is better than washed out alpha
        const baseAlpha = isFaded ? (isDark ? 0.05 : 0.08) : (isActive ? 1.0 : (isDark ? 0.35 : 0.6));
        const finalAlpha = isActive ? baseAlpha : (baseAlpha * (0.2 + scrollFactor * 0.8));

        // High Performance Glow
        if (isActive && scrollFactor > 0.1) {
          buildPath();
          ctx.lineWidth = 10 * scrollFactor;
          ctx.strokeStyle = color;
          ctx.globalAlpha = (isDark ? 0.15 : 0.25) * scrollFactor;
          ctx.stroke(); 
        }

        buildPath();
        ctx.lineWidth = isActive ? 2.5 : 1.5;
        ctx.strokeStyle = color;
        ctx.globalAlpha = finalAlpha;
        ctx.stroke();

        ctx.globalAlpha = 1.0;
        
        if (isActive) {
          const t = (time * 1.5) % 1; 
          const cx = 3 * (cp1x - startX);
          const bx = 3 * (cp2x - cp1x) - cx;
          const ax = endX - startX - cx - bx;
          
          const cy = 3 * (cp1y - startY);
          const by = 3 * (cp2y - cp1y) - cy;
          const ay = endY - startY - cy - by;
          
          const px = (ax * Math.pow(t, 3)) + (bx * Math.pow(t, 2)) + (cx * t) + startX;
          const py = (ay * Math.pow(t, 3)) + (by * Math.pow(t, 2)) + (cy * t) + startY;
          
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? "#fff" : color;
          ctx.fill();
        }
      };

      const hId = hoveredIdRef.current;
      const cPos = posCache.center;
      
      if (cPos.x === 0 && cPos.y === 0) return; // Not yet initialized

      LEFT_GROUPS.forEach(group => {
        const isGroupHovered = hId ? LEFT_GROUPS.find(g => g.items.some(i => i.id === hId))?.id === group.id : false;
        
        group.items.forEach(item => {
          const startPos = posCache.items.get(item.id);
          if (startPos) {
            const isItemHovered = hId === item.id;
            const isFaded = hId !== null && !isGroupHovered;
            drawBezier(startPos.x, startPos.y, cPos.x, cPos.y, group.color, isItemHovered || isGroupHovered, isFaded);
          }
        });
      });

      RIGHT_TOOLS.forEach(item => {
        const endPos = posCache.items.get(item.id);
        if (endPos) {
          const isItemHovered = hId === item.id;
          const isFaded = hId !== null && !isItemHovered;
          drawBezier(cPos.x, cPos.y, endPos.x, endPos.y, item.color || "#64748b", isItemHovered, isFaded);
        }
      });
    };

    const renderLoop = () => {
      time += 0.015;
      drawPaths();
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseEnter = (e: React.MouseEvent, item: TechItem, color: string) => {
    setHoveredId(item.id);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (containerRef.current) {
        const cRect = containerRef.current.getBoundingClientRect();
        setTooltip({
          show: true,
          x: rect.left - cRect.left + rect.width / 2,
          y: rect.top - cRect.top - 15,
          title: item.name,
          desc: item.desc,
          color: color
        });
    }
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    setTooltip(src => ({ ...src, show: false }));
  };

  // Adaptive Styling Handlers
  const isDarkObj = mode === "dark";

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-[100vh] py-20 flex flex-col items-center overflow-hidden transition-colors duration-500"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "var(--bg)", color: "var(--text1)" }}
    >
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 mix-blend-normal" />

      {/* Header */}
      <div className="z-10 text-center mb-16 relative">
        <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-colors" style={{ color: "var(--text1)" }}>
          Tech Stack & Skills
        </h2>
        <p className="text-sm md:text-base uppercase tracking-[6px] font-bold transition-colors" style={{ color: "var(--text2)" }}>
          WHAT I WORK WITH
        </p>
      </div>

      {/* Main Layout */}
      <div className="w-full max-w-[1200px] flex-1 flex flex-col md:flex-row justify-between items-center px-6 md:px-12 z-10 relative gap-16 md:gap-0 mt-4 md:mt-0">
        
        {/* Left Side */}
        <div className="flex flex-col gap-6 md:gap-8 justify-center items-center md:items-start w-full md:w-auto">
          {LEFT_GROUPS.map((group) => (
            <div key={group.id} className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
              <span className="w-auto md:w-20 text-center md:text-right text-[10px] uppercase tracking-[2px] font-bold opacity-70 transition-colors" style={{ color: "var(--text1)" }}>
                {group.label}
              </span>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {group.items.map(item => {
                  const isHovered = hoveredId === item.id;
                  return (
                    <motion.div
                      key={item.id}
                      ref={(el) => { if (el) itemRefs.current.set(item.id, el); }}
                      onMouseEnter={(e) => handleMouseEnter(e, item, group.color)}
                      onMouseLeave={handleMouseLeave}
                      className="group cursor-pointer flex items-center justify-center w-[40px] h-[40px] md:w-[44px] md:h-[44px] rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: "var(--surface)",
                        border: `1px solid ${isHovered ? group.color : isDarkObj ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`,
                        boxShadow: isHovered ? `0 0 15px ${group.color}40, inset 0 0 10px ${group.color}20` : "none",
                      }}
                      animate={{ scale: isHovered ? 1.15 : 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <img 
                        src={item.icon} 
                        alt={item.name} 
                        className="w-[20px] h-[20px] md:w-[22px] md:h-[22px] object-contain transition-transform" 
                        loading="lazy" 
                      />
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Center Orb */}
        <div ref={centerNodeRef} className="relative flex flex-col items-center justify-center pointer-events-none w-20 h-20 my-10 md:my-0">
          <div className="absolute inset-0 bg-red-600/10 blur-[40px] dark:bg-red-600/20 dark:blur-[50px] rounded-full w-32 h-32 md:w-40 md:h-40 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 transition-colors" />
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-600 animate-pulse z-10" style={{ boxShadow: "0 0 30px 10px rgba(220,38,38,0.6)" }} />
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-4 md:gap-6 justify-center items-center md:items-end w-full md:w-auto">
          <span className="md:hidden text-center text-[10px] uppercase tracking-[2px] font-bold opacity-70 mb-2 transition-colors" style={{ color: "var(--text1)" }}>
            DevOps & Tools
          </span>
          <div className="flex flex-wrap md:flex-col justify-center items-center gap-3 md:gap-4 max-w-[280px] md:max-w-none">
            {RIGHT_TOOLS.map(item => {
              const isHovered = hoveredId === item.id;
              return (
                <div key={item.id} className="flex items-center gap-4 justify-center md:justify-end">
                  <motion.div
                    ref={(el) => { if (el) itemRefs.current.set(item.id, el); }}
                    onMouseEnter={(e) => handleMouseEnter(e, item, item.color || "#fff")}
                    onMouseLeave={handleMouseLeave}
                    className="cursor-pointer flex items-center justify-center w-[40px] h-[40px] md:w-[44px] md:h-[44px] rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: "var(--surface)",
                      border: `1px solid ${isHovered ? (item.color || "#64748b") : isDarkObj ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`,
                      boxShadow: isHovered ? `0 0 15px ${(item.color || "#64748b")}40` : "none",
                    }}
                    animate={{ scale: isHovered ? 1.15 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <img src={item.icon} alt={item.name} className="w-[20px] h-[20px] md:w-[22px] md:h-[22px] object-contain" loading="lazy" />
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip.show && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 pointer-events-none flex flex-col items-center"
            style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
          >
            <div className="shadow-xl px-4 py-2 rounded-lg flex flex-col items-center min-w-[120px] backdrop-blur-md"
                 style={{ backgroundColor: "var(--surface)", border: `1px solid ${isDarkObj ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` }}>
              <span className="font-bold text-[13px] tracking-wide whitespace-nowrap" style={{ color: tooltip.color }}>
                {tooltip.title}
              </span>
              <span className="text-[11px] font-medium whitespace-nowrap mt-0.5" style={{ color: "var(--text2)" }}>
                {tooltip.desc}
              </span>
            </div>
            {/* Arrow */}
            <div className="w-2.5 h-2.5 rotate-45 -mt-[5px]" 
                 style={{ 
                   backgroundColor: "var(--surface)",
                   borderBottom: `1px solid ${isDarkObj ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                   borderRight: `1px solid ${isDarkObj ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`
                 }} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
