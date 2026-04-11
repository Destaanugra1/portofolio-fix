import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const filters = ["All", "UI & UX Design", "Branding", "Graphic Design"];
const projects = [
  { 
    img: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=1080", 
    title: "Mobile App Redesign", 
    cat: "UI & UX Design", 
    tools: ["Figma", "Prototyping", "User Research"], 
    desc: "A complete overhaul of a legacy mobile application focusing on user experience, modern visual aesthetics, and streamlined core workflows." 
  },
  { 
    img: "https://images.unsplash.com/photo-1634084462412-b54873c0a56d?auto=format&fit=crop&q=80&w=1080", 
    title: "3D Brand Identity", 
    cat: "Branding", 
    tools: ["Blender", "Cinema 4D", "Illustrator"], 
    desc: "Exploration of three-dimensional primitive shapes to create a futuristic and bold brand identity for a tech startup." 
  },
  { 
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1080", 
    title: "Lifestyle Photography", 
    cat: "Graphic Design", 
    tools: ["Photography", "Lightroom", "Photoshop"], 
    desc: "A series of lifestyle shots capturing modern workspaces and technology setups for professional editorial use." 
  },
  { 
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1080", 
    title: "Editorial Poster", 
    cat: "Graphic Design", 
    tools: ["InDesign", "Typography", "Illustrator"], 
    desc: "Bold and expressive typographical poster designed for an art convention, combining vibrant neon colors with brutalist layout principles." 
  },
  { 
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1080", 
    title: "Dashboard UI", 
    cat: "UI & UX Design", 
    tools: ["Figma", "Design System", "Data Viz"], 
    desc: "An enterprise analytics dashboard designed to visualize complex datasets with clarity, featuring customizable widgets and dark mode support." 
  },
  { 
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1080", 
    title: "Logo System", 
    cat: "Branding", 
    tools: ["Illustrator", "Sketching", "Vector Art"], 
    desc: "A minimal and highly adaptable logo system created for a sustainable fashion brand, emphasizing simplicity and organic shapes." 
  },
];

const ITEMS_PER_PAGE = 4;

export function Portfolio() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filtered = activeFilter === "All" ? projects : projects.filter((p) => p.cat === activeFilter);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginated = filtered.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(0);
  }, [activeFilter]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedProject]);

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <section id="portfolio" className="py-24" style={{ background: "var(--bg)", transition: "background 0.4s" }}>
      <div ref={ref} className="max-w-[1280px] mx-auto px-6">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
          <motion.h2
            style={{ color: "var(--accent)", fontSize: 32, fontWeight: 700, transition: "color 0.4s", margin: 0 }}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Portfolio
          </motion.h2>

          {/* Filters + Pagination */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex flex-wrap gap-2 items-center">
              {filters.map((f) => {
                const isActive = activeFilter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 pointer-events-auto cursor-pointer"
                    style={{
                      background: isActive ? "var(--accent)" : "transparent",
                      color: isActive ? "#ffffff" : "var(--text1)",
                      border: "1px solid",
                      borderColor: isActive ? "var(--accent)" : "color-mix(in srgb, var(--text2) 30%, transparent)",
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 ml-0 md:ml-4">
              <span style={{ color: "var(--text2)", fontSize: 14, minWidth: 40, textAlign: "center", fontWeight: 500 }}>
                {page + 1}/{totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={!canPrev}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: "transparent",
                    border: "1px solid",
                    borderColor: canPrev ? "var(--accent)" : "color-mix(in srgb, var(--text2) 30%, transparent)",
                    color: canPrev ? "var(--accent)" : "var(--text2)",
                    opacity: canPrev ? 1 : 0.4,
                    cursor: canPrev ? "pointer" : "not-allowed",
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={!canNext}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: "transparent",
                    border: "1px solid",
                    borderColor: canNext ? "var(--accent)" : "color-mix(in srgb, var(--text2) 30%, transparent)",
                    color: canNext ? "var(--accent)" : "var(--text2)",
                    opacity: canNext ? 1 : 0.4,
                    cursor: canNext ? "pointer" : "not-allowed",
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {paginated.map((p, i) => (
              <motion.div
                key={p.title}
                layout
                className="relative group cursor-pointer h-[210px] rounded-2xl overflow-hidden shadow-sm"
                style={{ background: "var(--surface)" }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => setSelectedProject(p)}
              >
                <ImageWithFallback src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                
                {/* Dark Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                   <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300" style={{ borderColor: "var(--accent)" }}>
                      <span className="text-white text-xs font-bold tracking-widest">VIEW</span>
                   </div>
                </div>

                {/* Bottom Overlay bg gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
                
                {/* Always visible text on the card */}
                <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col justify-end z-20 pointer-events-none">
                  <span className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "var(--accent)" }}>
                    {p.cat}
                  </span>
                  <h3 className="text-white text-lg font-bold leading-tight">
                    {p.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        {totalPages > 1 && (
           <div className="flex justify-center gap-2 mt-8">
             {Array.from({ length: totalPages }).map((_, i) => {
               const isActive = i === page;
               return (
                 <button
                   key={i}
                   onClick={() => setPage(i)}
                   className="h-2 rounded-full transition-all duration-300"
                   style={{
                     width: isActive ? 24 : 8,
                     background: isActive ? "var(--accent)" : "color-mix(in srgb, var(--text2) 30%, transparent)",
                     border: "none",
                     cursor: "pointer",
                     padding: 0,
                   }}
                   aria-label={`Go to page ${i + 1}`}
                 />
               );
             })}
           </div>
        )}
      </div>

      {/* Popup Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ background: "transparent" }}>
            <motion.div 
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.85)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
            />
            
            <motion.div 
              className="relative w-full max-w-[860px] max-h-[90vh] overflow-y-auto rounded-2xl flex flex-col md:flex-row shadow-2xl z-10"
              style={{ background: "var(--surface)" }}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                style={{ background: "color-mix(in srgb, var(--text2) 20%, transparent)", color: "var(--text1)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text1)";
                }}
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-[55%] h-[300px] md:h-auto relative">
                <img 
                  src={selectedProject.img} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-[45%] p-6 md:p-8 flex flex-col">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3 border" style={{ color: "var(--accent)", borderColor: "var(--accent)", background: "color-mix(in srgb, var(--accent) 10%, transparent)" }}>
                    {selectedProject.cat}
                  </span>
                  <h2 className="text-[28px] font-bold leading-tight mb-4" style={{ color: "var(--text1)" }}>
                    {selectedProject.title}
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text2)" }}>
                    {selectedProject.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 mt-auto md:mt-6">
                  {selectedProject.tools.map((tool) => (
                    <span 
                      key={tool} 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ background: "color-mix(in srgb, var(--text2) 15%, transparent)", color: "var(--text1)" }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="w-full h-[1px] mb-6" style={{ background: "color-mix(in srgb, var(--text2) 20%, transparent)" }} />

                <div className="flex items-center gap-3 mt-auto">
                  <button 
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
                    style={{ background: "var(--accent)", color: "#ffffff" }}
                  >
                    View Live <ArrowRight size={16} />
                  </button>
                  <button 
                    className="flex-1 py-3 rounded-full text-sm font-semibold transition-all duration-300 border hover:text-white"
                    style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)";
                      (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                    }}
                  >
                    Case Study
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
