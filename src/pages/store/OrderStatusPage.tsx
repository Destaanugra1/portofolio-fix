import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { CheckCircle, XCircle, Clock, Receipt, Download, ArrowLeft } from "lucide-react";
import { apiFetch } from "../../lib/apiClient";

export default function OrderStatusPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  useEffect(() => {
    if (!orderId) {
      setError("Order ID tidak ditemukan.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await apiFetch(`${API_URL}/store/orders/${orderId}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError("Pesanan tidak ditemukan.");
        }
      } catch (err) {
        console.error(err);
        setError("Gagal memuat status pesanan.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <XCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Oops!</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button
          onClick={() => navigate("/template")}
          className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
        >
          Kembali ke Store
        </button>
      </div>
    );
  }

  const isSuccess = order.status === "processing" || order.status === "paid" || order.status === "delivered" || order.status === "success";
  const isFailed = order.status === "returned" || order.status === "canceled" || order.status === "failed" || order.status === "expired";
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => navigate("/template")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Kembali ke Store
      </button>

      <div className="bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {/* Header Invoice */}
        <div className={`p-8 flex flex-col items-center text-center border-b border-black/10 dark:border-white/10 ${isSuccess ? 'bg-[#d1fae5]/50 dark:bg-[#064e3b]/30' : isFailed ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-800/30'}`}>
          {isSuccess ? (
            <div className="w-16 h-16 bg-[#10b981] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#10b981]/30 mb-4 animate-bounce-short">
              <CheckCircle size={32} />
            </div>
          ) : isFailed ? (
             <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 mb-4">
              <XCircle size={32} />
            </div>
          ) : (
            <div className="w-16 h-16 bg-orange-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-400/30 mb-4">
              <Clock size={32} />
            </div>
          )}
          
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
            {isSuccess ? "Pembayaran Berhasil!" : isFailed ? "Pembayaran Gagal" : "Menunggu Pembayaran"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
            {isSuccess 
              ? "Terima kasih atas pesanan Anda. Transaksi telah kami verifikasi secara otomatis." 
              : isFailed
              ? "Pesanan Anda telah dibatalkan atau kadaluarsa."
              : "Silakan selesaikan pembayaran Anda sesuai dengan metode yang Anda pilih."}
          </p>
        </div>

        {/* Detail Invoice */}
        <div className="p-8">
          <div className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white font-bold">
            <Receipt size={20} className="text-gray-400" />
            <h3>Detail Transaksi</h3>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-500">Order ID / Ref</span>
              <span className="font-mono font-medium text-gray-900 dark:text-gray-200">{order.externalId || `ORD-${order.id}`}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-500">Tanggal</span>
              <span className="font-medium text-gray-900 dark:text-gray-200">
                {new Date(order.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-500">Nama Pembeli</span>
              <span className="font-medium text-gray-900 dark:text-gray-200">{order.customerName}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-500">Email Utama</span>
              <span className="font-medium text-gray-900 dark:text-gray-200">{order.customerEmail}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-500">Total Tagihan</span>
              <span className="font-bold text-gray-900 dark:text-gray-200">
                 Rp {Number(order.total).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-500">Status</span>
              {isSuccess ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d1fae5] text-[#059669] text-xs font-bold border border-[#a7f3d0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span> Berhasil
                </span>
              ) : isFailed ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-700"></span> Gagal
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-700"></span> Tertunda
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-3">
             {isSuccess && (
                <button 
                  onClick={() => {
                     if (order.fileUrl) {
                        window.open(order.fileUrl, '_blank');
                     } else {
                        alert("Maaf, link unduhan belum tersedia. Silakan hubungi admin.");
                     }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#b91c1c] hover:bg-red-700 text-white py-3.5 px-6 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
                >
                  <Download size={18} />
                  Download {order.productName || "Template"}
                </button>
             )}
             <button 
               onClick={() => window.print()}
               className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 py-3.5 px-6 rounded-xl font-bold transition-colors"
             >
               Cetak Nota
             </button>
          </div>
          
          {isSuccess && (
             <div className="mt-4 text-center">
               <p className="text-xs text-gray-400">
                 Link download juga telah dikirimkan ke email <strong>{order.customerEmail}</strong>
               </p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
