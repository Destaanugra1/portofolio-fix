import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from '../../../lib/apiClient';

interface StoreContextType {
  templates: any[];
  loading: boolean;
  error: string | null;
  refreshTemplates: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const res = await apiFetch(`${API_URL}/store/products`);
      const result = await res.json();
      if (result.success) {
        setTemplates(result.data);
        setError(null);
      } else {
        setError(result.error || "Gagal memuat.");
      }
    } catch (err) {
      console.error("Failed to load products", err);
      setError("Gagal memuat produk.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch once when provider mounts
    fetchProducts();
  }, []);

  return (
    <StoreContext.Provider value={{ templates, loading, error, refreshTemplates: fetchProducts }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreGlobally = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStoreGlobally must be used within StoreProvider");
  return context;
};
