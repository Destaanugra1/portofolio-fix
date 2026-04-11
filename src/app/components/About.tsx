import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { About as A } from "../config/site";
import ImageAbout from "../../assets/about.jpeg"

const aboutImg =  ImageAbout
function CountUp({ target, suffix = "+" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return; 
    let start = 0;
    const duration = 1500;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return <span ref={ref} style={{ fontWeight: 700, fontSize: 24, color: "var(--text1)", transition: "color 0.4s" }}>{count}{suffix}</span>;
}

const stats = [
  { value: 3, label: "Years of Experience", top: "5%", left: "65%" },
  { value: 15, label: "Projects Completed", top: "40%", left: "-10%" },
  { value: 10, label: "Happy Clients", top: "75%", left: "60%" },
];

export function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  return (
    <section id="about" className="py-24 relative" style={{ background: "var(--bg)", transition: "background 0.4s" }}>
      <div ref={ref} className="max-w-[1280px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div className="relative flex justify-center" initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <motion.div
            className="absolute w-[300px] h-[300px] md:w-[380px] md:h-[380px] rounded-full border-2 border-dashed"
            style={{ borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)", transition: "border-color 0.4s" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <div className="w-[260px] h-[260px] md:w-[340px] md:h-[340px] rounded-full overflow-hidden relative z-10">
            <ImageWithFallback src={aboutImg} alt="About" className="w-full h-full object-cover" />
          </div>
          {stats.map((s, i) => (
            <div key={i} className="absolute z-20 px-4 py-2 rounded-xl flex flex-col items-center" style={{ background: "var(--surface)", top: s.top, left: s.left, minWidth: 100, transition: "background 0.4s" }}>
              <CountUp target={s.value} />
              <span style={{ fontSize: 10, color: "var(--text2)", textAlign: "center", transition: "color 0.4s" }}>{s.label}</span>
            </div>
          ))}
        </motion.div>

        <div>
          {[
            <p key="o" className="tracking-[3px] uppercase mb-2" style={{ color: "var(--accent)", fontSize: 11, transition: "color 0.4s" }}>LET ME INTRODUCE MYSELF</p>,
            <h2 key="t" className="mb-3" style={{ color: "var(--accent)", fontSize: 42, fontWeight: 700, transition: "color 0.4s" }}>Tentang Saya</h2>,
            <h3 key="s" className="mb-4" style={{ color: "var(--text1)", fontSize: 20, fontWeight: 600, transition: "color 0.4s" }}>Sebuah kisah tentang kerja keras dan ketekunan.</h3>,
            <p key="b" className="mb-6" style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.8, transition: "color 0.4s" }}>
             {A.tentangSaya}
            </p>,
            <div key="c" className="mb-8">
              <p style={{ color: "var(--text1)", fontSize: 16, fontWeight: 600, transition: "color 0.4s" }}>Contact</p>
              <p style={{ color: "var(--text2)", fontSize: 14, transition: "color 0.4s" }}>Gratis untuk kontak saya</p>
              <p style={{ color: "var(--accent)", fontSize: 14, transition: "color 0.4s" }} className="mt-1">{A.contact}</p>
            </div>,
            <div key="bt" className="flex gap-4">
              <motion.button className="px-8 py-3 rounded-full" style={{ background: "var(--accent)", color: "var(--btn-text)", fontWeight: 600, fontSize: 14, transition: "background 0.4s, color 0.4s" }} whileHover={{ scale: 1.05 }}>Unduh CV</motion.button>
              {/* <motion.button className="px-8 py-3 rounded-full border" style={{ borderColor: "var(--text2)", color: "var(--text1)", fontWeight: 600, fontSize: 14, transition: "all 0.4s" }} whileHover={{ scale: 1.05 }}>DOWNLOAD CV</motion.button> */}
            </div>
          ].map((el, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.15 }}>{el}</motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
