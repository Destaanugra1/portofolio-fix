import { Navbar } from "../components/Navbar";
import { CustomCursor } from "../components/CustomCursor";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/**
 * Layout untuk halaman portfolio (homepage).
 * Navbar-nya scroll-based, link ke section dalam satu halaman.
 */
export function PortfolioLayout({ children }: Props) {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>{children}</main>
    </>
  );
}
