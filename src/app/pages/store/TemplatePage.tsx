import React, { useState, useEffect } from 'react';
import { Banner } from '../../components/store/Banner';
import { FeaturedCard } from '../../components/store/FeaturedCard';
import { TemplateCard } from '../../components/store/TemplateCard';

const CATEGORIES = ["Semua", "Landing Page", "Dashboard", "Portfolio", "E-Commerce", "Admin Panel"];

const TemplatePage = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/store/products`);
        const result = await res.json();
        if (result.success) {
          setTemplates(result.data);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_URL]);

  const filteredTemplates = templates.filter(t => {
    const matchCat = activeCategory === "Semua" ||
      (t.category?.toLowerCase() ?? "").includes(activeCategory.toLowerCase());
    const matchSearch = (t.title?.toLowerCase() ?? "").includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen pb-20" style={{ background: "var(--bg)", transition: "background 0.4s" }}>
      <Banner
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={CATEGORIES}
      />

      <FeaturedCard />

      {/* Template Grid Section */}
      <div id="template-grid" className="max-w-[900px] mx-auto px-4 mt-12 mb-6">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-[11px] tracking-[2px] font-semibold uppercase" style={{ color: "var(--text2)", transition: "color 0.4s" }}>
            SEMUA TEMPLATE
          </h3>
          <button className="text-[12px] text-[#b91c1c] font-medium hover:underline cursor-pointer">
            Lihat semua &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[14px]">
          {loading ? (
            <div className="col-span-full py-10 flex justify-center text-[var(--text2)]">Memuat produk...</div>
          ) : filteredTemplates.length === 0 ? (
            <div className="col-span-full py-10 flex justify-center text-[var(--text2)]">Produk tidak tersedia.</div>
          ) : (
            filteredTemplates.map(template => (
              <TemplateCard key={template.id} {...template} />
            ))
          )}

          {/* Placeholder card */}
          <div className="border border-dashed rounded-xl h-full min-h-[220px] flex flex-col items-center justify-center cursor-pointer" style={{ borderColor: 'color-mix(in srgb, var(--text2) 30%, transparent)', color: "var(--text2)", background: "color-mix(in srgb, var(--surface) 50%, transparent)", transition: "all 0.4s" }}>
            <div className="w-8 h-8 rounded-full border border-dashed flex items-center justify-center mb-2" style={{ borderColor: "var(--text2)" }}>
              +
            </div>
            <span className="text-xs font-medium">Segera hadir</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePage;