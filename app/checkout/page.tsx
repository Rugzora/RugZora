"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const router = useRouter();

  // State
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [currency, setCurrency] = useState("USD");
  const [globalUsdRate, setGlobalUsdRate] = useState<number>(83.5);

  // Form Fields
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");

  // Card details state (for mock/client card entry)
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [upiId, setUpiId] = useState("");

  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // 1. Get Currency & Rate
    const savedCurrency = localStorage.getItem("user_currency") || "USD";
    setCurrency(savedCurrency);

    supabase
      .from("store_settings")
      .select("usd_rate")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.usd_rate) setGlobalUsdRate(parseFloat(data.usd_rate));
      });

    // 2. Check Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setEmail(session.user.email || "");
        const nameParts = (session.user.user_metadata?.full_name || "").split(" ");
        if (nameParts[0]) setFirstName(nameParts[0]);
        if (nameParts.length > 1) setLastName(nameParts.slice(1).join(" "));
      }
    });

    // 3. Load Cart
    try {
      const items = JSON.parse(localStorage.getItem("rugzora_cart") || "[]");
      setCartItems(items);
    } catch (e) {
      setCartItems([]);
    }
    setIsLoaded(true);
  }, []);

  // Total Calculations
  const cartSubtotalINR = cartItems.reduce((total, item) => {
    const numericInr = parseFloat((item.price || "0").toString().replace(/[^0-9.]/g, ""));
    return total + (isNaN(numericInr) ? 0 : numericInr * (item.quantity || 1));
  }, 0);

  const shippingCostINR = shippingMethod === "express" ? 2000 : 0;
  const grandTotalINR = cartSubtotalINR + shippingCostINR;

  const formatPrice = (amountINR: number) => {
    const relativeRates: Record<string, number> = {
      USD: 1.0,
      EUR: 0.92,
      GBP: 0.79,
      CAD: 1.36,
      AUD: 1.53,
      INR: globalUsdRate,
    };
    const targetRate = relativeRates[currency] || 1;
    const converted = (amountINR / globalUsdRate) * targetRate;
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      CAD: "CA$",
      AUD: "AU$",
      INR: "₹",
    };
    return `${symbols[currency] || "$"}${converted.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !phone || !firstName || !lastName || !address || !city || !postalCode) {
      setErrorMessage("Please fill in all mandatory shipping and contact details.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (paymentMethod === "card") {
      if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
        setErrorMessage("Please fill in your card details to complete payment.");
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!upiId.trim()) {
        setErrorMessage("Please provide a valid UPI ID (e.g. name@okaxis).");
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const orderId = `RZ-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = {
      id: orderId,
      created_at: new Date().toISOString(),
      user_id: user?.id || null,
      customer_name: `${firstName.trim()} ${lastName.trim()}`,
      customer_email: email.trim(),
      customer_phone: phone.trim(),
      shipping_address: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        address: address.trim(),
        apartment: apartment.trim(),
        city: city.trim(),
        state: stateName.trim(),
        postalCode: postalCode.trim(),
        country,
      },
      shipping_method: shippingMethod === "express" ? "Express Priority Courier" : "Complimentary White-Glove Delivery",
      payment_method:
        paymentMethod === "card"
          ? `Card ending in ${cardNumber.slice(-4) || "XXXX"}`
          : paymentMethod === "upi"
          ? `UPI (${upiId})`
          : "Cash on Delivery (COD)",
      items: cartItems,
      subtotal: cartSubtotalINR,
      shipping_fee: shippingCostINR,
      total: grandTotalINR,
      display_total: formatPrice(grandTotalINR),
      currency,
      order_status: "Confirmed",
      order_notes: orderNotes.trim(),
    };

    try {
      // 1. Try insert into orders table (if table exists)
      try {
        await supabase.from("orders").insert(newOrder);
      } catch (err) {
        // Table might not exist yet, fallback to site_content
      }

      // 2. Persist to site_content orders_list
      try {
        const { data: existingData } = await supabase
          .from("site_content")
          .select("data")
          .eq("id", "orders_list")
          .maybeSingle();

        const currentList = Array.isArray(existingData?.data?.list) ? existingData.data.list : [];
        const updatedList = [newOrder, ...currentList];

        await supabase.from("site_content").upsert({
          id: "orders_list",
          data: { list: updatedList },
        });
      } catch (err) {
        console.error("Order server persistence notice:", err);
      }

      // 3. Save to localStorage orders history
      const localOrders = JSON.parse(localStorage.getItem("rugzora_orders") || "[]");
      localOrders.unshift(newOrder);
      localStorage.setItem("rugzora_orders", JSON.stringify(localOrders));

      // 4. Clear Shopping Bag
      localStorage.removeItem("rugzora_cart");
      window.dispatchEvent(new Event("cart_updated"));

      // 5. Redirect to Success Page
      router.push(`/checkout/success?orderId=${orderId}`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Could not finalize your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] pt-40 pb-40 text-center text-[#C19A6B] font-serif text-lg animate-pulse">
        Initializing Checkout Atelier...
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] pt-40 pb-32 px-6 flex flex-col items-center justify-center text-center font-sans">
        <div className="w-20 h-20 bg-[#EBE5DA] rounded-full flex items-center justify-center text-[#C19A6B] mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="text-3xl font-serif text-[#3A332C] mb-3">Your Cart is Empty</h1>
        <p className="text-[#7A7065] text-sm max-w-md mb-8">
          You need at least one rug in your shopping bag before proceeding to checkout.
        </p>
        <div className="flex gap-4">
          <Link
            href="/collections"
            className="bg-[#3A332C] text-[#F8F5F0] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#C19A6B] transition-colors rounded-sm shadow-sm"
          >
            Shop Collections
          </Link>
          <Link
            href="/customize"
            className="border border-[#3A332C] text-[#3A332C] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#3A332C] hover:text-white transition-colors rounded-sm"
          >
            Bespoke Studio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F5F0] min-h-screen pt-32 pb-24 font-sans">
      <div className="max-w-[1300px] mx-auto px-6">
        
        {/* TOP BREADCRUMB */}
        <div className="flex items-center justify-between border-b border-[#DFD8CC] pb-6 mb-10">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#C19A6B] font-bold block mb-1">
              Secure Checkout
            </span>
            <h1 className="text-3xl font-serif text-[#3A332C]">Finalize Your Order</h1>
          </div>
          {!user && (
            <div className="text-xs text-[#7A7065]">
              Already a patron?{" "}
              <Link
                href="/login?redirect=/checkout"
                className="text-[#C19A6B] font-bold uppercase tracking-wider underline hover:text-[#3A332C]"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm leading-relaxed">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-12">
          
          {/* LEFT: CHECKOUT FORM DETAILS */}
          <div className="w-full lg:w-7/12 space-y-10">
            
            {/* 1. CONTACT INFO */}
            <div className="bg-white p-5 sm:p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-base uppercase tracking-widest text-[#3A332C] font-bold mb-6 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#3A332C] text-white flex items-center justify-center text-xs">
                  1
                </span>
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8C7A63] font-bold mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patron@example.com"
                    className="w-full bg-[#F8F5F0] border border-[#DFD8CC] p-3 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] rounded-sm"
                  />
                  <span className="text-[10px] text-[#8C7A63] mt-1 block">
                    Order confirmation & dispatch tracking will be sent here.
                  </span>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8C7A63] font-bold mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#F8F5F0] border border-[#DFD8CC] p-3 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] rounded-sm"
                  />
                  <span className="text-[10px] text-[#8C7A63] mt-1 block">
                    For courier delivery coordination.
                  </span>
                </div>
              </div>
            </div>

            {/* 2. SHIPPING ADDRESS */}
            <div className="bg-white p-5 sm:p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-base uppercase tracking-widest text-[#3A332C] font-bold mb-6 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#3A332C] text-white flex items-center justify-center text-xs">
                  2
                </span>
                Shipping Address
              </h2>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8C7A63] font-bold mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Aarav"
                      className="w-full bg-[#F8F5F0] border border-[#DFD8CC] p-3 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8C7A63] font-bold mb-1.5">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Sharma"
                      className="w-full bg-[#F8F5F0] border border-[#DFD8CC] p-3 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8C7A63] font-bold mb-1.5">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Flat No., Building, Street Name"
                    className="w-full bg-[#F8F5F0] border border-[#DFD8CC] p-3 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8C7A63] font-bold mb-1.5">
                    Apartment, Suite, Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="e.g. Near Royal Palms"
                    className="w-full bg-[#F8F5F0] border border-[#DFD8CC] p-3 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] rounded-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8C7A63] font-bold mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai"
                      className="w-full bg-[#F8F5F0] border border-[#DFD8CC] p-3 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8C7A63] font-bold mb-1.5">
                      State / Province
                    </label>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="Maharashtra"
                      className="w-full bg-[#F8F5F0] border border-[#DFD8CC] p-3 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8C7A63] font-bold mb-1.5">
                      PIN / Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="400001"
                      className="w-full bg-[#F8F5F0] border border-[#DFD8CC] p-3 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8C7A63] font-bold mb-1.5">
                    Country / Territory
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#F8F5F0] border border-[#DFD8CC] p-3 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] rounded-sm cursor-pointer"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. SHIPPING METHOD */}
            <div className="bg-white p-5 sm:p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-base uppercase tracking-widest text-[#3A332C] font-bold mb-6 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#3A332C] text-white flex items-center justify-center text-xs">
                  3
                </span>
                Delivery Method
              </h2>

              <div className="space-y-3">
                <label
                  onClick={() => setShippingMethod("standard")}
                  className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all ${
                    shippingMethod === "standard"
                      ? "border-[#C19A6B] bg-[#F8F5F0]/60 ring-1 ring-[#C19A6B]"
                      : "border-[#DFD8CC] hover:border-[#C19A6B]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === "standard"}
                      onChange={() => setShippingMethod("standard")}
                      className="text-[#C19A6B]"
                    />
                    <div>
                      <span className="text-sm font-semibold text-[#3A332C] block">
                        Complimentary Tracked Delivery
                      </span>
                      <span className="text-xs text-[#7A7065]">
                        Dispatched from our Bhadohi loom. 5–8 business days.
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    Free
                  </span>
                </label>

                <label
                  onClick={() => setShippingMethod("express")}
                  className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all ${
                    shippingMethod === "express"
                      ? "border-[#C19A6B] bg-[#F8F5F0]/60 ring-1 ring-[#C19A6B]"
                      : "border-[#DFD8CC] hover:border-[#C19A6B]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === "express"}
                      onChange={() => setShippingMethod("express")}
                      className="text-[#C19A6B]"
                    />
                    <div>
                      <span className="text-sm font-semibold text-[#3A332C] block">
                        Express Insured Artisan Courier
                      </span>
                      <span className="text-xs text-[#7A7065]">
                        Priority air courier with tailored package handling. 3–5 days.
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#3A332C]">
                    {formatPrice(2000)}
                  </span>
                </label>
              </div>
            </div>

            {/* 4. PAYMENT METHOD */}
            <div className="bg-white p-5 sm:p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-base uppercase tracking-widest text-[#3A332C] font-bold mb-6 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#3A332C] text-white flex items-center justify-center text-xs">
                  4
                </span>
                Payment Options
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`min-h-[48px] p-3 text-xs uppercase tracking-wider font-bold border rounded-sm transition-all flex items-center justify-center text-center ${
                    paymentMethod === "card"
                      ? "border-[#C19A6B] bg-[#F8F5F0] text-[#C19A6B] shadow-inner"
                      : "border-[#DFD8CC] text-[#7A7065] hover:border-[#C19A6B]"
                  }`}
                >
                  Credit / Debit Card
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`min-h-[48px] p-3 text-xs uppercase tracking-wider font-bold border rounded-sm transition-all flex items-center justify-center text-center ${
                    paymentMethod === "upi"
                      ? "border-[#C19A6B] bg-[#F8F5F0] text-[#C19A6B] shadow-inner"
                      : "border-[#DFD8CC] text-[#7A7065] hover:border-[#C19A6B]"
                  }`}
                >
                  UPI / NetBanking
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`min-h-[48px] p-3 text-xs uppercase tracking-wider font-bold border rounded-sm transition-all flex items-center justify-center text-center ${
                    paymentMethod === "cod"
                      ? "border-[#C19A6B] bg-[#F8F5F0] text-[#C19A6B] shadow-inner"
                      : "border-[#DFD8CC] text-[#7A7065] hover:border-[#C19A6B]"
                  }`}
                >
                  Pay on Delivery
                </button>
              </div>

              {/* CARD FORM */}
              {paymentMethod === "card" && (
                <div className="space-y-4 p-5 bg-[#F8F5F0]/60 border border-[#EBE5DA] rounded-sm">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8C7A63] font-bold mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Name as printed on card"
                      className="w-full bg-white border border-[#DFD8CC] p-3 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8C7A63] font-bold mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 •••• •••• 8921"
                      className="w-full bg-white border border-[#DFD8CC] p-3 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] rounded-sm font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#8C7A63] font-bold mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-white border border-[#DFD8CC] p-3 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] rounded-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#8C7A63] font-bold mb-1">
                        Security Code (CVV)
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="•••"
                        className="w-full bg-white border border-[#DFD8CC] p-3 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] rounded-sm font-mono"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-[#8C7A63] block">
                    🔒 Protected with 256-bit SSL encryption. We never store full card credentials.
                  </span>
                </div>
              )}

              {/* UPI FORM */}
              {paymentMethod === "upi" && (
                <div className="p-5 bg-[#F8F5F0]/60 border border-[#EBE5DA] rounded-sm space-y-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8C7A63] font-bold mb-1">
                      Virtual Payment Address (UPI ID)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="mobile@upi or yourname@oksbi"
                      className="w-full bg-white border border-[#DFD8CC] p-3 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] rounded-sm font-mono"
                    />
                  </div>
                  <span className="text-[11px] text-[#7A7065] block">
                    Supports Google Pay, PhonePe, Paytm, BHIM, and all leading Indian banking apps.
                  </span>
                </div>
              )}

              {/* COD FORM */}
              {paymentMethod === "cod" && (
                <div className="p-5 bg-[#F8F5F0]/60 border border-[#EBE5DA] rounded-sm">
                  <span className="text-xs text-[#3A332C] font-semibold block mb-1">
                    Pay upon Delivery at Your Doorstep
                  </span>
                  <p className="text-xs text-[#7A7065] leading-relaxed">
                    You can pay in cash or via digital UPI QR scan directly to our logistics partner when
                    your handcrafted carpet arrives.
                  </p>
                </div>
              )}
            </div>

            {/* 5. NOTES */}
            <div className="bg-white p-5 sm:p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <label className="block text-xs uppercase tracking-widest text-[#8C7A63] font-bold mb-2">
                Special Delivery Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Gate code, landmark direction, or preferred delivery timing..."
                className="w-full bg-[#F8F5F0] border border-[#DFD8CC] p-3 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] rounded-sm"
              />
            </div>

          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="w-full lg:w-5/12">
            <div className="sticky top-32 bg-white p-5 sm:p-8 border border-[#EBE5DA] shadow-xl rounded-sm">
              <h2 className="text-base uppercase tracking-widest text-[#3A332C] font-bold pb-4 border-b border-[#DFD8CC] mb-6">
                Order Summary ({cartItems.length})
              </h2>

              {/* Items List */}
              <div className="divide-y divide-[#EBE5DA] max-h-72 overflow-y-auto custom-scrollbar mb-6 pr-1">
                {cartItems.map((item, idx) => (
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
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-serif font-medium text-[#3A332C] truncate">
                        {item.name}
                      </h4>
                      <div className="text-xs text-[#7A7065] mt-0.5">
                        <span>Size: {item.size}</span>
                        {item.isCustom && (
                          <span className="ml-2 text-[#C19A6B] font-bold">(Bespoke)</span>
                        )}
                      </div>
                      <div className="text-xs text-[#8C7A63] mt-1">Qty: {item.quantity || 1}</div>
                    </div>
                    <div className="text-sm font-semibold text-[#3A332C] shrink-0">
                      {formatPrice(
                        parseFloat((item.price || "0").toString().replace(/[^0-9.]/g, "")) *
                          (item.quantity || 1)
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-[#DFD8CC] text-sm text-[#7A7065]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#3A332C] font-semibold">{formatPrice(cartSubtotalINR)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shippingMethod === "express" ? (
                      <span className="text-[#3A332C] font-semibold">{formatPrice(shippingCostINR)}</span>
                    ) : (
                      <span className="text-emerald-600 font-bold uppercase tracking-wider text-xs">
                        Free
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Taxes</span>
                  <span className="text-xs text-[#8C7A63]">Included</span>
                </div>
                <div className="pt-4 border-t border-[#DFD8CC] flex justify-between items-baseline text-[#3A332C]">
                  <span className="text-base uppercase tracking-wider font-bold">Total</span>
                  <span className="text-3xl font-serif font-bold text-[#C19A6B]">
                    {formatPrice(grandTotalINR)}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-8 bg-[#3A332C] text-[#F8F5F0] py-5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#C19A6B] transition-colors duration-300 rounded-sm shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? "Securing Your Order..." : "Place Order Now"}
              </button>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-[#DFD8CC] space-y-3 text-[11px] text-[#8C7A63]">
                <div className="flex items-center gap-2">
                  <span className="text-[#C19A6B]">✓</span>
                  <span>Direct Loom Delivery from Bhadohi, India</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#C19A6B]">✓</span>
                  <span>100% Recycled PET • Shed-Resistant Weave</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#C19A6B]">✓</span>
                  <span>30-Day Heritage Guarantee & White-Glove Support</span>
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
