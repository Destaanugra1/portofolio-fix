import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, ShoppingBag, Search } from "lucide-react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "./ThemeContext";

const navLinks = [
  { label: "All Templates", href: "/templates" },
  { label: "Portfolio", href: "/templates/portfolio" },
  { label: "Landing Page", href: "/templates/landing" },
  { label: "Dashboard", href: "/templates/dashboard" },
];

export function TemplateNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { mode, toggle } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const navBg = scrolled
    ? mode === "dark"
      ? "rgba(13,13,13,0.90)"
      : "rgba(255,255,255,0.90)"
    : "transparent";

  const isActive = (href: string) => location.pathname === href;

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
          {/* Logo — klik balik ke portfolio */}
          <Link to="/" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
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
              A
            </div>
            <span
              style={{
                color: "var(--text1)",
                fontWeight: 600,
                fontSize: 18,
                transition: "color 0.4s",
              }}
            >
              Alex
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="relative text-sm"
                style={{
                  color: isActive(link.href) ? "var(--accent)" : "var(--text2)",
                  fontWeight: 400,
                  textDecoration: "none",
                  transition: "color 0.3s",
                }}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="template-nav-underline"
                    className="absolute -bottom-1 left-0 w-full h-0.5 rounded"
                    style={{ background: "var(--accent)" }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                border: "1px solid color-mix(in srgb, var(--text2) 30%, transparent)",
                color: "var(--text2)",
                transition: "border-color 0.4s, color 0.4s",
              }}
              aria-label="Search templates"
            >
              <Search size={15} />
            </button>

            {/* Theme toggle */}
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

            {/* CTA */}
            <Link
              to="/templates"
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm"
              style={{
                background: "var(--accent)",
                color: "var(--btn-text)",
                fontWeight: 500,
                textDecoration: "none",
                transition: "opacity 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <ShoppingBag size={15} />
              Browse
            </Link>
          </div>

          {/* Mobile */}
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

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
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
              {/* Header */}
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
                <span style={{ color: "var(--text1)", fontWeight: 600 }}>Menu</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    width: 36, height: 36,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text2)",
                    background: "color-mix(in srgb, var(--text2) 10%, transparent)",
                    border: "none",
                    cursor: "pointer",
                  }}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Nav Links */}
              <nav style={{ flex: 1, padding: "24px 0", display: "flex", flexDirection: "column", gap: 4 }}>
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1, type: "spring", stiffness: 300, damping: 28 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setSidebarOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "13px 24px",
                        background: isActive(link.href)
                          ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                          : "transparent",
                        borderLeft: isActive(link.href)
                          ? "3px solid var(--accent)"
                          : "3px solid transparent",
                        color: isActive(link.href) ? "var(--accent)" : "var(--text2)",
                        fontWeight: isActive(link.href) ? 600 : 400,
                        fontSize: 15,
                        textDecoration: "none",
                        transition: "all 0.25s",
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* CTA */}
              <div style={{ padding: "0 24px" }}>
                <Link
                  to="/templates"
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    width: "100%",
                    padding: "13px 0",
                    borderRadius: 50,
                    background: "var(--accent)",
                    color: "var(--btn-text)",
                    fontWeight: 600,
                    fontSize: 14,
                    letterSpacing: "0.05em",
                    textDecoration: "none",
                    transition: "opacity 0.3s",
                  }}
                >
                  <ShoppingBag size={16} />
                  Browse Templates
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
