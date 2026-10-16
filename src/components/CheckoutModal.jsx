import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Lock, Download, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessChime } from '../utils/audioSynthesis';

export default function CheckoutModal({ books, isOpen, onClose, onSuccess }) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderResult, setOrderResult] = useState(null);
  const [rzpConfig, setRzpConfig] = useState(null);

  // Fetch server configuration
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => setRzpConfig(data))
      .catch((err) => console.error('Failed to load server config:', err));
  }, []);

  if (!isOpen || !books || books.length === 0) return null;

  const totalINR = books.reduce((acc, b) => acc + b.priceINR, 0);

  // Initiate Authoritative Checkout
  const handleInitiatePayment = async (e) => {
    e.preventDefault();
    if (!customerEmail || !customerName) {
      setErrorMessage('Please provide both your name and delivery email.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // 1. Authoritative Server Order Creation (Server prices only)
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookIds: books.map((b) => b.id),
          customerName,
          customerEmail,
        }),
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        throw new Error(errorData.error || 'Server rejected order creation');
      }

      const serverOrder = await orderRes.json();

      // Check if real Razorpay SDK is available
      if (window.Razorpay && rzpConfig && !rzpConfig.isTestMode) {
        const options = {
          key: serverOrder.keyId,
          amount: serverOrder.amountPaise,
          currency: 'INR',
          name: 'AETHERIA Privé Editions',
          description: `Acquisition of ${books.length} publication(s)`,
          order_id: serverOrder.orderId,
          prefill: {
            name: customerName,
            email: customerEmail,
          },
          theme: {
            color: '#1d1d1f',
          },
          handler: async function (response) {
            await verifyPaymentOnServer(response);
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setErrorMessage(response.error?.description || 'Payment execution failed');
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        // Deterministic Test-Mode Simulation
        setTimeout(async () => {
          await verifyPaymentOnServer({
            razorpay_order_id: serverOrder.orderId,
            razorpay_payment_id: `pay_test_${Math.random().toString(36).slice(2, 10)}`,
            razorpay_signature: `sig_test_${Math.random().toString(36).slice(2, 14)}`,
          });
        }, 1000);
      }
    } catch (err) {
      console.error('Payment initiation error:', err);
      setErrorMessage(err.message || 'Payment initiation failed.');
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

      localStorage.setItem('aetheria_customer_email', customerEmail);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c5a059', '#1d1d1f', '#0071e3', '#10b981'],
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-black/10 shadow-2xl overflow-hidden my-6 text-[#1d1d1f]">
        
        {/* Header */}
        <header className="p-6 border-b border-black/10 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#997328]" />
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#1d1d1f] tracking-wide">
              {orderResult ? 'ACQUISITION CONFIRMED' : 'SECURE RAZORPAY CHECKOUT'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-gray-100 transition"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Content */}
        {!orderResult ? (
          <form onSubmit={handleInitiatePayment} className="p-6 sm:p-8 space-y-6">
            
            {/* Order Items Overview */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#997328] font-bold block">
                ORDER SUMMARY ({books.length} {books.length === 1 ? 'EDITION' : 'EDITIONS'}):
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {books.map((b) => (
                  <div key={b.id} className="flex justify-between items-center p-3 rounded-xl bg-[#f5f5f7] border border-black/5 text-xs">
                    <div>
                      <h4 className="font-serif font-bold text-[#1d1d1f]">{b.title}</h4>
                      <span className="text-[10px] font-mono text-[#6e6e73]">
                        {b.pages} Pages • Vector PDF + Universal EPUB Master
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[#1d1d1f]">₹{b.priceINR}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Display */}
            <div className="p-4 rounded-xl bg-[#f5f5f7] border border-black/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-[#6e6e73] block">Authoritative Total</span>
                <span className="text-[10px] font-mono text-emerald-700 font-medium">All single editions priced under ₹500</span>
              </div>
              <span className="text-2xl font-serif font-bold text-[#1d1d1f]">
                ₹{totalINR}
              </span>
            </div>

            {/* Customer Information Inputs */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6e6e73] block">
                LICENSEE CREDENTIALS:
              </span>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#6e6e73] mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#f5f5f7] border border-black/10 focus:border-[#997328] rounded-xl px-4 py-2.5 text-xs text-[#1d1d1f] placeholder-[#86868b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#6e6e73] mb-1">Fulfillment Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. patron@aetheria.luxury"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-[#f5f5f7] border border-black/10 focus:border-[#997328] rounded-xl px-4 py-2.5 text-xs text-[#1d1d1f] placeholder-[#86868b] focus:outline-none"
                  />
                  <span className="text-[10px] font-mono text-[#86868b] mt-1 block">
                    Cryptographic master download tokens and transaction receipt will be sent here.
                  </span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-[#1d1d1f] hover:bg-black text-white font-bold text-xs font-mono tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>COMMUNICATING WITH RAZORPAY GATEWAY...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#c5a059]" />
                  <span>PROCEED TO PAYMENT — ₹{totalINR}</span>
                </>
              )}
            </button>

            {/* Legal Policies Notice */}
            <div className="pt-2 border-t border-black/5 text-[10px] font-mono text-[#86868b] text-center space-y-1">
              <p>🔒 256-Bit Encrypted Settlement • 30-Day Digital Evaluation Policy</p>
              <p>Instant digital delivery via expiring cryptographic token. Contact: support@aetheria.luxury</p>
            </div>

          </form>
        ) : (
          /* Order Verified & Instant Download Vault */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#1d1d1f]">
                Payment Verified & License Issued
              </h3>
              <p className="text-xs text-[#515154] font-sans max-w-md mx-auto">
                Thank you, <strong>{orderResult.customerName}</strong>. Your payment of <strong>₹{orderResult.amountINR}</strong> was authenticated via cryptographic signature verification.
              </p>
            </div>

            {/* Transaction Receipt Box */}
            <div className="p-4 rounded-xl bg-[#f5f5f7] border border-black/10 text-xs font-mono space-y-1 text-[#515154]">
              <div className="flex justify-between">
                <span>Order Reference:</span>
                <span className="text-[#1d1d1f] font-bold">{orderResult.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Reference:</span>
                <span className="text-emerald-700 font-bold">{orderResult.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span>Licensed To:</span>
                <span className="text-[#1d1d1f]">{orderResult.customerEmail}</span>
              </div>
            </div>

            {/* Secure Expiring Download Portal */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#997328] font-bold block">
                AUTHORIZED SECURE DIGITAL DOWNLOADS (EXPIRES IN 24 HOURS):
              </span>

              {orderResult.downloads.map((item) => (
                <div 
                  key={item.bookId}
                  className="p-4 rounded-xl bg-[#f5f5f7] border border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-black/10 flex items-center justify-center text-[#997328] shrink-0 shadow-xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-serif font-bold text-[#1d1d1f]">{item.title}</h4>
                      <span className="text-[10px] font-mono text-[#6e6e73]">
                        Personalized DRM-Free Cryptographic Master
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={item.downloadUrl}
                      download
                      className="px-3 py-1.5 rounded-lg bg-[#1d1d1f] hover:bg-black text-white font-mono font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>PDF</span>
                    </a>

                    <a
                      href={item.downloadEpubUrl}
                      download
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-100 text-[#1d1d1f] border border-black/10 font-mono font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-700" />
                      <span>EPUB</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl border border-black/10 hover:bg-gray-100 text-[#1d1d1f] font-mono text-xs font-bold transition"
            >
              RETURN TO ATELIER
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
