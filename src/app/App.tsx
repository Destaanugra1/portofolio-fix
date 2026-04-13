import { Routes, Route } from "react-router";
import { ThemeProvider } from "./components/ThemeContext";
import { PortfolioLayout } from "./layouts/PortfolioLayout";
import { TemplateLayout } from "./layouts/TemplateLayout";
import { HomePage } from "./pages/HomePage";
import { Inforasi } from "./pages/blog/Inforasi";
import TemplatePage from "./pages/store/TemplatePage";
import TemplateDetailPage from "../pages/store/TemplateDetailPage";
import OrderStatusPage from "../pages/store/OrderStatusPage";
import OrderErrorPage from "../pages/store/OrderErrorPage";


export default function App() {
  return (
    <ThemeProvider>
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
          path="/template/:id"
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
    </ThemeProvider>
  );
}
