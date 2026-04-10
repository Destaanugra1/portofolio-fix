import { TemplateNavbar } from "../components/TemplateNavbar";
import { CustomCursor } from "../components/CustomCursor";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/**
 * Layout untuk halaman template store.
 * Navbar-nya navigasi antar halaman (react-router Link).
 * Tambah layout baru di sini untuk BE/admin nanti.
 */
export function TemplateLayout({ children }: Props) {
  return (
    <>
      <CustomCursor />
      <TemplateNavbar />
      <main style={{ paddingTop: "72px" }}>{children}</main>
    </>
  );
}
