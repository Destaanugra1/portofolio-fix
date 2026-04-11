import { TemplateNavbar } from "../components/navbar/TemplateNavbar";
import { CustomCursor } from "../components/CustomCursor";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/**
 * Layout untuk halaman template store.
 * Navbar-nya navigasi antar halaman (react-router Link).
 * Background & warna teks otomatis ikut tema (dark/light) via CSS vars.
 */
export function TemplateLayout({ children }: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text1)",
        transition: "background 0.4s, color 0.4s",
      }}
    >
      <CustomCursor />
      <TemplateNavbar />
      <main>{children}</main>
    </div>
  );
}
