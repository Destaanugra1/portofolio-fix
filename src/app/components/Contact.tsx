import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

export function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  return (
    <section id="contact" className="py-24" style={{ background: "var(--surface)", transition: "background 0.4s" }}>
      <div ref={ref} className="max-w-[1280px] mx-auto px-6">
        <motion.p className="tracking-[3px] uppercase mb-2 text-center" style={{ color: "var(--accent)", fontSize: 11, transition: "color 0.4s" }} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>GET IN TOUCH</motion.p>
        <motion.h2 className="mb-16 text-center" style={{ color: "var(--accent)", fontSize: 42, fontWeight: 700, transition: "color 0.4s" }} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>Contact</motion.h2>
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
            <div className="flex flex-col gap-6">
              {[
                { icon: Mail, label: "Email", value: "alex.wallace@gmail.com" },
                { icon: Phone, label: "Phone", value: "+63 912 345 6789" },
                { icon: MapPin, label: "Location", value: "Manila, Philippines" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)", transition: "background 0.4s" }}>
                    <item.icon size={20} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <p style={{ color: "var(--text2)", fontSize: 12, transition: "color 0.4s" }}>{item.label}</p>
                    <p style={{ color: "var(--text1)", fontSize: 15, transition: "color 0.4s" }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.form className="flex flex-col gap-4" initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} onSubmit={(e) => e.preventDefault()}>
            {["Your Name", "Your Email"].map((ph) => (
              <input key={ph} placeholder={ph} className="px-5 py-3 rounded-xl border outline-none transition-colors" style={{ borderColor: "color-mix(in srgb, var(--text2) 30%, transparent)", background: "var(--bg)", color: "var(--text1)", transition: "all 0.4s" }} />
            ))}
            <textarea placeholder="Your Message" rows={5} className="px-5 py-3 rounded-xl border outline-none resize-none transition-colors" style={{ borderColor: "color-mix(in srgb, var(--text2) 30%, transparent)", background: "var(--bg)", color: "var(--text1)", transition: "all 0.4s" }} />
            <motion.button className="px-8 py-3 rounded-full self-start" style={{ background: "var(--accent)", color: "var(--btn-text)", fontWeight: 600, fontSize: 14, transition: "background 0.4s, color 0.4s" }} whileHover={{ scale: 1.05 }}>SEND MESSAGE</motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
