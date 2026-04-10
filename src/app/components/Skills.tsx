import { motion, useInView } from "motion/react";
import { useRef } from "react";

const languages = [
  { name: "HTML/CSS", pct: 95 },
  { name: "JavaScript", pct: 88 },
  { name: "TypeScript", pct: 75 },
  { name: "Python", pct: 80 },
  { name: "PHP", pct: 70 },
  { name: "Dart/Flutter", pct: 65 },
];

const tools = [
  "React", "Vue", "Node.js", "Figma", "Git", "Firebase", "MySQL", "Tailwind CSS", "Docker",
];

const toolIcons: Record<string, string> = {
  React: "⚛️", Vue: "💚", "Node.js": "🟢", Figma: "🎨", Git: "🔀",
  Firebase: "🔥", MySQL: "🐬", "Tailwind CSS": "🌊", Docker: "🐳",
};

export function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section className="py-24" style={{ background: "var(--bg)", transition: "background 0.4s" }}>
      <div ref={ref} className="max-w-[1280px] mx-auto px-6">
        <motion.p
          className="tracking-[3px] uppercase mb-2 text-center"
          style={{ color: "var(--accent)", fontSize: 11, transition: "color 0.4s" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
        >WHAT I WORK WITH</motion.p>
        <motion.h2
          className="mb-16 text-center"
          style={{ color: "var(--accent)", fontSize: 42, fontWeight: 700, transition: "color 0.4s" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
        >Tech Stack & Skills</motion.h2>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Progress bars */}
          <div className="flex flex-col gap-6">
            {languages.map((l, i) => (
              <motion.div
                key={l.name}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="flex justify-between mb-1.5">
                  <span style={{ color: "var(--text1)", fontSize: 14, fontWeight: 500, transition: "color 0.4s" }}>{l.name}</span>
                  <span style={{ color: "var(--accent)", fontSize: 14, fontWeight: 700, transition: "color 0.4s" }}>{l.pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--surface)", transition: "background 0.4s" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "var(--accent)", transition: "background-color 0.4s" }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${l.pct}%` } : {}}
                    transition={{ delay: 0.3 + i * 0.1, duration: 1.2, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tool grid */}
          <div className="grid grid-cols-3 gap-4">
            {tools.map((t, i) => (
              <motion.div
                key={t}
                className="flex flex-col items-center justify-center p-5 rounded-xl"
                style={{ background: "var(--surface)", transition: "background 0.4s, box-shadow 0.2s" }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px color-mix(in srgb, var(--accent) 30%, transparent)" }}
              >
                <span className="text-3xl mb-2">{toolIcons[t]}</span>
                <span style={{ color: "var(--text2)", fontSize: 12, transition: "color 0.4s" }}>{t}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
