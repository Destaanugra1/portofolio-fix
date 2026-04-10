import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "../ThemeContext";
import { motion, AnimatePresence } from "motion/react";
import { siteConfig } from "../../config/site";
import { Link } from "react-router";

// ─────────────────────────────────────────────────────────────────────────────
// KONFIGURASI LINK NAVBAR
// Tambah link baru di sini saja, tidak perlu ubah kode lain.
//
// type: "scroll" → scroll ke section dengan id (id = nama section lowercase)
//       "route"  → navigasi ke halaman lain (href = path URL-nya)
// ─────────────────────────────────────────────────────────────────────────────
type NavLink =
  | { label: string; type: "scroll"; id: string }
  | { label: string; type: "route"; href: string };

const navLinks: NavLink[] = [
  { label: "Hello",     type: "scroll", id: "hello"     },
  { label: "About",     type: "scroll", id: "about"     },
  { label: "Services",  type: "scroll", id: "services"  },
  { label: "Skills",    type: "scroll", id: "skills"    },
  { label: "Portfolio", type: "scroll", id: "portfolio" },
  { label: "Contact",   type: "scroll", id: "contact"   },
  { label: "Template",   type: "route", href: "/template" },
  { label: "Blog",   type: "route", href: "/blog" },
  // Contoh nambah halaman baru (route):
  // { label: "Template", type: "route", href: "/template" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Hello");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { mode, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const scrollTo = (id: string) => {
    // Cari label dari navLinks berdasarkan id untuk update active state
    const link = navLinks.find((l) => l.type === "scroll" && l.id === id);
    setActive(link?.label ?? id);
    setSidebarOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const navBg = scrolled
    ? mode === "dark"
      ? "rgba(13,13,13,0.90)"
      : "rgba(255,255,255,0.90)"
    : "transparent";

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: navBg,
          backdropFilter: scrolled ? "blur(14px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
          boxShadow:
            scrolled && mode === "light"
              ? "0 2px 20px rgba(0,0,0,0.08)"
              : scrolled && mode === "dark"
                ? "0 2px 20px rgba(0,0,0,0.4)"
                : "none",
          transition: "background 0.4s, box-shadow 0.4s",
        }}
      >
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-5 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: "var(--accent)",
                color: "var(--btn-text)",
                fontWeight: 700,
                fontSize: 18,
                transition: "background 0.4s, color 0.4s",
              }}
            >
              {siteConfig.initial}
            </div>
            <span
              style={{
                color: "var(--text1)",
                fontWeight: 600,
                fontSize: 18,
                transition: "color 0.4s",
              }}
            >
              {siteConfig.name}
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.type === "scroll" ? (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.id)}
                  className="relative text-sm"
                  style={{
                    color: active === link.label ? "var(--accent)" : "var(--text2)",
                    fontWeight: 400,
                    transition: "color 0.3s",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {link.label}
                  {active === link.label && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 w-full h-0.5 rounded"
                      style={{ background: "var(--accent)" }}
                    />
                  )}
                </button>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setActive(link.label)}
                  className="relative text-sm"
                  style={{
                    color: active === link.label ? "var(--accent)" : "var(--text2)",
                    fontWeight: 400,
                    transition: "color 0.3s",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                  {active === link.label && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 w-full h-0.5 rounded"
                      style={{ background: "var(--accent)" }}
                    />
                  )}
                </Link>
              )
            )}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                border: "1px solid var(--accent)",
                color: "var(--accent)",
                transition: "border-color 0.4s, color 0.4s",
              }}
              aria-label="Toggle theme"
            >
              {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="border px-5 py-2 rounded-full text-sm"
              style={{
                borderColor: "var(--accent)",
                color: "var(--accent)",
                fontWeight: 500,
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent)";
                e.currentTarget.style.color = "var(--btn-text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--accent)";
              }}
            >
              LET'S TALK
            </button>
          </div>

          {/* Mobile: Theme toggle + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                border: "1px solid var(--accent)",
                color: "var(--accent)",
                transition: "border-color 0.4s, color 0.4s",
              }}
              aria-label="Toggle theme"
            >
              {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ color: "var(--text1)", transition: "color 0.3s" }}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSidebarOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 60,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
              }}
            />

            {/* Sidebar Panel */}
            <motion.aside
              key="sidebar"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                width: "min(80vw, 300px)",
                zIndex: 70,
                background:
                  mode === "dark"
                    ? "linear-gradient(145deg, #111111 0%, #1a1a1a 100%)"
                    : "linear-gradient(145deg, #ffffff 0%, #f8f8f8 100%)",
                boxShadow: "-4px 0 40px rgba(0,0,0,0.35)",
                display: "flex",
                flexDirection: "column",
                padding: "0 0 32px 0",
              }}
            >
              {/* Sidebar Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "18px 24px",
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--text2) 15%, transparent)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: "var(--accent)",
                      color: "var(--btn-text)",
                      fontWeight: 700,
                      fontSize: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {siteConfig.initial}
                  </div>
                  <span
                    style={{
                      color: "var(--text1)",
                      fontWeight: 600,
                      fontSize: 17,
                    }}
                  >
                    {siteConfig.name}
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text2)",
                    background:
                      "color-mix(in srgb, var(--text2) 10%, transparent)",
                    border: "none",
                    cursor: "pointer",
                    transition: "color 0.2s",
                  }}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sidebar Nav Links */}
              <nav
                style={{
                  flex: 1,
                  padding: "24px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {navLinks.map((link, i) => {
                  const isActive = active === link.label;
                  const itemStyle = {
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "13px 24px",
                    background: isActive
                      ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                      : "transparent",
                    borderLeft: isActive
                      ? "3px solid var(--accent)"
                      : "3px solid transparent",
                    color: isActive ? "var(--accent)" : "var(--text2)",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: 15,
                    transition: "all 0.25s",
                    cursor: "pointer",
                    textAlign: "left" as const,
                    textDecoration: "none",
                    width: "100%",
                    border: "none",
                  };
                  const badge = (
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        background: isActive
                          ? "var(--accent)"
                          : "color-mix(in srgb, var(--text2) 15%, transparent)",
                        color: isActive ? "var(--btn-text)" : "var(--text2)",
                        fontSize: 11,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.25s",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  );

                  return link.type === "scroll" ? (
                    <motion.button
                      key={link.label}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: i * 0.05 + 0.1,
                        type: "spring",
                        stiffness: 300,
                        damping: 28,
                      }}
                      onClick={() => scrollTo(link.id)}
                      style={itemStyle as React.CSSProperties}
                    >
                      {badge}
                      {link.label}
                    </motion.button>
                  ) : (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: i * 0.05 + 0.1,
                        type: "spring",
                        stiffness: 300,
                        damping: 28,
                      }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => { setActive(link.label); setSidebarOpen(false); }}
                        style={itemStyle}
                      >
                        {badge}
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Sidebar Footer CTA */}
              <div style={{ padding: "0 24px" }}>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  onClick={() => scrollTo("contact")}
                  style={{
                    width: "100%",
                    padding: "13px 0",
                    borderRadius: 50,
                    background: "var(--accent)",
                    color: "var(--btn-text)",
                    fontWeight: 600,
                    fontSize: 14,
                    letterSpacing: "0.05em",
                    border: "none",
                    cursor: "pointer",
                    transition: "opacity 0.3s",
                  }}
                >
                  LET'S TALK
                </motion.button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
