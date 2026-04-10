import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const heroImg = "https://images.unsplash.com/photo-1760245773960-200dbe893696?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBkZXNpZ25lciUyMHBvcnRyYWl0JTIwZGFyayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc0ODU1ODYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export function Hero() {
  return (
    <section id="hello" className="min-h-screen flex items-center relative overflow-hidden" style={{ background: "var(--bg)", transition: "background 0.4s" }}>
      {/* Floating shapes */}
      <motion.div
        className="absolute top-20 right-20 w-16 h-16 border rotate-45"
        style={{ borderColor: "color-mix(in srgb, var(--accent) 20%, transparent)", borderRadius: 4, transition: "border-color 0.4s" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-40 right-40 w-10 h-10 border"
        style={{ borderColor: "color-mix(in srgb, var(--accent) 15%, transparent)", clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)", transition: "border-color 0.4s" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-32 left-10 w-24 h-24 border"
        style={{ borderColor: "color-mix(in srgb, var(--accent) 10%, transparent)", clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)", transition: "border-color 0.4s" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Dot grid */}
      <motion.div
        className="absolute top-10 right-10 grid grid-cols-5 gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "color-mix(in srgb, var(--accent) 40%, transparent)", transition: "background 0.4s" }} />
        ))}
      </motion.div>

      <div className="max-w-[1280px] mx-auto px-6 w-full grid md:grid-cols-2 gap-10 items-center pt-24">
        <div>
          <motion.p
            className="tracking-[3px] uppercase mb-4"
            style={{ color: "var(--accent)", fontSize: 11, transition: "color 0.4s" }}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >HELLO, I'M A</motion.p>
          <motion.h1
            className="mb-4"
            style={{ fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 700, lineHeight: 1.1, color: "var(--text1)", transition: "color 0.4s" }}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            UI & UX{" "}
            <span style={{ color: "var(--accent)", fontStyle: "italic", transition: "color 0.4s" }}>Designer.</span>
          </motion.h1>
          <motion.p
            className="mb-8 max-w-md"
            style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.7, transition: "color 0.4s" }}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Hi I'm Alex Wallace, a passionate UI/UX Designer based in the Philippines. Welcome to my portfolio world.
          </motion.p>
          <motion.button
            className="px-8 py-3 rounded-full"
            style={{ background: "var(--accent)", color: "var(--btn-text)", fontWeight: 600, fontSize: 14, transition: "background 0.4s, color 0.4s" }}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px color-mix(in srgb, var(--accent) 40%, transparent)" }}
          >VIEW PORTFOLIO</motion.button>
          <motion.div
            className="flex items-center gap-2 mt-12"
            style={{ color: "var(--text2)", fontSize: 12, transition: "color 0.4s" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Scroll Down to Explore
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown size={16} />
            </motion.div>
          </motion.div>
        </div>

        <div className="relative flex justify-center items-center">
          <motion.div
            className="absolute w-[320px] h-[320px] md:w-[400px] md:h-[400px] rounded-full"
            style={{ background: "color-mix(in srgb, var(--accent) 15%, transparent)", transition: "background 0.4s" }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 1, delay: 0.5 }}
          />
          <motion.div
            className="relative z-10 w-[280px] h-[350px] md:w-[350px] md:h-[430px] rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <ImageWithFallback src={heroImg} alt="Alex Wallace" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
