import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Lock, Download, CheckCircle, 
  AlertCircle, ArrowRight, BookOpen, Clock, FileText, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessChime } from '../utils/audioSynthesis';

export default function CheckoutModal({ 
  book, 
  books, 
  isOpen, 
  onClose, 
  onSuccess 
}) {
  const [customerName, setCustomerName] = useState('Alexander Sterling');
  const [customerEmail, setCustomerEmail] = useState('reader@aetheria.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderResult, setOrderResult] = useState(null); // Verified paid order with download tokens
  const [config, setConfig] = useState({ isTestMode: true, razorpayKeyId: 'rzp_test_placeholder' });

  const activeBooks = books || (book ? [book] : []);
  const totalINR = activeBooks.reduce((acc, b) => acc + b.priceINR, 0);

  // Fetch server config on mount
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch(() => {
        // Fallback if proxy not connected yet
        setConfig({ isTestMode: true, razorpayKeyId: 'rzp_test_mock_mode' });
      });

    // Load Razorpay Checkout SDK script
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (!isOpen || activeBooks.length === 0) return null;

  const handleInitiatePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage('');

    try {
      // 1. Authoritative server order creation
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookIds: activeBooks.map((b) => b.id),
          customerName,
          customerEmail,
        }),
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        throw new Error(errorData.error || 'Server rejected order creation');
      }

      const serverOrder = await orderRes.json();

      // Check if real Razorpay SDK is available and keys are configured
      const hasLiveRazorpay =
        window.Razorpay &&
        serverOrder.keyId &&
        !serverOrder.keyId.includes('placeholder') &&
        !serverOrder.keyId.includes('mock');

      if (hasLiveRazorpay) {
        // Launch standard Razorpay Checkout Modal
        const options = {
          key: serverOrder.keyId,
          amount: serverOrder.amountPaise,
          currency: 'INR',
          name: 'AETHERIA Privé Editions',
          description: `Acquisition of ${activeBooks.map(b => b.title).join(', ')}`,
          order_id: serverOrder.orderId,
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone,
          },
          theme: {
            color: '#c5a059',
          },
          handler: async function (response) {
            await verifyPaymentOnServer({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          setErrorMessage(`Payment failed: ${resp.error.description}`);
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        // Test mode cryptographic simulation
        // The server verifies the order idempotently without requiring merchant bank KYC
        setTimeout(async () => {
          await verifyPaymentOnServer({
            razorpay_order_id: serverOrder.orderId,
            razorpay_payment_id: `pay_test_${Math.random().toString(36).slice(2, 10)}`,
            razorpay_signature: `sig_test_${Math.random().toString(36).slice(2, 14)}`,
          });
        }, 1200);
      }
    } catch (err) {
      console.error('Payment initiation error:', err);
      setErrorMessage(err.message || 'Payment initiation failed. Please check network connection.');
      setIsProcessing(false);
    }
  };

  const verifyPaymentOnServer = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    try {
      const verifyRes = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          customerName,
          customerEmail,
        }),
      });

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json();
        throw new Error(errorData.error || 'Signature verification rejected by server.');
      }

      const verifyData = await verifyRes.json();
      setOrderResult(verifyData.order);
      setIsProcessing(false);
      playSuccessChime();

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c5a059', '#e5d5a8', '#0ea5e9', '#ffffff'],
      });

      if (onSuccess) onSuccess(verifyData.order);
    } catch (err) {
      setErrorMessage(err.message || 'Verification failed on server.');
      setIsProcessing(false);
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="Secure Razorpay Checkout"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0c0e14] border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden my-6">
        
        {/* Header */}
        <header className="p-6 border-b border-white/10 flex items-center justify-between bg-[#07080a]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#c5a059]" />
            <h2 className="text-base sm:text-lg font-display font-bold text-white tracking-wide">
              {orderResult ? 'ACQUISITION CONFIRMED' : 'RAZORPAY VERIFIED CHECKOUT'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Content */}
        {!orderResult ? (
          <form onSubmit={handleInitiatePayment} className="p-6 sm:p-8 space-y-6">
            
            {/* Authoritative Order Summary */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#c5a059] font-bold block">
                AUTHORITATIVE ORDER SUMMARY ({activeBooks.length} {activeBooks.length === 1 ? 'EDITION' : 'EDITIONS'})
              </span>
              <div className="divide-y divide-white/5 text-xs">
                {activeBooks.map((b) => (
                  <div key={b.id} className="py-2.5 flex justify-between items-center text-slate-200">
                    <div>
                      <span className="font-bold text-white block">{b.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">PDF + EPUB Master License</span>
                    </div>
                    <span className="font-mono text-[#c5a059] font-bold shrink-0 text-sm">
                      ₹{b.priceINR}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline text-sm font-bold text-white">
                <span>Total Settlement:</span>
                <span className="text-2xl font-display font-extrabold text-[#c5a059]">
                  ₹{totalINR}
                </span>
              </div>
            </div>

            {/* Test Mode / Gateway Status Notice */}
            <div className="p-3.5 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/30 text-xs font-mono text-[#dfc079] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#c5a059]" />
              <div>
                <strong className="block font-bold">Indian Payment Gateway: Razorpay Checkout</strong>
                <span className="text-[11px] opacity-90 leading-relaxed block mt-0.5">
                  Operating in secure sandbox test mode. Secret keys remain strictly on the server. Digital signatures are cryptographically verified before issuance of expiring download tokens.
                </span>
              </div>
            </div>

            {/* Customer Inputs */}
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">
                  FULL NAME (PRINTED ON SOVEREIGN LICENSE)
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#c5a059] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono text-slate-300 block mb-1">
                    DELIVERY EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-[#c5a059] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-300 block mb-1">
                    MOBILE NUMBER (FOR SMS INVOICE)
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-[#c5a059] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-[#c5a059] hover:bg-[#d4af37] text-[#07080a] font-bold text-xs tracking-wider transition-all shadow-[0_0_25px_rgba(197,160,89,0.35)] flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#07080a] border-t-transparent rounded-full animate-spin" />
                  <span>COMMUNICATING WITH RAZORPAY GATEWAY...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>PROCEED TO PAYMENT — ₹{totalINR}</span>
                </>
              )}
            </button>

            {/* Mandatory Legal & Consumer Protection Policies */}
            <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-slate-400 text-center space-y-1">
              <p>🔒 256-Bit Encrypted Settlement • 30-Day Unconditional Refund Policy</p>
              <p>Instant digital delivery via expiring cryptographic token. Questions? support@aetheria.com</p>
            </div>

          </form>
        ) : (
          /* Order Verified & Instant Download Vault */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white">
                Payment Verified & License Issued
              </h3>
              <p className="text-xs text-slate-300 font-light max-w-md mx-auto">
                Thank you, <strong>{orderResult.customerName}</strong>. Your payment of <strong>₹{orderResult.amountINR}</strong> was authenticated via signature verification.
              </p>
            </div>

            {/* Transaction Receipt Box */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span>Order Reference:</span>
                <span className="text-white font-bold">{orderResult.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Reference:</span>
                <span className="text-emerald-400 font-bold">{orderResult.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span>Licensed To:</span>
                <span className="text-white">{orderResult.customerEmail}</span>
              </div>
            </div>

            {/* Secure Expiring Download Portal */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#c5a059] font-bold block">
                AUTHORIZED SECURE DIGITAL DOWNLOADS (EXPIRES IN 24 HOURS):
              </span>

              {orderResult.downloads.map((item) => (
                <div 
                  key={item.bookId}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#c5a059]/20 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        Print-Grade PDF Master with Personalized Cryptographic Watermark
                      </span>
                    </div>
                  </div>

                  <a
                    href={item.downloadUrl}
                    download
                    className="px-4 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d4af37] text-[#07080a] font-bold text-xs tracking-wider transition flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DOWNLOAD MASTER PDF</span>
                  </a>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl border border-white/20 hover:border-white/40 text-slate-300 hover:text-white font-mono text-xs transition"
            >
              RETURN TO ATELIER
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
