import React, { useState } from 'react';
import { Banner } from '../../components/store/Banner';
// import { FeaturedCard } from '../../components/store/FeaturedCard';
import { TemplateCard } from '../../components/store/TemplateCard';
import { useStoreGlobally } from '../../components/store/StoreContext';
import { AdPopup } from '../../components/store/AdPopup';
import { MaintenancePopup } from '../../components/store/MaintenancePopup';

const TemplatePage = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Ambil state dari context
  const { templates, loading } = useStoreGlobally();

  const filteredTemplates = templates.filter(t => {
    const matchCat = activeCategory === "Semua" ||
      (t.category?.toLowerCase() ?? "").includes(activeCategory.toLowerCase());
    const matchSearch = (t.title?.toLowerCase() ?? "").includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });
  const dynamicCategories = ["Semua", ...Array.from(new Set(templates.map(t => t.category || "General")))];

  return (
    <div className="min-h-screen pb-20" style={{ background: "var(--bg)", transition: "background 0.4s" }}>
      {/* Popups — rendered at this level so they only appear on /template */}
      <MaintenancePopup />
      <AdPopup />
      <Banner
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={dynamicCategories}
      />

      {/* <FeaturedCard /> */}

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
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="border rounded-xl h-[280px] overflow-hidden flex flex-col"
                style={{ background: "var(--surface)", borderColor: "color-mix(in srgb, var(--text2) 15%, transparent)" }}
              >
                <div className="h-[140px] w-full animate-pulse opacity-20" style={{ background: "var(--text2)" }} />
                <div className="p-3 flex-1 flex flex-col gap-3 justify-center">
                  <div className="h-3 w-16 animate-pulse rounded-full opacity-20" style={{ background: "var(--text2)" }} />
                  <div className="h-4 w-3/4 animate-pulse rounded-md opacity-20" style={{ background: "var(--text2)" }} />
                  <div className="mt-auto flex justify-between items-center">
                    <div className="h-4 w-1/3 animate-pulse rounded-md opacity-20" style={{ background: "var(--text2)" }} />
                    <div className="h-6 w-1/4 animate-pulse rounded-md opacity-20" style={{ background: "var(--text2)" }} />
                  </div>
                </div>
              </div>
            ))
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