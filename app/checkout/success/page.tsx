"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    // Try finding order in localStorage
    try {
      const orders = JSON.parse(localStorage.getItem("rugzora_orders") || "[]");
      const found = orders.find((o: any) => o.id === orderId);
      if (found) {
        setOrder(found);
      }
    } catch (e) {
      // Ignored
    }
    setIsLoading(false);
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] pt-40 pb-40 text-center text-[#C19A6B] font-serif text-lg animate-pulse">
        Retrieving Order Manifest...
      </div>
    );
  }

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  const deliveryFormatted = deliveryDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-[#F8F5F0] min-h-screen pt-32 pb-24 font-sans">
      <div className="max-w-[900px] mx-auto px-6">
        
        {/* CELEBRATION HEADER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 md:p-12 border border-[#EBE5DA] shadow-xl rounded-sm text-center mb-10"
        >
          <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full mx-auto flex items-center justify-center mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <span className="text-xs uppercase tracking-[0.25em] text-[#C19A6B] font-bold block mb-2">
            Bespoke Loom Order Confirmed
          </span>
          <h1 className="text-3xl md:text-4xl font-serif text-[#3A332C] mb-3">
            Thank You For Your Patronage!
          </h1>
          <p className="text-sm text-[#7A7065] max-w-lg mx-auto mb-6 leading-relaxed">
            Your handcrafted carpet commission has been registered with our Bhadohi atelier. Our master weavers
            are preparing your loom specifications.
          </p>

          <div className="inline-flex items-center gap-3 bg-[#F8F5F0] px-6 py-3 border border-[#DFD8CC] rounded-sm text-xs text-[#3A332C]">
            <span className="text-[#8C7A63] uppercase tracking-wider font-semibold">Order Reference:</span>
            <span className="font-mono font-bold text-sm text-[#C19A6B]">
              #{orderId || "RZ-CONFIRMED"}
            </span>
          </div>

          {/* ARTISAN TIMELINE */}
          <div className="mt-12 pt-8 border-t border-[#DFD8CC]">
            <span className="text-[11px] uppercase tracking-widest text-[#8C7A63] font-bold block mb-6">
              Commission Progress
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-sm">
                <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs mx-auto mb-2">
                  ✓
                </span>
                <span className="text-xs font-bold text-emerald-900 block">Order Placed</span>
                <span className="text-[10px] text-emerald-700">Payment Secured</span>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-300 rounded-sm ring-1 ring-amber-400">
                <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs mx-auto mb-2 animate-pulse">
                  2
                </span>
                <span className="text-xs font-bold text-amber-900 block">Artisan Braiding</span>
                <span className="text-[10px] text-amber-700">Looming in Bhadohi</span>
              </div>

              <div className="p-4 bg-[#F8F5F0] border border-[#DFD8CC] rounded-sm opacity-60">
                <span className="w-6 h-6 bg-[#DFD8CC] text-[#7A7065] rounded-full flex items-center justify-center text-xs mx-auto mb-2">
                  3
                </span>
                <span className="text-xs font-bold text-[#3A332C] block">Zigzag Finish</span>
                <span className="text-[10px] text-[#8C7A63]">Quality Inspection</span>
              </div>

              <div className="p-4 bg-[#F8F5F0] border border-[#DFD8CC] rounded-sm opacity-60">
                <span className="w-6 h-6 bg-[#DFD8CC] text-[#7A7065] rounded-full flex items-center justify-center text-xs mx-auto mb-2">
                  4
                </span>
                <span className="text-xs font-bold text-[#3A332C] block">Dispatched</span>
                <span className="text-[10px] text-[#8C7A63]">Est: {deliveryFormatted}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ORDER DETAILS CARD (IF FOUND) */}
        {order && (
          <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm mb-10">
            <h2 className="text-sm uppercase tracking-widest text-[#3A332C] font-bold pb-3 border-b border-[#DFD8CC] mb-6">
              Commission Items & Destination
            </h2>

            {/* Items */}
            <div className="divide-y divide-[#EBE5DA] mb-6">
              {Array.isArray(order.items) &&
                order.items.map((item: any, idx: number) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#DFD8CC] rounded-sm overflow-hidden relative shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-serif font-medium text-[#3A332C]">{item.name}</h4>
                      <div className="text-xs text-[#7A7065] mt-0.5">
                        <span>Size: {item.size}</span>
                        {item.isCustom && (
                          <span className="ml-2 text-[#C19A6B] font-bold">(Custom Bespoke)</span>
                        )}
                      </div>
                      <div className="text-xs text-[#8C7A63] mt-1">Qty: {item.quantity || 1}</div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#DFD8CC] text-xs text-[#7A7065]">
              {order.shipping_address && (
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#3A332C] block mb-2">
                    Delivering To:
                  </span>
                  <p className="leading-relaxed">
                    {order.shipping_address.firstName} {order.shipping_address.lastName}
                    <br />
                    {order.shipping_address.address}
                    {order.shipping_address.apartment && `, ${order.shipping_address.apartment}`}
                    <br />
                    {order.shipping_address.city}, {order.shipping_address.state}{" "}
                    {order.shipping_address.postalCode}
                    <br />
                    {order.shipping_address.country}
                  </p>
                </div>
              )}

              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#3A332C] block mb-2">
                  Payment & Delivery:
                </span>
                <p className="leading-relaxed">
                  <strong>Total Paid:</strong> {order.display_total || `₹${order.total || 0}`}
                  <br />
                  <strong>Payment Method:</strong> {order.payment_method}
                  <br />
                  <strong>Service:</strong> {order.shipping_method}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/collections"
            className="bg-[#3A332C] text-[#F8F5F0] px-8 py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#C19A6B] transition-colors rounded-sm shadow-md"
          >
            Explore More Collections
          </Link>
          <Link
            href="/account"
            className="border border-[#3A332C] text-[#3A332C] px-8 py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#3A332C] hover:text-white transition-colors rounded-sm"
          >
            Go to My Account
          </Link>
          <button
            onClick={() => window.print()}
            className="border border-[#DFD8CC] text-[#7A7065] px-6 py-4 text-xs tracking-wider uppercase font-semibold hover:border-[#3A332C] hover:text-[#3A332C] transition-colors rounded-sm"
          >
            Print Receipt
          </button>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F5F0] pt-40 pb-40 text-center text-[#C19A6B] font-serif text-lg animate-pulse">
          Loading Confirmation...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
