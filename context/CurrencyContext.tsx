"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type CurrencyContextType = {
  currency: string;
  usdRate: number;
  setCurrency: (curr: string) => void;
  formatPrice: (inrPrice: any, qty?: number) => string;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  usdRate: 83.5,
  setCurrency: () => {},
  formatPrice: () => "",
});

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrencyState] = useState("USD");
  const [usdRate, setUsdRate] = useState(83.5);

  useEffect(() => {
    // 1. Initial LocalStorage Read
    const saved = localStorage.getItem("user_currency") || "USD";
    setCurrencyState(saved);

    // 2. Fetch Rate from Supabase
    const fetchRate = async () => {
      try {
        const { data } = await supabase.from("store_settings").select("usd_rate").eq("id", 1).maybeSingle();
        if (data?.usd_rate) setUsdRate(Number(data.usd_rate));
      } catch (e) {}
    };
    fetchRate();
  }, []);

  const setCurrency = (code: string) => {
    setCurrencyState(code);
    localStorage.setItem("user_currency", code);
  };

  const formatPrice = (inrPrice: any, qty: number = 1): string => {
    if (!inrPrice && inrPrice !== 0) return "Price on Request";
    const cleaned = inrPrice.toString().replace(/[^0-9.]/g, "");
    const numericInr = parseFloat(cleaned);
    if (isNaN(numericInr) || numericInr <= 0) return "Price on Request";

    const totalInr = numericInr * qty;

    if (currency === "INR") {
      return `₹${Math.round(totalInr).toLocaleString("en-IN")}`;
    }

    const relativeRates: Record<string, number> = {
      USD: 1.0,
      EUR: 0.92,
      GBP: 0.79,
      CAD: 1.36,
      AUD: 1.53,
    };

    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      CAD: "CA$",
      AUD: "AU$",
      INR: "₹",
    };

    const targetMultiplier = relativeRates[currency] || 1.0;
    const priceInUSD = totalInr / (usdRate || 83.5);
    const finalConverted = Math.round(priceInUSD * targetMultiplier);

    return `${symbols[currency] || "$"}${finalConverted.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, usdRate, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);