import { Navbar } from "../components/navbar/Navbar";
import { CustomCursor } from "../components/CustomCursor";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/**
 * Layout untuk halaman portfolio (homepage).
 * Navbar-nya scroll-based, link ke section dalam satu halaman.
 * Background & warna teks otomatis ikut tema (dark/light) via CSS vars.
 */
export function PortfolioLayout({ children }: Props) {
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
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
