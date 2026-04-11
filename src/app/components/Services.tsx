import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Lightbulb, Layers, Monitor } from "lucide-react";

const services = [
  { 
    icon: Lightbulb, 
    count: "UI/UX DESIGN", 
    title: "Riset & Ideasi", 
    description: "Analisis kompetitor, riset pengguna, pembuatan user flow, hingga testing konsep untuk validasi ide produk.",
    accent: true 
  },
  { 
    icon: Layers, 
    count: "VISUAL DESIGN", 
    title: "Design Thinking", 
    description: "Wireframing high-fidelity, sistem desain (style guide), prototyping interaktif, dan desain antarmuka yang estetis.",
    accent: false 
  },
  { 
    icon: Monitor, 
    count: "DEVELOPMENT", 
    title: "Web & Apps", 
    description: "Implementasi desain ke kode fungsional, optimasi performa, desain responsif, dan integrasi database/API.",
    accent: false 
  },
];

export function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  return (
    <section id="services" className="py-24" style={{ background: "var(--bg)", transition: "background 0.4s" }}>
      <div ref={ref} className="max-w-[1280px] mx-auto px-6 text-center">
        <motion.p className="tracking-[3px] uppercase mb-2" style={{ color: "var(--accent)", fontSize: 11, transition: "color 0.4s" }} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>APA YANG SAYA KERJAKAN</motion.p>
        <motion.h2 className="mb-16" style={{ color: "var(--accent)", fontSize: 42, fontWeight: 700, transition: "color 0.4s" }} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }}>Layanan</motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={i}
              className="p-8 rounded-2xl cursor-pointer group"
              style={{ background: s.accent ? "var(--accent)" : "var(--surface)", transition: "background 0.4s" }}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              whileHover={{ y: -8, boxShadow: "0 8px 30px color-mix(in srgb, var(--accent) 25%, transparent)" }}
            >
              <div className="mb-4 flex justify-center">
                <s.icon size={40} style={{ color: s.accent ? "var(--btn-text)" : "var(--accent)", transition: "color 0.4s" }} />
              </div>
              <p className="mb-2 uppercase tracking-wider" style={{ fontSize: 11, color: s.accent ? "var(--btn-text)" : "var(--text2)", transition: "color 0.4s" }}>{s.count}</p>
              <h3 className="mb-3" style={{ fontSize: 22, fontWeight: 700, color: s.accent ? "var(--btn-text)" : "var(--text1)", transition: "color 0.4s" }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: s.accent ? "color-mix(in srgb, var(--btn-text) 60%, transparent)" : "var(--text2)", lineHeight: 1.7, transition: "color 0.4s" }}>
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}