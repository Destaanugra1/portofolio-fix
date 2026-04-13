import React, { useState, useEffect } from 'react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: {
    id: number;
    title: string;
    price: number;
  } | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, template }) => {
  const [step, setStep] = useState<'form' | 'loading' | 'payment' | 'success' | 'error'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [qrString, setQrString] = useState('');
  const [orderId, setOrderId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bri'>('qris');
  const [vaNumber, setVaNumber] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  // RESET state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setName('');
      setEmail('');
      setQrString('');
      setOrderId(null);
      setPaymentMethod('qris');
      setVaNumber('');
    }
  }, [isOpen]);

  // Polling for payment status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'payment' && orderId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${API_URL}/store/orders/${orderId}/status`);
          const data = await res.json();
          if (data.status === 'processing' || data.status === 'paid' || data.status === 'delivered') {
            clearInterval(interval);
            window.location.href = `/order/status?id=${orderId}`;
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [step, orderId]);

  if (!isOpen || !template) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');
    try {
      const res = await fetch(`${API_URL}/store/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: template.id,
          customerName: name,
          customerEmail: email,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (paymentMethod === 'bri') {
          setVaNumber(data.vaNumber);
        } else {
          setQrString(data.qrString);
        }
        setOrderId(data.orderId);
        setStep('payment');
      } else {
        setStep('error');
      }
    } catch (error) {
      console.error(error);
      setStep('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md border border-[color-mix(in_srgb,var(--text2)_20%,transparent)] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300" style={{ background: "var(--surface)" }}>
        <div className="p-5 border-b border-[color-mix(in_srgb,var(--text2)_20%,transparent)] flex justify-between items-center">
          <h2 className="text-lg font-bold" style={{ color: "var(--text1)" }}>Checkout Template</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-500 hover:text-red-500 transition-colors">
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Form Step */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-6 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                <span className="text-xs uppercase font-semibold tracking-wider" style={{ color: "var(--text2)" }}>Ringkasan Pesanan</span>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-medium" style={{ color: "var(--text1)" }}>{template.title}</span>
                  <span className="font-bold text-[#059669]">Rp {template.price.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium" style={{ color: "var(--text2)" }}>Nama Lengkap</label>
                <input 
                  type="text" required
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-transparent border border-[color-mix(in_srgb,var(--text2)_30%,transparent)] focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                  style={{ color: "var(--text1)" }}
                  placeholder="Masukkan nama Anda"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1 font-medium" style={{ color: "var(--text2)" }}>Alamat Email (Pengiriman File)</label>
                <input 
                  type="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-transparent border border-[color-mix(in_srgb,var(--text2)_30%,transparent)] focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                  style={{ color: "var(--text1)" }}
                  placeholder="contoh@gmail.com"
                />
                <p className="text-xs mt-1.5 opacity-70" style={{ color: "var(--text2)" }}>
                  Pastikan email aktif karena produk digital akan dikirim ke alamat ini.
                </p>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-sm mb-2 font-medium" style={{ color: "var(--text2)" }}>Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center transition-all ${paymentMethod === 'qris' ? 'border-[#b91c1c] bg-[#b91c1c]/10' : 'border-[color-mix(in_srgb,var(--text2)_20%,transparent)]'}`}>
                    <input type="radio" name="paymentMethod" value="qris" className="sr-only" checked={paymentMethod === 'qris'} onChange={() => setPaymentMethod('qris')} />
                    <span className="font-bold text-sm" style={{ color: "var(--text1)" }}>QRIS</span>
                    <span className="text-[10px] opacity-70 text-center" style={{ color: "var(--text2)" }}>Gopay, OVO, Dana, dll</span>
                  </label>
                  <label className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center transition-all ${paymentMethod === 'bri' ? 'border-[#b91c1c] bg-[#b91c1c]/10' : 'border-[color-mix(in_srgb,var(--text2)_20%,transparent)]'}`}>
                    <input type="radio" name="paymentMethod" value="bri" className="sr-only" checked={paymentMethod === 'bri'} onChange={() => setPaymentMethod('bri')} />
                    <span className="font-bold text-sm" style={{ color: "var(--text1)" }}>Transfer BRI</span>
                    <span className="text-[10px] opacity-70 text-center" style={{ color: "var(--text2)" }}>Virtual Account</span>
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-6 py-3 bg-[#b91c1c] text-white rounded-xl font-bold hover:bg-red-700 transition-colors cursor-pointer"
              >
                Bayar dengan {paymentMethod === 'qris' ? 'QRIS' : 'Virtual Account BRI'}
              </button>
            </form>
          )}

          {/* Loading Step */}
          {step === 'loading' && (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-medium" style={{ color: "var(--text2)" }}>Menyiapkan QRIS Anda...</p>
            </div>
          )}

          {/* Payment Step */}
          {step === 'payment' && (
            <div className="flex flex-col items-center py-6">
              <h3 className="text-lg font-bold mb-2 text-center" style={{ color: "var(--text1)" }}>
                {paymentMethod === 'qris' ? 'Bayar dengan QRIS' : 'Transfer Virtual Account BRI'}
              </h3>
              <p className="text-sm text-center mb-6" style={{ color: "var(--text2)" }}>
                {paymentMethod === 'qris' 
                  ? 'Silakan scan kode QR di bawah ini menggunakan aplikasi M-Banking atau E-Wallet Anda.'
                  : 'Silakan transfer ke nomor Virtual Account di bawah ini melalui ATM atau Mobile Banking BRI Anda.'}
              </p>
              
              <div className="bg-white p-4 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] mb-6 flex flex-col justify-center items-center relative w-full sm:w-auto min-h-[150px] min-w-[250px]">
                 {paymentMethod === 'qris' ? (
                   qrString ? (
                     <img src={qrString} alt="QRIS" width={200} height={200} className="block mix-blend-multiply" />
                   ) : (
                     <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-100 text-gray-400">
                       No QR Data
                     </div>
                   )
                 ) : (
                   <div className="flex flex-col items-center justify-center py-4 w-full text-center">
                     <span className="text-gray-500 text-sm mb-2">No. Rekening VA BRI:</span>
                     <span className="text-2xl font-black text-blue-800 tracking-wider font-mono">{vaNumber || 'Memuat...'}</span>
                     <button 
                        onClick={() => navigator.clipboard.writeText(vaNumber)}
                        className="mt-4 px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-semibold cursor-pointer transition-colors"
                     >
                       Copy Nomor VA
                     </button>
                   </div>
                 )}
              </div>
              
              <div className="w-full bg-[#fef3c7] text-[#92400e] text-xs px-4 py-3 rounded-lg flex gap-2 items-center justify-center text-center mb-3">
                 <div className="animate-pulse w-2 h-2 rounded-full bg-[#92400e]"></div>
                 Menunggu konfirmasi pembayaran...
              </div>

              <button 
                onClick={async () => {
                  if (!orderId) return;
                  try {
                    const res = await fetch(`${API_URL}/store/orders/${orderId}/status`);
                    const data = await res.json();
                    if (data.status === 'processing' || data.status === 'paid' || data.status === 'delivered') {
                      window.location.href = `/order/status?id=${orderId}`;
                    } else if (data.status === 'canceled' || data.status === 'failed' || data.status === 'expired' || data.status === 'returned') {
                      window.location.href = `/order/error?id=${orderId}`;
                    } else {
                      alert("Pembayaran belum kami terima. Harap selesaikan pembayaran terlebih dahulu.");
                    }
                  } catch (err) {
                    console.error("Manual check error", err);
                  }
                }}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors cursor-pointer text-sm"
              >
                Cek Transaksi
              </button>
               {/* Tombol Testing (Hanya di mode Development) */}
               {import.meta.env.DEV && (
                 <button
                   onClick={async () => {
                      if (!orderId) return;
                      try {
                        const res = await fetch(`${API_URL}/store/orders/${orderId}/mock-pay`, { method: 'POST' });
                        if (res.ok) {
                          window.location.href = `/order/status?id=${orderId}`;
                        }
                      } catch (err) {
                        console.error("Mock pay error", err);
                      }
                   }}
                   className="mt-6 px-4 py-2 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-300 hover:bg-blue-200 transition-colors"
                 >
                   [DEV ONLY] Simulasikan Pembayaran Berhasil
                 </button>
               )}
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="flex flex-col items-center text-center py-8">
              <div className="w-16 h-16 bg-[#d1fae5] text-[#059669] rounded-full flex items-center justify-center mb-4 text-3xl">
                ✓
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text1)" }}>Pembayaran Berhasil!</h3>
              <p className="mb-6" style={{ color: "var(--text2)" }}>
                Terima kasih atas pesanan Anda. Sistem kami telah memverifikasi pembayaran.
              </p>
              <button 
                onClick={() => {
                  onClose();
                  window.location.href = `/order/status?id=${orderId}`;
                }}
                className="w-full py-3 bg-[#b91c1c] text-white rounded-xl font-bold hover:bg-red-700 transition-colors cursor-pointer shadow-lg shadow-red-500/20"
              >
                Lihat Invoice & Download
              </button>
            </div>
          )}

          {/* Error Step */}
          {step === 'error' && (
             <div className="flex flex-col items-center text-center py-8">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 text-3xl">
                ✕
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text1)" }}>Terjadi Kesalahan</h3>
              <p className="mb-6" style={{ color: "var(--text2)" }}>
                Maaf, kami tidak dapat memproses permintaan Anda saat ini. Silakan coba lagi nanti.
              </p>
              <button 
                onClick={() => setStep('form')}
                className="w-full py-3 border border-[#b91c1c] text-[#b91c1c] rounded-xl font-bold hover:bg-red-50 transition-colors cursor-pointer"
              >
                Coba Lagi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
