import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const filters = ["All", "UI & UX Design", "Branding", "Graphic Design"];
const projects = [
  { img: "https://images.unsplash.com/photo-1702479744031-2bf1f4bdfd8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXNpZ24lMjBtb2NrdXAlMjBkYXJrfGVufDF8fHx8MTc3NDg1NTg2NHww&ixlib=rb-4.1.0&q=80&w=1080", title: "Mobile App Redesign", cat: "UI & UX Design" },
  { img: "https://images.unsplash.com/photo-1728467459756-211f3c738697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZCUyMGlkZW50aXR5JTIwZGVzaWduJTIwY29sb3JmdWx8ZW58MXx8fHwxNzc0ODEzODg4fDA&ixlib=rb-4.1.0&q=80&w=1080", title: "Brand Identity", cat: "Branding" },
  { img: "https://images.unsplash.com/photo-1741119482290-bf0566a6d404?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJzaXRlJTIwZGVzaWduJTIwbGFwdG9wJTIwbW9ja3VwfGVufDF8fHx8MTc3NDg1NTg2NXww&ixlib=rb-4.1.0&q=80&w=1080", title: "Website Mockup", cat: "UI & UX Design" },
  { img: "https://images.unsplash.com/photo-1770581939371-326fc1537f10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHBvc3RlciUyMGRlc2lnbiUyMHR5cG9ncmFwaHl8ZW58MXx8fHwxNzc0ODU1ODY1fDA&ixlib=rb-4.1.0&q=80&w=1080", title: "Creative Poster", cat: "Graphic Design" },
  { img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", title: "Logo Design System", cat: "Branding" },
  { img: "https://images.unsplash.com/photo-1542744094-24638eff58bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", title: "Dashboard UI", cat: "UI & UX Design" },
  { img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", title: "Print Campaign", cat: "Graphic Design" },
  { img: "https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", title: "E-Commerce App", cat: "UI & UX Design" },
];

const ITEMS_PER_PAGE = 4;

export function Portfolio() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [active, setActive] = useState("All");
  const [page, setPage] = useState(0);

  const filtered = active === "All" ? projects : projects.filter((p) => p.cat === active);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE);

  // Reset page when filter changes
  useEffect(() => {
    setPage(0);
  }, [active]);

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <section id="portfolio" className="py-24" style={{ background: "var(--bg)", transition: "background 0.4s" }}>
      <div ref={ref} className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <motion.h2
            style={{ color: "var(--accent)", fontSize: 42, fontWeight: 700, transition: "color 0.4s" }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
          >
            Portfolio
          </motion.h2>

          {/* Filters + Nav buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className="px-4 py-1.5 rounded-full text-sm"
                style={{
                  background: active === f ? "var(--accent)" : "transparent",
                  color: active === f ? "var(--btn-text)" : "var(--text2)",
                  fontWeight: active === f ? 600 : 400,
                  border: "1px solid",
                  borderColor: active === f ? "var(--accent)" : "color-mix(in srgb, var(--text2) 30%, transparent)",
                  transition: "all 0.3s",
                  cursor: "pointer",
                }}
              >
                {f}
              </button>
            ))}

            {/* Prev / Next */}
            <div className="flex gap-2 ml-2 items-center">
              {/* Page indicator */}
              <span style={{ color: "var(--text2)", fontSize: 12, minWidth: 40, textAlign: "center" }}>
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={!canPrev}
                className="w-9 h-9 rounded-full border flex items-center justify-center"
                style={{
                  borderColor: canPrev ? "var(--accent)" : "color-mix(in srgb, var(--text2) 30%, transparent)",
                  color: canPrev ? "var(--accent)" : "var(--text2)",
                  opacity: canPrev ? 1 : 0.4,
                  transition: "all 0.3s",
                  cursor: canPrev ? "pointer" : "not-allowed",
                  background: "transparent",
                }}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={!canNext}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: canNext ? "var(--accent)" : "color-mix(in srgb, var(--text2) 25%, transparent)",
                  color: canNext ? "var(--btn-text)" : "var(--text2)",
                  opacity: canNext ? 1 : 0.5,
                  transition: "all 0.3s",
                  cursor: canNext ? "pointer" : "not-allowed",
                  border: "none",
                }}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {paginated.map((p, i) => (
              <motion.div
                key={p.title}
                data-cursor="card"
                className="relative rounded-2xl overflow-hidden group cursor-pointer aspect-[4/3]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                layout
              >
                <ImageWithFallback src={p.img} alt={p.title} className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(transparent 30%, var(--overlay))" }}
                >
                  <p style={{ color: "var(--accent)", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, transition: "color 0.4s" }}>{p.cat}</p>
                  <p style={{ color: "var(--text1)", fontSize: 16, fontWeight: 600, transition: "color 0.4s" }}>{p.title}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                style={{
                  width: i === page ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === page ? "var(--accent)" : "color-mix(in srgb, var(--text2) 30%, transparent)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  padding: 0,
                }}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
