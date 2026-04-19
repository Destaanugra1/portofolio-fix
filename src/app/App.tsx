import { Routes, Route } from "react-router";
import { ThemeProvider } from "./components/ThemeContext";
import { StoreProvider } from "./components/store/StoreContext";
import { PortfolioLayout } from "./layouts/PortfolioLayout";
import { TemplateLayout } from "./layouts/TemplateLayout";
import { HomePage } from "./pages/HomePage";
import { Inforasi } from "./pages/blog/Inforasi";
import TemplatePage from "./pages/store/TemplatePage";
import TemplateDetailPage from "../pages/store/TemplateDetailPage";
import OrderStatusPage from "../pages/store/OrderStatusPage";
import OrderErrorPage from "../pages/store/OrderErrorPage";
import { AdPopup } from "./components/store/AdPopup";
import { MaintenancePopup } from "./components/store/MaintenancePopup";

export default function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <MaintenancePopup />
        <AdPopup />
        <Routes>

        {/* ── Portfolio / Homepage ── */}
        <Route
          path="/"
          element={
            <PortfolioLayout>
              <HomePage />
            </PortfolioLayout>
          }
        />

        {/* ── Template Store ── */}
        <Route
          path="/template"
          element={
            <TemplateLayout>
              <TemplatePage />
            </TemplateLayout>
          }
        />

        {/* ── Template Detail ── */}
        <Route
          path="/template/:slug"
          element={
            <TemplateLayout>
              <TemplateDetailPage />
            </TemplateLayout>
          }
        />

        {/* ── Order Status / Invoice ── */}
        <Route
          path="/order/status"
          element={
            <TemplateLayout>
              <OrderStatusPage />
            </TemplateLayout>
          }
        />

        <Route
          path="/order/error"
          element={
            <TemplateLayout>
              <OrderErrorPage />
            </TemplateLayout>
          }
        />

        {/* ── Blog ── */}
        <Route
          path="/blog"
          element={
            <TemplateLayout>
              <Inforasi />
            </TemplateLayout>
          }
        />
        {/* Tambah route template lain di sini, misal: */}
        {/* <Route path="/templates/:id" element={<TemplateLayout><TemplateDetailPage /></TemplateLayout>} /> */}

        {/* ── Future: Admin / Backend ── */}
        {/* <Route path="/admin/*" element={<AdminLayout><AdminPage /></AdminLayout>} /> */}

        </Routes>
      </StoreProvider>
    </ThemeProvider>
  );
}
