import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { XCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { apiFetch } from "../../lib/apiClient";

export default function OrderErrorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<any>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  useEffect(() => {
    if (orderId) {
      apiFetch(`${API_URL}/store/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) setOrder(data.order);
        })
        .catch(console.error);
    }
  }, [orderId]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 animate-in fade-in zoom-in duration-500">
      <div className="max-w-md w-full bg-white dark:bg-[#1a1a1a] border border-red-100 dark:border-red-900/30 rounded-2xl p-8 text-center shadow-xl shadow-red-500/5">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/20">
          <XCircle size={40} />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
          Transaksi Gagal
        </h1>
        
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Pesanan Anda {order ? `(${order.externalId || 'ORD-'+order.id})` : ''} telah kami batalkan karena batas waktu pembayaran habis atau terjadi kendala. Silakan lakukan pemesanan ulang.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/template")}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#b91c1c] text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
          >
            <RefreshCcw size={18} />
            Coba Pesan Lagi
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
