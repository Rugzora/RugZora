"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        router.push("/login?redirect=/account");
        return;
      }

      const currentUser = session.user;
      setUser(currentUser);

      // Fetch Orders:
      // 1. Check local storage orders
      let localOrders: any[] = [];
      try {
        localOrders = JSON.parse(localStorage.getItem("rugzora_orders") || "[]");
      } catch (e) {
        localOrders = [];
      }

      // 2. Fetch server-side orders from site_content orders_list
      let serverOrders: any[] = [];
      try {
        const { data: serverData } = await supabase
          .from("site_content")
          .select("data")
          .eq("id", "orders_list")
          .maybeSingle();

        if (serverData?.data?.list && Array.isArray(serverData.data.list)) {
          serverOrders = serverData.data.list.filter(
            (o: any) =>
              o.customer_email?.toLowerCase() === currentUser.email?.toLowerCase() ||
              o.user_id === currentUser.id
          );
        }
      } catch (e) {
        // Fallback to local
      }

      // Combine orders, avoid duplicates by id
      const orderMap = new Map();
      [...localOrders, ...serverOrders].forEach((ord) => {
        if (ord && ord.id) {
          // If order has email matching user, or placed recently locally
          if (
            !ord.customer_email ||
            ord.customer_email.toLowerCase() === currentUser.email?.toLowerCase() ||
            ord.user_id === currentUser.id
          ) {
            orderMap.set(ord.id, ord);
          }
        }
      });

      const combined = Array.from(orderMap.values()).sort(
        (a: any, b: any) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );

      setOrders(combined);
      setIsLoading(false);
    };

    fetchUserAndOrders();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] pt-16 pb-20 text-center text-[#C19A6B] font-serif text-lg animate-pulse">
        Loading Your Account...
      </div>
    );
  }

  if (!user) return null;

  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Valued Patron";

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "2026";

  return (
    <div className="bg-[#F8F5F0] min-h-screen pt-8 sm:pt-12 md:pt-14 pb-20 font-sans">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* HEADER PROFILE BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-10 border border-[#EBE5DA] rounded-sm shadow-sm mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#EBE5DA] text-[#C19A6B] flex items-center justify-center font-serif text-2xl font-bold uppercase shadow-inner">
              {fullName.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C19A6B] font-bold block">
                RugZora Patron
              </span>
              <h1 className="text-2xl md:text-3xl font-serif text-[#3A332C]">{fullName}</h1>
              <p className="text-xs text-[#7A7065] mt-1">
                {user.email} • Member since {memberSince}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/wishlist"
              className="px-5 py-2.5 text-xs uppercase tracking-wider font-semibold border border-[#DFD8CC] text-[#3A332C] hover:border-[#C19A6B] hover:text-[#C19A6B] transition-colors rounded-sm"
            >
              My Wishlist
            </Link>
            <button
              onClick={handleSignOut}
              className="px-5 py-2.5 text-xs uppercase tracking-wider font-semibold bg-[#3A332C] text-[#F8F5F0] hover:bg-red-700 transition-colors rounded-sm shadow-sm"
            >
              Sign Out
            </button>
          </div>
        </motion.div>

        {/* TABS NAVIGATION */}
        <div className="flex gap-4 border-b border-[#DFD8CC] mb-8">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 text-xs uppercase tracking-widest font-bold transition-all relative ${
              activeTab === "orders" ? "text-[#3A332C]" : "text-[#8C7A63] hover:text-[#3A332C]"
            }`}
          >
            Order History ({orders.length})
            {activeTab === "orders" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C19A6B]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 text-xs uppercase tracking-widest font-bold transition-all relative ${
              activeTab === "profile" ? "text-[#3A332C]" : "text-[#8C7A63] hover:text-[#3A332C]"
            }`}
          >
            Profile Information
            {activeTab === "profile" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C19A6B]" />
            )}
          </button>
        </div>

        {/* TAB CONTENT: ORDERS */}
        {activeTab === "orders" && (
          <div>
            {orders.length === 0 ? (
              <div className="bg-white p-12 border border-[#EBE5DA] rounded-sm text-center">
                <div className="w-16 h-16 bg-[#F8F5F0] text-[#C19A6B] rounded-full mx-auto flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-[#3A332C] mb-2">No Orders Placed Yet</h3>
                <p className="text-[#7A7065] text-xs max-w-md mx-auto mb-6">
                  You haven&apos;t placed any orders yet. Discover our collection of hand-braided rPET
                  luxury carpets or create your bespoke design.
                </p>
                <div className="flex justify-center gap-4">
                  <Link
                    href="/collections"
                    className="bg-[#3A332C] text-white px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#C19A6B] transition-colors rounded-sm"
                  >
                    Explore Collections
                  </Link>
                  <Link
                    href="/customize"
                    className="border border-[#3A332C] text-[#3A332C] px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#3A332C] hover:text-white transition-colors rounded-sm"
                  >
                    Bespoke Studio
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const orderDate = order.created_at
                    ? new Date(order.created_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Recent";

                  return (
                    <div
                      key={order.id}
                      className="bg-white border border-[#EBE5DA] rounded-sm shadow-sm overflow-hidden"
                    >
                      {/* Order Header */}
                      <div className="p-6 bg-[#F8F5F0]/60 border-b border-[#EBE5DA] flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-[#8C7A63] block font-bold">
                              Order ID
                            </span>
                            <span className="text-sm font-semibold text-[#3A332C] font-mono">
                              #{order.id}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-[#8C7A63] block font-bold">
                              Date Placed
                            </span>
                            <span className="text-xs text-[#3A332C] font-medium">{orderDate}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-[#8C7A63] block font-bold">
                              Total
                            </span>
                            <span className="text-sm font-bold text-[#3A332C]">
                              {order.display_total || `₹${order.total || 0}`}
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm">
                            {order.order_status || "Processing at Loom"}
                          </span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-6 divide-y divide-[#EBE5DA]">
                        {Array.isArray(order.items) &&
                          order.items.map((item: any, idx: number) => (
                            <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                              <div className="w-16 h-16 bg-[#DFD8CC] rounded-sm overflow-hidden relative shrink-0">
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.name || "Carpet"}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#8C7A63] text-xs">
                                    Rug
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-serif font-medium text-[#3A332C]">
                                  {item.name}
                                </h4>
                                <div className="text-xs text-[#7A7065] mt-0.5">
                                  <span>Size: {item.size}</span>
                                  {item.isCustom && (
                                    <span className="ml-2 text-[#C19A6B] font-semibold">
                                      (Custom Bespoke)
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-[#8C7A63] mt-1">
                                  Quantity: {item.quantity || 1}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* Delivery Summary */}
                      {order.shipping_address && (
                        <div className="px-6 py-4 bg-[#F8F5F0]/40 border-t border-[#EBE5DA] text-xs text-[#7A7065] flex flex-wrap justify-between items-center gap-2">
                          <div>
                            <span className="font-semibold text-[#3A332C]">Deliver To: </span>
                            {order.shipping_address.firstName} {order.shipping_address.lastName},{" "}
                            {order.shipping_address.city}, {order.shipping_address.country}
                          </div>
                          <div className="text-[11px] text-[#8C7A63]">
                            Payment: {order.payment_method || "Online"}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: PROFILE DETAILS */}
        {activeTab === "profile" && (
          <div className="bg-white p-8 md:p-10 border border-[#EBE5DA] rounded-sm shadow-sm max-w-2xl">
            <h3 className="text-xl font-serif text-[#3A332C] mb-6">Account Information</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8C7A63] font-bold mb-1">
                  Full Name
                </label>
                <div className="p-3.5 bg-[#F8F5F0] border border-[#DFD8CC] text-sm text-[#3A332C] rounded-sm">
                  {fullName}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8C7A63] font-bold mb-1">
                  Email Address
                </label>
                <div className="p-3.5 bg-[#F8F5F0] border border-[#DFD8CC] text-sm text-[#3A332C] rounded-sm">
                  {user.email}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8C7A63] font-bold mb-1">
                  User ID
                </label>
                <div className="p-3.5 bg-[#F8F5F0] border border-[#DFD8CC] text-xs font-mono text-[#7A7065] rounded-sm truncate">
                  {user.id}
                </div>
              </div>

              <div className="pt-4 border-t border-[#DFD8CC]">
                <span className="text-xs text-[#7A7065]">
                  Need to update your delivery address or contact preferences? Contact our Bhadohi atelier concierge at{" "}
                  <a href="mailto:rugzora@gmail.com" className="text-[#C19A6B] underline font-semibold">
                    rugzora@gmail.com
                  </a>
                  .
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
