"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useCurrency } from "@/context/CurrencyContext";

// Color helper to derive shade variations (darker shadows, warmer flecks)
function adjustBrightness(hex: string, percent: number): string {
  if (!hex || typeof hex !== "string" || !hex.startsWith("#")) return hex;
  const cleanHex = hex.replace("#", "");
  if (cleanHex.length !== 6 && cleanHex.length !== 3) return hex;
  const fullHex = cleanHex.length === 3 
    ? cleanHex.split("").map((c) => c + c).join("") 
    : cleanHex;

  const num = parseInt(fullHex, 16);
  if (isNaN(num)) return hex;

  let r = (num >> 16) + Math.round((255 * percent) / 100);
  let g = ((num >> 8) & 0x00ff) + Math.round((255 * percent) / 100);
  let b = (num & 0x0000ff) + Math.round((255 * percent) / 100);

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export type RugShape = "Rectangular" | "Round" | "Oval" | "Runner" | "Square" | "Arch";

export interface ShapeOption {
  id: RugShape;
  label: string;
  icon: string;
}

export const SHAPE_OPTIONS: ShapeOption[] = [
  { id: "Rectangular", label: "Rectangular", icon: "M3 6h18v12H3z" },
  { id: "Round", label: "Round Circle", icon: "M12 3a9 9 0 100 18 9 9 0 000-18z" },
  { id: "Oval", label: "Oval Capsule", icon: "M6 3h12a9 9 0 010 18H6A9 9 0 016 3z" },
  { id: "Runner", label: "Hallway Runner", icon: "M2 8h20v8H2z" },
  { id: "Square", label: "Square Studio", icon: "M4 4h16v16H4z" },
  { id: "Arch", label: "Modern Arch", icon: "M4 20V12a8 8 0 0116 0v8H4z" },
];

// Curated swatches for Setting 1 (Brown / Primary Fiber)
export const BROWN_SWATCHES = [
  { name: "Classic Jute Brown", hex: "#B58A60" },
  { name: "Terracotta Rust", hex: "#B7410E" },
  { name: "Dune Sand", hex: "#C8A878" },
  { name: "Charcoal Slate", hex: "#2B2A29" },
  { name: "Deep Navy", hex: "#1C2951" },
  { name: "Forest Moss", hex: "#4A5844" },
  { name: "Burnt Copper", hex: "#9E472A" },
  { name: "Ochre Turmeric", hex: "#C99A45" },
  { name: "Rich Espresso", hex: "#3D2314" },
  { name: "Warm Taupe", hex: "#8B7355" },
  { name: "Sage Mist", hex: "#7C8D75" },
  { name: "Dusty Rose", hex: "#B8736E" },
];

// Curated swatches for Setting 2 (White / Accent Fiber)
export const WHITE_SWATCHES = [
  { name: "Natural Cream", hex: "#F8F3E9" },
  { name: "Pure White", hex: "#FFFFFF" },
  { name: "Bleached Ivory", hex: "#FFFDF8" },
  { name: "Oatmeal Heather", hex: "#E8DFC8" },
  { name: "Pale Linen", hex: "#F0EAE1" },
  { name: "Buttercream", hex: "#FFF5C0" },
  { name: "Soft Blush", hex: "#F5E6E8" },
  { name: "Light Sage", hex: "#E2E8DD" },
  { name: "Ice Silver", hex: "#E5E8EB" },
  { name: "Pale Gold", hex: "#FFF0D0" },
  { name: "Muted Peach", hex: "#E6B8A2" },
  { name: "Sky Mist", hex: "#D6E5EA" },
];

export type FloorScene = "atelier" | "oak" | "walnut" | "travertine";

interface PresetSize {
  shape: RugShape;
  label: string;
  w: string;
  l: string;
  d?: string;
}

const PRESET_SIZES: PresetSize[] = [
  { shape: "Rectangular", label: "5' × 8' (Standard)", w: "5", l: "8" },
  { shape: "Rectangular", label: "6' × 9' (Living Area)", w: "6", l: "9" },
  { shape: "Rectangular", label: "8' × 10' (Grand Room)", w: "8", l: "10" },
  { shape: "Rectangular", label: "9' × 12' (Master Suite)", w: "9", l: "12" },
  { shape: "Round", label: "5' Diameter", w: "5", l: "5", d: "5" },
  { shape: "Round", label: "6' Diameter", w: "6", l: "6", d: "6" },
  { shape: "Round", label: "8' Diameter", w: "8", l: "8", d: "8" },
  { shape: "Oval", label: "5' × 8' Oval", w: "5", l: "8" },
  { shape: "Oval", label: "6' × 9' Oval", w: "6", l: "9" },
  { shape: "Runner", label: "2.5' × 8' Entryway", w: "2.5", l: "8" },
  { shape: "Runner", label: "2.5' × 10' Long Hall", w: "2.5", l: "10" },
  { shape: "Square", label: "6' × 6' Square", w: "6", l: "6" },
  { shape: "Square", label: "8' × 8' Square", w: "8", l: "8" },
  { shape: "Arch", label: "4' × 6' Arch", w: "4", l: "6" },
  { shape: "Arch", label: "5' × 8' Arch", w: "5", l: "8" },
];

// =================================================================
// 🌟 GENERATE CUSTOM RUG SVG DATA URI (FOR CART, CHECKOUT & THUMBNAILS)
// =================================================================
export function generateCustomRugSvgDataUri(
  shape: RugShape,
  brownColor: string,
  whiteColor: string
): string {
  const brownDark = adjustBrightness(brownColor, -24);
  const brownAccent = adjustBrightness(brownColor, 16);
  const brownMid = adjustBrightness(brownColor, -10);
  const whiteLight = adjustBrightness(whiteColor, 8);
  const baseBg = adjustBrightness(whiteColor, -8);
  const patternBg = adjustBrightness(whiteColor, -5);
  const underlayColor = adjustBrightness(brownColor, 18);

  const defs = `
    <defs>
      <!-- BRAIDED ROPE TEXTURE -->
      <pattern id="bm" width="28" height="18" patternUnits="userSpaceOnUse">
        <rect width="28" height="18" fill="${patternBg}"/>
        <path d="M-8,2 L8,16 M6,2 L22,16 M20,2 L36,16" fill="none" stroke="${brownColor}" stroke-width="6" stroke-linecap="round"/>
        <path d="M-8,16 L8,2 M6,16 L22,2 M20,16 L36,2" fill="none" stroke="${whiteColor}" stroke-width="6" stroke-linecap="round"/>
        <path d="M1,5 L6,9 M13,11 L18,15 M23,4 L27,8" stroke="${brownDark}" stroke-width="2" stroke-linecap="round"/>
        <path d="M2,13 L6,10 M14,5 L18,9 M25,14 L28,11" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
      </pattern>

      <!-- FINER SURFACE FIBERS -->
      <pattern id="sp" width="19" height="19" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="3" r="1.2" fill="${brownDark}"/>
        <circle cx="7" cy="6" r="1.0" fill="${whiteLight}"/>
        <circle cx="14" cy="3" r="1.2" fill="${brownAccent}"/>
        <circle cx="17" cy="9" r="1.0" fill="${whiteLight}"/>
        <circle cx="5" cy="13" r="1.1" fill="${brownMid}"/>
        <circle cx="12" cy="15" r="1.2" fill="${whiteLight}"/>
        <circle cx="18" cy="17" r="1.0" fill="${brownDark}"/>
      </pattern>
    </defs>
  `;

  let innerSvg = "";
  let viewBox = "0 0 1000 1400";

  if (shape === "Round") {
    viewBox = "0 0 1000 1000";
    innerSvg = `
      ${defs}
      <circle cx="500" cy="500" r="482" fill="${baseBg}" />
      <circle cx="500" cy="500" r="469" fill="none" stroke="${underlayColor}" stroke-width="34" />
      <circle cx="500" cy="500" r="469" fill="none" stroke="url(#bm)" stroke-width="28" />
      <g fill="none" stroke="url(#bm)" stroke-width="30" stroke-linejoin="round" stroke-linecap="round">
        ${[433, 397, 361, 325, 289, 253, 217, 181, 145, 109, 73].map((r) => `<circle cx="500" cy="500" r="${r}" />`).join("")}
      </g>
      <circle cx="500" cy="500" r="54" fill="url(#bm)" />
      <circle cx="500" cy="500" r="469" fill="url(#sp)" opacity="0.55" />
      <g fill="none" stroke="#FFFDF8" stroke-width="3.2" opacity="0.7" stroke-linejoin="round">
        ${[452, 416, 344, 272, 200, 128].map((r) => `<circle cx="500" cy="500" r="${r}" />`).join("")}
      </g>
      <g fill="${brownDark}" opacity="0.65">
        <circle cx="500" cy="68" r="2"/>
        <circle cx="500" cy="932" r="2"/>
        <circle cx="68" cy="500" r="2"/>
        <circle cx="932" cy="500" r="2"/>
        <circle cx="195" cy="195" r="1.8"/>
        <circle cx="805" cy="195" r="1.8"/>
        <circle cx="195" cy="805" r="1.8"/>
        <circle cx="805" cy="805" r="1.8"/>
      </g>
    `;
  } else if (shape === "Square") {
    viewBox = "0 0 1000 1000";
    innerSvg = `
      ${defs}
      <rect x="18" y="18" width="964" height="964" rx="38" fill="${baseBg}" />
      <rect x="31" y="31" width="938" height="938" rx="31" fill="none" stroke="${underlayColor}" stroke-width="34" />
      <rect x="31" y="31" width="938" height="938" rx="31" fill="none" stroke="url(#bm)" stroke-width="28" />
      <g fill="none" stroke="url(#bm)" stroke-width="30" stroke-linejoin="round" stroke-linecap="round">
        <rect x="67" y="67" width="866" height="866" rx="27" />
        <rect x="103" y="103" width="794" height="794" rx="24" />
        <rect x="139" y="139" width="722" height="722" rx="21" />
        <rect x="175" y="175" width="650" height="650" rx="19" />
        <rect x="211" y="211" width="578" height="578" rx="17" />
        <rect x="247" y="247" width="506" height="506" rx="15" />
        <rect x="283" y="283" width="434" height="434" rx="13" />
        <rect x="319" y="319" width="362" height="362" rx="11" />
        <rect x="355" y="355" width="290" height="290" rx="10" />
        <rect x="391" y="391" width="218" height="218" rx="8" />
        <rect x="427" y="427" width="146" height="146" rx="7" />
      </g>
      <rect x="448" y="448" width="104" height="104" rx="6" fill="url(#bm)" />
      <rect x="31" y="31" width="938" height="938" rx="31" fill="url(#sp)" opacity="0.55" />
      <g fill="none" stroke="#FFFDF8" stroke-width="3.2" opacity="0.7" stroke-linejoin="round">
        <rect x="48" y="48" width="904" height="904" rx="28" />
        <rect x="84" y="84" width="832" height="832" rx="24" />
        <rect x="156" y="156" width="688" height="688" rx="19" />
        <rect x="228" y="228" width="544" height="544" rx="15" />
        <rect x="300" y="300" width="400" height="400" rx="11" />
        <rect x="372" y="372" width="256" height="256" rx="8" />
      </g>
      <g fill="${brownDark}" opacity="0.65">
        <circle cx="82" cy="82" r="2"/>
        <circle cx="116" cy="112" r="1.7"/>
        <circle cx="148" cy="146" r="2"/>
        <circle cx="914" cy="87" r="1.8"/>
        <circle cx="882" cy="121" r="2"/>
        <circle cx="82" cy="914" r="2"/>
        <circle cx="914" cy="914" r="2"/>
      </g>
    `;
  } else if (shape === "Oval") {
    // Authentic stadium: straight parallel sides + rounded ends
    const coreY1 = 470;
    const coreHeight = 460;
    const outerR = 430;
    const concentricRadii = [394, 358, 322, 286, 250, 214, 178, 142, 106, 70, 34];
    const highlightRadii = [412, 376, 304, 232, 160, 88];

    innerSvg = `
      ${defs}
      <rect x="${500 - (outerR + 18)}" y="${coreY1 - (outerR + 18)}" width="${2 * (outerR + 18)}" height="${coreHeight + 2 * (outerR + 18)}" rx="${outerR + 18}" ry="${outerR + 18}" fill="${baseBg}" />
      <rect x="${500 - outerR}" y="${coreY1 - outerR}" width="${2 * outerR}" height="${coreHeight + 2 * outerR}" rx="${outerR}" ry="${outerR}" fill="none" stroke="${underlayColor}" stroke-width="34" />
      <rect x="${500 - outerR}" y="${coreY1 - outerR}" width="${2 * outerR}" height="${coreHeight + 2 * outerR}" rx="${outerR}" ry="${outerR}" fill="none" stroke="url(#bm)" stroke-width="28" />
      <g fill="none" stroke="url(#bm)" stroke-width="30" stroke-linejoin="round" stroke-linecap="round">
        ${concentricRadii.map((r) => `<rect x="${500 - r}" y="${coreY1 - r}" width="${2 * r}" height="${coreHeight + 2 * r}" rx="${r}" ry="${r}" />`).join("")}
      </g>
      <rect x="476" y="${coreY1 - 24}" width="48" height="${coreHeight + 48}" rx="24" ry="24" fill="url(#bm)" />
      <rect x="${500 - outerR}" y="${coreY1 - outerR}" width="${2 * outerR}" height="${coreHeight + 2 * outerR}" rx="${outerR}" ry="${outerR}" fill="url(#sp)" opacity="0.55" />
      <g fill="none" stroke="#FFFDF8" stroke-width="3.2" opacity="0.7" stroke-linejoin="round">
        ${highlightRadii.map((r) => `<rect x="${500 - r}" y="${coreY1 - r}" width="${2 * r}" height="${coreHeight + 2 * r}" rx="${r}" ry="${r}" />`).join("")}
      </g>
      <g fill="${brownDark}" opacity="0.65">
        <circle cx="116" cy="470" r="2"/>
        <circle cx="884" cy="470" r="2"/>
        <circle cx="116" cy="930" r="2"/>
        <circle cx="884" cy="930" r="2"/>
        <circle cx="500" cy="70" r="2"/>
        <circle cx="500" cy="1330" r="2"/>
      </g>
    `;
  } else if (shape === "Runner") {
    viewBox = "0 0 540 1500";
    innerSvg = `
      ${defs}
      <rect x="15" y="15" width="510" height="1470" rx="36" fill="${baseBg}" />
      <rect x="27" y="27" width="486" height="1446" rx="28" fill="none" stroke="${underlayColor}" stroke-width="32" />
      <rect x="27" y="27" width="486" height="1446" rx="28" fill="none" stroke="url(#bm)" stroke-width="26" />
      <g fill="none" stroke="url(#bm)" stroke-width="28" stroke-linejoin="round" stroke-linecap="round">
        <rect x="59" y="59" width="422" height="1382" rx="20" />
        <rect x="95" y="95" width="350" height="1310" rx="17" />
        <rect x="131" y="131" width="278" height="1238" rx="14" />
        <rect x="167" y="167" width="206" height="1166" rx="11" />
        <rect x="203" y="203" width="134" height="1094" rx="8" />
      </g>
      <rect x="235" y="235" width="70" height="1030" rx="6" fill="url(#bm)" />
      <rect x="27" y="27" width="486" height="1446" rx="28" fill="url(#sp)" opacity="0.55" />
      <g fill="none" stroke="#FFFDF8" stroke-width="3.2" opacity="0.7" stroke-linejoin="round">
        <rect x="43" y="43" width="454" height="1414" rx="22" />
        <rect x="79" y="79" width="382" height="1342" rx="18" />
        <rect x="151" y="151" width="238" height="1198" rx="12" />
      </g>
      <g fill="${brownDark}" opacity="0.65">
        <circle cx="60" cy="80" r="1.8"/>
        <circle cx="480" cy="80" r="1.8"/>
        <circle cx="60" cy="1420" r="1.8"/>
        <circle cx="480" cy="1420" r="1.8"/>
      </g>
    `;
  } else if (shape === "Arch") {
    viewBox = "0 0 1000 1400";
    innerSvg = `
      ${defs}
      <path d="M 18 1382 L 18 500 A 482 482 0 0 1 982 500 L 982 1382 Z" fill="${baseBg}" />
      <path d="M 31 1369 L 31 500 A 469 469 0 0 1 969 500 L 969 1369 Z" fill="none" stroke="${underlayColor}" stroke-width="34" />
      <path d="M 31 1369 L 31 500 A 469 469 0 0 1 969 500 L 969 1369 Z" fill="none" stroke="url(#bm)" stroke-width="28" />
      <g fill="none" stroke="url(#bm)" stroke-width="30" stroke-linejoin="round" stroke-linecap="round">
        ${[433, 397, 361, 325, 289, 253, 217, 181, 145, 109, 73].map((r, i) => `<path d="M ${500 - r} ${1369 - i * 4} L ${500 - r} 500 A ${r} ${r} 0 0 1 ${500 + r} 500 L ${500 + r} ${1369 - i * 4}" />`).join("")}
      </g>
      <path d="M 450 1320 L 450 500 A 50 50 0 0 1 550 500 L 550 1320 Z" fill="url(#bm)" />
      <path d="M 31 1369 L 31 500 A 469 469 0 0 1 969 500 L 969 1369 Z" fill="url(#sp)" opacity="0.55" />
      <g fill="none" stroke="#FFFDF8" stroke-width="3.2" opacity="0.7" stroke-linejoin="round">
        ${[452, 416, 344, 272, 200, 128].map((r, i) => `<path d="M ${500 - r} ${1360 - i * 4} L ${500 - r} 500 A ${r} ${r} 0 0 1 ${500 + r} 500 L ${500 + r} ${1360 - i * 4}" />`).join("")}
      </g>
    `;
  } else {
    // Rectangular
    innerSvg = `
      ${defs}
      <rect x="18" y="18" width="964" height="1364" rx="38" fill="${baseBg}" />
      <rect x="31" y="31" width="938" height="1338" rx="31" fill="none" stroke="${underlayColor}" stroke-width="34" />
      <rect x="31" y="31" width="938" height="1338" rx="31" fill="none" stroke="url(#bm)" stroke-width="28" />
      <g fill="none" stroke="url(#bm)" stroke-width="30" stroke-linejoin="round" stroke-linecap="round">
        <rect x="67" y="67" width="866" height="1266" rx="27" />
        <rect x="103" y="103" width="794" height="1194" rx="24" />
        <rect x="139" y="139" width="722" height="1122" rx="21" />
        <rect x="175" y="175" width="650" height="1050" rx="19" />
        <rect x="211" y="211" width="578" height="978" rx="17" />
        <rect x="247" y="247" width="506" height="906" rx="15" />
        <rect x="283" y="283" width="434" height="834" rx="13" />
        <rect x="319" y="319" width="362" height="762" rx="11" />
        <rect x="355" y="355" width="290" height="690" rx="10" />
        <rect x="391" y="391" width="218" height="618" rx="8" />
        <rect x="427" y="427" width="146" height="546" rx="7" />
      </g>
      <rect x="448" y="448" width="104" height="504" rx="6" fill="url(#bm)" />
      <rect x="31" y="31" width="938" height="1338" rx="31" fill="url(#sp)" opacity="0.55" />
      <g fill="none" stroke="#FFFDF8" stroke-width="3.2" opacity="0.7" stroke-linejoin="round">
        <rect x="48" y="48" width="904" height="1304" rx="28" />
        <rect x="84" y="84" width="832" height="1232" rx="24" />
        <rect x="156" y="156" width="688" height="1088" rx="19" />
        <rect x="228" y="228" width="544" height="944" rx="15" />
        <rect x="300" y="300" width="400" height="800" rx="11" />
        <rect x="372" y="372" width="256" height="656" rx="8" />
      </g>
      <g fill="${brownDark}" opacity="0.65">
        <circle cx="82" cy="82" r="2"/>
        <circle cx="116" cy="112" r="1.7"/>
        <circle cx="148" cy="146" r="2"/>
        <circle cx="182" cy="181" r="1.6"/>
        <circle cx="214" cy="214" r="2"/>
        <circle cx="914" cy="87" r="1.8"/>
        <circle cx="882" cy="121" r="2"/>
        <circle cx="846" cy="154" r="1.6"/>
        <circle cx="812" cy="188" r="2"/>
        <circle cx="82" cy="1280" r="2"/>
        <circle cx="118" cy="1248" r="1.7"/>
        <circle cx="154" cy="1212" r="2"/>
        <circle cx="190" cy="1178" r="1.6"/>
        <circle cx="914" cy="1280" r="2"/>
        <circle cx="880" cy="1244" r="1.7"/>
        <circle cx="846" cy="1210" r="2"/>
      </g>
    `;
  }

  const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%">${innerSvg}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(rawSvg.trim().replace(/\s+/g, " "))}`;
}

// =================================================================
// 🌟 CONCENTRIC BRAIDED RUG SVG ENGINE (Rectangle, Round, Oval, Runner, Square, Arch)
// =================================================================
function ConcentricBraidedRugSvg({
  shape,
  brownColor,
  whiteColor,
}: {
  shape: RugShape;
  brownColor: string;
  whiteColor: string;
}) {
  // Derive fiber shading variations
  const brownDark = adjustBrightness(brownColor, -24);
  const brownAccent = adjustBrightness(brownColor, 16);
  const brownMid = adjustBrightness(brownColor, -10);

  const whiteLight = adjustBrightness(whiteColor, 8);
  const baseBg = adjustBrightness(whiteColor, -8);
  const patternBg = adjustBrightness(whiteColor, -5);
  const underlayColor = adjustBrightness(brownColor, 18);

  const uniqueId = useMemo(() => Math.random().toString(36).substring(2, 8), []);
  const patternId = `braidMix_${uniqueId}`;
  const specklesId = `speckles_${uniqueId}`;

  // Common SVG Defs for mixed braid and speckles
  const renderDefs = () => (
    <defs>
      {/* BRAIDED ROPE TEXTURE */}
      <pattern id={patternId} width="28" height="18" patternUnits="userSpaceOnUse">
        {/* base */}
        <rect width="28" height="18" fill={patternBg} />

        {/* diagonal brown rope fibers */}
        <path
          d="M-8,2 L8,16 M6,2 L22,16 M20,2 L36,16"
          fill="none"
          stroke={brownColor}
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* diagonal white rope fibers */}
        <path
          d="M-8,16 L8,2 M6,16 L22,2 M20,16 L36,2"
          fill="none"
          stroke={whiteColor}
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* small brown fibers */}
        <path
          d="M1,5 L6,9 M13,11 L18,15 M23,4 L27,8"
          stroke={brownDark}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* small white fibers */}
        <path
          d="M2,13 L6,10 M14,5 L18,9 M25,14 L28,11"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </pattern>

      {/* FINER SURFACE FIBERS */}
      <pattern id={specklesId} width="19" height="19" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="3" r="1.2" fill={brownDark} />
        <circle cx="7" cy="6" r="1.0" fill={whiteLight} />
        <circle cx="14" cy="3" r="1.2" fill={brownAccent} />
        <circle cx="17" cy="9" r="1.0" fill={whiteLight} />
        <circle cx="5" cy="13" r="1.1" fill={brownMid} />
        <circle cx="12" cy="15" r="1.2" fill={whiteLight} />
        <circle cx="18" cy="17" r="1.0" fill={brownDark} />
      </pattern>
    </defs>
  );

  // 1. RECTANGLE SHAPE
  if (shape === "Rectangular") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1400" className="w-full h-full max-h-full">
        {renderDefs()}

        {/* BASE */}
        <rect x="18" y="18" width="964" height="1364" rx="38" fill={baseBg} />

        {/* OUTER ROPE UNDERLAY */}
        <rect x="31" y="31" width="938" height="1338" rx="31" fill="none" stroke={underlayColor} strokeWidth="34" />

        {/* OUTER ROPE BRAID */}
        <rect x="31" y="31" width="938" height="1338" rx="31" fill="none" stroke={`url(#${patternId})`} strokeWidth="28" />

        {/* CONCENTRIC BRAIDED RINGS */}
        <g fill="none" stroke={`url(#${patternId})`} strokeWidth="30" strokeLinejoin="round" strokeLinecap="round">
          <rect x="67" y="67" width="866" height="1266" rx="27" />
          <rect x="103" y="103" width="794" height="1194" rx="24" />
          <rect x="139" y="139" width="722" height="1122" rx="21" />
          <rect x="175" y="175" width="650" height="1050" rx="19" />
          <rect x="211" y="211" width="578" height="978" rx="17" />
          <rect x="247" y="247" width="506" height="906" rx="15" />
          <rect x="283" y="283" width="434" height="834" rx="13" />
          <rect x="319" y="319" width="362" height="762" rx="11" />
          <rect x="355" y="355" width="290" height="690" rx="10" />
          <rect x="391" y="391" width="218" height="618" rx="8" />
          <rect x="427" y="427" width="146" height="546" rx="7" />
        </g>

        {/* INNER CENTER */}
        <rect x="448" y="448" width="104" height="504" rx="6" fill={`url(#${patternId})`} />

        {/* FIBER SPECKLING */}
        <rect x="31" y="31" width="938" height="1338" rx="31" fill={`url(#${specklesId})`} opacity="0.55" />

        {/* BRAID EDGE HIGHLIGHTS */}
        <g fill="none" stroke="#FFFDF8" strokeWidth="3.2" opacity="0.7" strokeLinejoin="round">
          <rect x="48" y="48" width="904" height="1304" rx="28" />
          <rect x="84" y="84" width="832" height="1232" rx="24" />
          <rect x="156" y="156" width="688" height="1088" rx="19" />
          <rect x="228" y="228" width="544" height="944" rx="15" />
          <rect x="300" y="300" width="400" height="800" rx="11" />
          <rect x="372" y="372" width="256" height="656" rx="8" />
        </g>

        {/* TINY DARK/BROWN FIBER BREAKS */}
        <g fill={brownDark} opacity="0.65">
          <circle cx="82" cy="82" r="2" />
          <circle cx="116" cy="112" r="1.7" />
          <circle cx="148" cy="146" r="2" />
          <circle cx="182" cy="181" r="1.6" />
          <circle cx="214" cy="214" r="2" />

          <circle cx="914" cy="87" r="1.8" />
          <circle cx="882" cy="121" r="2" />
          <circle cx="846" cy="154" r="1.6" />
          <circle cx="812" cy="188" r="2" />

          <circle cx="82" cy="1280" r="2" />
          <circle cx="118" cy="1248" r="1.7" />
          <circle cx="154" cy="1212" r="2" />
          <circle cx="190" cy="1178" r="1.6" />

          <circle cx="914" cy="1280" r="2" />
          <circle cx="880" cy="1244" r="1.7" />
          <circle cx="846" cy="1210" r="2" />
        </g>
      </svg>
    );
  }

  // 2. ROUND CIRCLE SHAPE
  if (shape === "Round") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" className="w-full h-full max-h-full">
        {renderDefs()}

        {/* BASE */}
        <circle cx="500" cy="500" r="482" fill={baseBg} />

        {/* OUTER ROPE UNDERLAY */}
        <circle cx="500" cy="500" r="469" fill="none" stroke={underlayColor} strokeWidth="34" />

        {/* OUTER ROPE BRAID */}
        <circle cx="500" cy="500" r="469" fill="none" stroke={`url(#${patternId})`} strokeWidth="28" />

        {/* CONCENTRIC CIRCULAR BRAID LINES */}
        <g fill="none" stroke={`url(#${patternId})`} strokeWidth="30" strokeLinejoin="round" strokeLinecap="round">
          {[433, 397, 361, 325, 289, 253, 217, 181, 145, 109, 73].map((r) => (
            <circle key={r} cx="500" cy="500" r={r} />
          ))}
        </g>

        {/* INNER CENTER */}
        <circle cx="500" cy="500" r="54" fill={`url(#${patternId})`} />

        {/* FIBER SPECKLING */}
        <circle cx="500" cy="500" r="469" fill={`url(#${specklesId})`} opacity="0.55" />

        {/* BRAID EDGE HIGHLIGHTS */}
        <g fill="none" stroke="#FFFDF8" strokeWidth="3.2" opacity="0.7" strokeLinejoin="round">
          {[452, 416, 344, 272, 200, 128].map((r) => (
            <circle key={r} cx="500" cy="500" r={r} />
          ))}
        </g>

        {/* TINY DARK/BROWN FIBER BREAKS */}
        <g fill={brownDark} opacity="0.65">
          <circle cx="500" cy="68" r="2" />
          <circle cx="500" cy="932" r="2" />
          <circle cx="68" cy="500" r="2" />
          <circle cx="932" cy="500" r="2" />
          <circle cx="195" cy="195" r="1.8" />
          <circle cx="805" cy="195" r="1.8" />
          <circle cx="195" cy="805" r="1.8" />
          <circle cx="805" cy="805" r="1.8" />
        </g>
      </svg>
    );
  }

  // 3. OVAL (AUTHENTIC BRAIDED STADIUM / RECTANGULAR OVAL) SHAPE
  if (shape === "Oval") {
    const coreY1 = 470;
    const coreHeight = 460;
    const outerR = 430;
    const concentricRadii = [394, 358, 322, 286, 250, 214, 178, 142, 106, 70, 34];
    const highlightRadii = [412, 376, 304, 232, 160, 88];

    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1400" className="w-full h-full max-h-full">
        {renderDefs()}

        {/* BASE BACKING */}
        <rect
          x={500 - (outerR + 18)}
          y={coreY1 - (outerR + 18)}
          width={2 * (outerR + 18)}
          height={coreHeight + 2 * (outerR + 18)}
          rx={outerR + 18}
          ry={outerR + 18}
          fill={baseBg}
        />

        {/* OUTER ROPE UNDERLAY */}
        <rect
          x={500 - outerR}
          y={coreY1 - outerR}
          width={2 * outerR}
          height={coreHeight + 2 * outerR}
          rx={outerR}
          ry={outerR}
          fill="none"
          stroke={underlayColor}
          strokeWidth="34"
        />

        {/* OUTER ROPE BRAID */}
        <rect
          x={500 - outerR}
          y={coreY1 - outerR}
          width={2 * outerR}
          height={coreHeight + 2 * outerR}
          rx={outerR}
          ry={outerR}
          fill="none"
          stroke={`url(#${patternId})`}
          strokeWidth="28"
        />

        {/* CONCENTRIC BRAID LOOPS */}
        <g fill="none" stroke={`url(#${patternId})`} strokeWidth="30" strokeLinejoin="round" strokeLinecap="round">
          {concentricRadii.map((r) => (
            <rect
              key={r}
              x={500 - r}
              y={coreY1 - r}
              width={2 * r}
              height={coreHeight + 2 * r}
              rx={r}
              ry={r}
            />
          ))}
        </g>

        {/* INNER STRAIGHT STARTER CORE BRAID */}
        <rect
          x={476}
          y={coreY1 - 24}
          width={48}
          height={coreHeight + 48}
          rx={24}
          ry={24}
          fill={`url(#${patternId})`}
        />

        {/* FIBER SPECKLES */}
        <rect
          x={500 - outerR}
          y={coreY1 - outerR}
          width={2 * outerR}
          height={coreHeight + 2 * outerR}
          rx={outerR}
          ry={outerR}
          fill={`url(#${specklesId})`}
          opacity="0.55"
        />

        {/* BRAID HIGHLIGHT ACCENTS */}
        <g fill="none" stroke="#FFFDF8" strokeWidth="3.2" opacity="0.7" strokeLinejoin="round">
          {highlightRadii.map((r) => (
            <rect
              key={r}
              x={500 - r}
              y={coreY1 - r}
              width={2 * r}
              height={coreHeight + 2 * r}
              rx={r}
              ry={r}
            />
          ))}
        </g>

        {/* FIBER BREAKS */}
        <g fill={brownDark} opacity="0.65">
          <circle cx="116" cy="470" r="2" />
          <circle cx="884" cy="470" r="2" />
          <circle cx="116" cy="930" r="2" />
          <circle cx="884" cy="930" r="2" />
          <circle cx="500" cy="70" r="2" />
          <circle cx="500" cy="1330" r="2" />
        </g>
      </svg>
    );
  }

  // 4. RUNNER SHAPE
  if (shape === "Runner") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 1500" className="w-full h-full max-h-full">
        {renderDefs()}

        {/* BASE */}
        <rect x="15" y="15" width="510" height="1470" rx="36" fill={baseBg} />

        {/* OUTER ROPE UNDERLAY */}
        <rect x="27" y="27" width="486" height="1446" rx="28" fill="none" stroke={underlayColor} strokeWidth="32" />

        {/* OUTER ROPE BRAID */}
        <rect x="27" y="27" width="486" height="1446" rx="28" fill="none" stroke={`url(#${patternId})`} strokeWidth="26" />

        {/* CONCENTRIC RUNNER BRAID LINES */}
        <g fill="none" stroke={`url(#${patternId})`} strokeWidth="28" strokeLinejoin="round" strokeLinecap="round">
          <rect x="59" y="59" width="422" height="1382" rx="20" />
          <rect x="95" y="95" width="350" height="1310" rx="17" />
          <rect x="131" y="131" width="278" height="1238" rx="14" />
          <rect x="167" y="167" width="206" height="1166" rx="11" />
          <rect x="203" y="203" width="134" height="1094" rx="8" />
        </g>

        {/* INNER CENTER */}
        <rect x="235" y="235" width="70" height="1030" rx="6" fill={`url(#${patternId})`} />

        {/* SPECKLES */}
        <rect x="27" y="27" width="486" height="1446" rx="28" fill={`url(#${specklesId})`} opacity="0.55" />

        {/* HIGHLIGHTS */}
        <g fill="none" stroke="#FFFDF8" strokeWidth="3.2" opacity="0.7" strokeLinejoin="round">
          <rect x="43" y="43" width="454" height="1414" rx="22" />
          <rect x="79" y="79" width="382" height="1342" rx="18" />
          <rect x="151" y="151" width="238" height="1198" rx="12" />
        </g>

        {/* FIBER BREAKS */}
        <g fill={brownDark} opacity="0.65">
          <circle cx="60" cy="80" r="1.8" />
          <circle cx="480" cy="80" r="1.8" />
          <circle cx="60" cy="1420" r="1.8" />
          <circle cx="480" cy="1420" r="1.8" />
        </g>
      </svg>
    );
  }

  // 5. SQUARE SHAPE
  if (shape === "Square") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" className="w-full h-full max-h-full">
        {renderDefs()}

        {/* BASE */}
        <rect x="18" y="18" width="964" height="964" rx="38" fill={baseBg} />

        {/* OUTER ROPE UNDERLAY */}
        <rect x="31" y="31" width="938" height="938" rx="31" fill="none" stroke={underlayColor} strokeWidth="34" />

        {/* OUTER ROPE BRAID */}
        <rect x="31" y="31" width="938" height="938" rx="31" fill="none" stroke={`url(#${patternId})`} strokeWidth="28" />

        {/* CONCENTRIC SQUARE RINGS */}
        <g fill="none" stroke={`url(#${patternId})`} strokeWidth="30" strokeLinejoin="round" strokeLinecap="round">
          <rect x="67" y="67" width="866" height="866" rx="27" />
          <rect x="103" y="103" width="794" height="794" rx="24" />
          <rect x="139" y="139" width="722" height="722" rx="21" />
          <rect x="175" y="175" width="650" height="650" rx="19" />
          <rect x="211" y="211" width="578" height="578" rx="17" />
          <rect x="247" y="247" width="506" height="506" rx="15" />
          <rect x="283" y="283" width="434" height="434" rx="13" />
          <rect x="319" y="319" width="362" height="362" rx="11" />
          <rect x="355" y="355" width="290" height="290" rx="10" />
          <rect x="391" y="391" width="218" height="218" rx="8" />
          <rect x="427" y="427" width="146" height="146" rx="7" />
        </g>

        {/* INNER CENTER */}
        <rect x="448" y="448" width="104" height="104" rx="6" fill={`url(#${patternId})`} />

        {/* SPECKLES */}
        <rect x="31" y="31" width="938" height="938" rx="31" fill={`url(#${specklesId})`} opacity="0.55" />

        {/* HIGHLIGHTS */}
        <g fill="none" stroke="#FFFDF8" strokeWidth="3.2" opacity="0.7" strokeLinejoin="round">
          <rect x="48" y="48" width="904" height="904" rx="28" />
          <rect x="84" y="84" width="832" height="832" rx="24" />
          <rect x="156" y="156" width="688" height="688" rx="19" />
          <rect x="228" y="228" width="544" height="544" rx="15" />
          <rect x="300" y="300" width="400" height="400" rx="11" />
          <rect x="372" y="372" width="256" height="256" rx="8" />
        </g>

        {/* FIBER BREAKS */}
        <g fill={brownDark} opacity="0.65">
          <circle cx="82" cy="82" r="2" />
          <circle cx="116" cy="112" r="1.7" />
          <circle cx="148" cy="146" r="2" />
          <circle cx="914" cy="87" r="1.8" />
          <circle cx="882" cy="121" r="2" />
          <circle cx="82" cy="914" r="2" />
          <circle cx="914" cy="914" r="2" />
        </g>
      </svg>
    );
  }

  // 6. MODERN ARCH SHAPE
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1400" className="w-full h-full max-h-full">
      {renderDefs()}

      {/* BASE */}
      <path d="M 18 1382 L 18 500 A 482 482 0 0 1 982 500 L 982 1382 Z" fill={baseBg} />

      {/* OUTER ROPE UNDERLAY */}
      <path
        d="M 31 1369 L 31 500 A 469 469 0 0 1 969 500 L 969 1369 Z"
        fill="none"
        stroke={underlayColor}
        strokeWidth="34"
      />

      {/* OUTER ROPE BRAID */}
      <path
        d="M 31 1369 L 31 500 A 469 469 0 0 1 969 500 L 969 1369 Z"
        fill="none"
        stroke={`url(#${patternId})`}
        strokeWidth="28"
      />

      {/* CONCENTRIC ARCH BRAID LINES */}
      <g fill="none" stroke={`url(#${patternId})`} strokeWidth="30" strokeLinejoin="round" strokeLinecap="round">
        {[433, 397, 361, 325, 289, 253, 217, 181, 145, 109, 73].map((r, i) => {
          const x1 = 500 - r;
          const x2 = 500 + r;
          const yBot = 1369 - i * 4;
          return (
            <path
              key={r}
              d={`M ${x1} ${yBot} L ${x1} 500 A ${r} ${r} 0 0 1 ${x2} 500 L ${x2} ${yBot}`}
            />
          );
        })}
      </g>

      {/* INNER CENTER ARCH */}
      <path d="M 450 1320 L 450 500 A 50 50 0 0 1 550 500 L 550 1320 Z" fill={`url(#${patternId})`} />

      {/* FIBER SPECKLES */}
      <path
        d="M 31 1369 L 31 500 A 469 469 0 0 1 969 500 L 969 1369 Z"
        fill={`url(#${specklesId})`}
        opacity="0.55"
      />

      {/* HIGHLIGHTS */}
      <g fill="none" stroke="#FFFDF8" strokeWidth="3.2" opacity="0.7" strokeLinejoin="round">
        {[452, 416, 344, 272, 200, 128].map((r, i) => {
          const x1 = 500 - r;
          const x2 = 500 + r;
          const yBot = 1360 - i * 4;
          return (
            <path
              key={r}
              d={`M ${x1} ${yBot} L ${x1} 500 A ${r} ${r} 0 0 1 ${x2} 500 L ${x2} ${yBot}`}
            />
          );
        })}
      </g>
    </svg>
  );
}

// =================================================================
// MAIN BESPOKE CUSTOMIZER COMPONENT
// =================================================================
export function CustomizerContent({ initialProductId }: { initialProductId?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formatPrice } = useCurrency();

  const requestedId = initialProductId || searchParams.get("product") || searchParams.get("id");

  const [products, setProducts] = useState<any[]>([]);
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Shape & Dimensions
  const [shape, setShape] = useState<RugShape>("Rectangular");
  const [length, setLength] = useState("8");
  const [width, setWidth] = useState("5");
  const [diameter, setDiameter] = useState("6");
  const [unit, setUnit] = useState<"ft" | "cm" | "in">("ft");

  // 🌟 THE 2 MAIN COLOR SETTINGS REQUESTED BY USER
  // 1st Setting: Replaces the brown fibers (#B58A60)
  const [brownColor, setBrownColor] = useState<string>("#B58A60");
  // 2nd Setting: Replaces the white fibers (#F8F3E9)
  const [whiteColor, setWhiteColor] = useState<string>("#F8F3E9");

  const [specialInstructions, setSpecialInstructions] = useState("");

  // Room Scene Preview
  const [floorScene, setFloorScene] = useState<FloorScene>("atelier");
  const [zoomPreview, setZoomPreview] = useState(false);

  // Pricing & State
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // 🌟 SEND CUSTOM ORDER REQUEST MODAL & SUBMISSION STATE
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custNotes, setCustNotes] = useState("");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState<null | { orderCode: string; message: string }>(null);
  const [requestError, setRequestError] = useState("");
  const [copiedOrderCode, setCopiedOrderCode] = useState(false);

  // Auto-fill customer info if logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        if (session.user.email) setCustEmail(session.user.email);
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name;
        if (name) setCustName(name);
      }
    });
  }, []);

  const handleSendCustomRequest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!custEmail.trim()) {
      setRequestError("Please enter your email address so we can confirm your custom order.");
      return;
    }

    setIsSubmittingRequest(true);
    setRequestError("");

    try {
      const generatedCode = `RZ-CUST-${Math.floor(100000 + Math.random() * 900000)}`;
      const dimStr = shape === "Round" ? `${diameter} ${unit} Diameter` : `${width} × ${length} ${unit}`;
      const configUrl = typeof window !== "undefined" ? window.location.href : "";

      const res = await fetch("/api/custom-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode: generatedCode,
          customerName: custName.trim() || "Valued Patron",
          customerEmail: custEmail.trim(),
          customerPhone: custPhone.trim(),
          shape,
          dimensions: dimStr,
          areaSqFt: parseFloat(areaSqFt.toFixed(1)),
          brownColor,
          whiteColor,
          thickness: "Classic Chunky (12mm)",
          edgeFinish: "Seamless Tailored Fold",
          specialInstructions: custNotes.trim() || specialInstructions.trim(),
          calculatedPrice,
          currency: "USD",
          configUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit custom request");
      }

      setRequestSuccess({
        orderCode: data.orderCode || generatedCode,
        message: data.message || "we got your request please be pationt we will send you email",
      });

      try {
        const localRequests = JSON.parse(localStorage.getItem("rugzora_custom_requests") || "[]");
        localRequests.unshift({
          orderCode: data.orderCode || generatedCode,
          shape,
          dimensions: dimStr,
          brownColor,
          whiteColor,
          price: calculatedPrice,
          date: new Date().toISOString(),
        });
        localStorage.setItem("rugzora_custom_requests", JSON.stringify(localRequests));
      } catch (storageErr) {}
    } catch (err: any) {
      console.error(err);
      setRequestError(err.message || "Could not send your request. Please try again.");
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  // 1. Fetch Products & Initialize
  useEffect(() => {
    const fetchInit = async () => {
      try {
        const { data: allProducts, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && allProducts && allProducts.length > 0) {
          const customizableList = allProducts.filter((p: any) => p.is_customizable);
          const listToUse = customizableList.length > 0 ? customizableList : allProducts;
          setProducts(listToUse);

          let initialProduct = null;
          if (requestedId) {
            initialProduct = listToUse.find((p: any) => p.id === requestedId);
          }
          if (!initialProduct) {
            initialProduct = listToUse[0];
          }
          setProduct(initialProduct);
        }
      } catch (e) {
        console.error("Customizer init failed:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInit();
  }, [requestedId]);

  // Read URL query params
  useEffect(() => {
    const qShape = searchParams.get("shape") as RugShape;
    const qW = searchParams.get("w");
    const qL = searchParams.get("l");
    const qD = searchParams.get("d");
    const qUnit = searchParams.get("unit") as "ft" | "cm" | "in";
    const qC1 = searchParams.get("c1");
    const qC2 = searchParams.get("c2");

    if (qShape && SHAPE_OPTIONS.some((s) => s.id === qShape)) setShape(qShape);
    if (qW) setWidth(qW);
    if (qL) setLength(qL);
    if (qD) setDiameter(qD);
    if (qUnit && ["ft", "cm", "in"].includes(qUnit)) setUnit(qUnit);
    if (qC1 && qC1.startsWith("#")) setBrownColor(qC1);
    if (qC2 && qC2.startsWith("#")) setWhiteColor(qC2);
  }, [searchParams]);

  // Unit conversion helper
  const handleUnitChange = (newUnit: "ft" | "cm" | "in") => {
    if (newUnit === unit) return;

    let toFeetMultiplier = 1;
    if (unit === "cm") toFeetMultiplier = 1 / 30.48;
    if (unit === "in") toFeetMultiplier = 1 / 12;

    let fromFeetMultiplier = 1;
    if (newUnit === "cm") fromFeetMultiplier = 30.48;
    if (newUnit === "in") fromFeetMultiplier = 12;

    const convertValue = (val: string) => {
      const num = parseFloat(val);
      if (isNaN(num)) return val;
      const inFeet = num * toFeetMultiplier;
      const converted = inFeet * fromFeetMultiplier;
      return newUnit === "ft" ? converted.toFixed(1) : Math.round(converted).toString();
    };

    setWidth((prev) => convertValue(prev));
    setLength((prev) => convertValue(prev));
    setDiameter((prev) => convertValue(prev));
    setUnit(newUnit);
  };

  // Convert current dimensions to feet for area calculation
  const areaSqFt = useMemo(() => {
    let factor = 1;
    if (unit === "cm") factor = 1 / 30.48;
    if (unit === "in") factor = 1 / 12;

    const l = (parseFloat(length) || 0) * factor;
    const w = (parseFloat(width) || 0) * factor;
    const d = (parseFloat(diameter) || 0) * factor;

    if (shape === "Round") {
      return Math.PI * Math.pow(d / 2, 2);
    } else if (shape === "Oval") {
      const minDim = Math.min(l, w);
      const maxDim = Math.max(l, w);
      const radius = minDim / 2;
      const straightLength = Math.max(0, maxDim - minDim);
      const circleArea = Math.PI * Math.pow(radius, 2);
      const rectArea = minDim * straightLength;
      return circleArea + rectArea;
    } else if (shape === "Arch") {
      const radius = w / 2;
      const rectHeight = Math.max(0, l - radius);
      const halfCircleArea = 0.5 * Math.PI * Math.pow(radius, 2);
      const rectArea = w * rectHeight;
      return halfCircleArea + rectArea;
    } else {
      return l * w;
    }
  }, [length, width, diameter, shape, unit]);

  const areaSqMeters = useMemo(() => {
    return areaSqFt * 0.092903;
  }, [areaSqFt]);

  // 🌟 Dynamic Custom Price Calculator
  useEffect(() => {
    if (!product) return;

    let basePrice = 1;
    let baseArea = 15; // default 3x5 ft

    if (product.variants && product.variants.length > 0) {
      const baseVariant = product.variants[0];
      const basePriceStr = (baseVariant.price || "").toString().replace(/[^0-9.]/g, "");
      basePrice = parseFloat(basePriceStr) || 1;

      const dimMatch = baseVariant.size?.match(/([\d.]+)\s*[xX]\s*([\d.]+)/);
      if (dimMatch) {
        baseArea = parseFloat(dimMatch[1]) * parseFloat(dimMatch[2]);
      }
    } else if (product.price) {
      const pStr = product.price.toString().replace(/[^0-9.]/g, "");
      basePrice = parseFloat(pStr) || 1;
    }

    const ratePerSqFt = basePrice / (baseArea > 0 ? baseArea : 15);
    const usableArea = areaSqFt > 0 ? areaSqFt : baseArea;

    const surchargePercent = parseFloat(product.customization_surcharge) || 15;
    const surchargeMultiplier = 1 + surchargePercent / 100;

    const finalInrPrice = usableArea * ratePerSqFt * surchargeMultiplier;
    setCalculatedPrice(Math.round(finalInrPrice));
  }, [areaSqFt, product]);

  // Swap Setting 1 (Brown) and Setting 2 (White)
  const handleSwapColors = () => {
    const temp = brownColor;
    setBrownColor(whiteColor);
    setWhiteColor(temp);
  };

  // Reset to original Default
  const handleResetColors = () => {
    setBrownColor("#B58A60");
    setWhiteColor("#F8F3E9");
  };

  // Preset Size Selection
  const applyPreset = (preset: PresetSize) => {
    setShape(preset.shape);
    if (preset.d) {
      setDiameter(preset.d);
    } else {
      setWidth(preset.w);
      setLength(preset.l);
    }
    setUnit("ft");
  };

  // Add to Cart
  const handleAddToCart = () => {
    if (!product) return;

    if (shape === "Round" && (!diameter || parseFloat(diameter) <= 0)) {
      alert("Please specify a valid custom diameter.");
      return;
    }
    if (shape !== "Round" && (!length || !width || parseFloat(length) <= 0 || parseFloat(width) <= 0)) {
      alert("Please specify both valid length and width.");
      return;
    }

    setIsAdding(true);

    const customSizeStr =
      shape === "Round"
        ? `${diameter} ${unit} Dia`
        : `${width} × ${length} ${unit}`;

    // 🌟 Generate exact custom vector SVG data URI matching user's shape and 2 fiber colors
    const customSvgUri = generateCustomRugSvgDataUri(shape, brownColor, whiteColor);

    const customCartItem = {
      id: product.id + "_custom_" + Date.now(),
      product_id: product.id,
      name: `${product.name} (Concentric Braided Bespoke)`,
      category: "CUSTOM ORDER",
      image: customSvgUri,
      size: `${shape} — ${customSizeStr} (${areaSqFt.toFixed(1)} sq ft)`,
      price: Math.round(calculatedPrice),
      quantity: 1,
      isCustom: true,
      customDetails: {
        shape,
        dimensions: customSizeStr,
        areaSqFt: areaSqFt.toFixed(1),
        unit,
        brownFiberColor: brownColor,
        whiteFiberColor: whiteColor,
        instructions: specialInstructions.trim() || undefined,
      },
    };

    try {
      const existingCart = JSON.parse(localStorage.getItem("rugzora_cart") || "[]");
      existingCart.push(customCartItem);
      localStorage.setItem("rugzora_cart", JSON.stringify(existingCart));

      window.dispatchEvent(new Event("cart_updated"));

      setTimeout(() => {
        setIsAdding(false);
        window.dispatchEvent(new Event("open_cart"));
      }, 400);
    } catch (err) {
      console.error(err);
      setIsAdding(false);
    }
  };

  // Share Configuration Link
  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("product", product?.id || "");
    url.searchParams.set("shape", shape);
    url.searchParams.set("w", width);
    url.searchParams.set("l", length);
    if (shape === "Round") url.searchParams.set("d", diameter);
    url.searchParams.set("unit", unit);
    url.searchParams.set("c1", brownColor);
    url.searchParams.set("c2", whiteColor);

    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center pt-40 pb-40 min-h-screen bg-[#F8F5F0] text-center">
        <div className="w-12 h-12 border-2 border-[#C19A6B] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-sm uppercase tracking-[0.2em] text-[#8C7A63] font-semibold">
          Entering Bespoke Studio...
        </span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center pt-40 pb-40 min-h-screen bg-[#F8F5F0] px-6 text-center">
        <h2 className="text-3xl font-serif text-[#3A332C] mb-4">No Customizable Rug Found</h2>
        <p className="text-[#7A7065] mb-8 max-w-md">Please browse our collection atelier to pick an artisanal silhouette.</p>
        <Link
          href="/collections"
          className="border border-[#3A332C] text-[#3A332C] px-8 py-3.5 text-xs tracking-widest uppercase hover:bg-[#3A332C] hover:text-[#F8F5F0] transition rounded-sm font-semibold"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F5F0] min-h-screen pt-4 sm:pt-6 md:pt-8 pb-16 font-sans text-[#3A332C]">
      {/* HEADER BANNER */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 mb-5 sm:mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DFD8CC] pb-4 sm:pb-5">
        <div>
          <button
            onClick={() => router.back()}
            className="text-[11px] uppercase tracking-widest text-[#8C7A63] hover:text-[#C19A6B] mb-2 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            ← Back to Atelier
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C19A6B] font-bold">
              Bespoke Atelier Studio
            </span>
            <span className="text-[10px] bg-[#C19A6B]/15 text-[#C19A6B] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
              Hand-Braided to Order
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#3A332C] mt-1">
            Concentric Braided Floor Sculpture
          </h1>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopyLink}
            className="text-xs uppercase tracking-wider font-semibold text-[#6B6054] hover:text-[#3A332C] border border-[#DFD8CC] px-3.5 py-2 rounded-sm bg-white/60 hover:bg-white transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4 text-[#C19A6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {copiedLink ? "Link Copied! ✔" : "Share Config"}
          </button>

          <Link
            href="/process"
            className="text-xs uppercase tracking-wider font-semibold text-[#6B6054] hover:text-[#3A332C] border border-[#DFD8CC] px-3.5 py-2 rounded-sm bg-white/60 hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            Artisan Process →
          </Link>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-8 xl:gap-12">
        {/* =========================================================
            LEFT COLUMN: REAL-TIME CONCENTRIC BRAID VISUALIZER
        ========================================================= */}
        <div className="w-full lg:w-5/12 xl:w-1/2 flex flex-col">
          <div className="lg:sticky lg:top-28 space-y-4">
            
            {/* BASE PRODUCT SELECTOR */}
            {products.length > 1 && (
              <div className="bg-white p-3.5 rounded-sm border border-[#EBE5DA] shadow-sm flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[9px] uppercase tracking-widest text-[#8C7A63] font-bold block">
                    Base Model
                  </span>
                  <span className="text-sm font-serif font-semibold text-[#3A332C] truncate block">
                    {product.name}
                  </span>
                </div>
                <select
                  value={product.id}
                  onChange={(e) => {
                    const chosen = products.find((p) => p.id === e.target.value);
                    if (chosen) setProduct(chosen);
                  }}
                  className="bg-[#F8F5F0] border border-[#DFD8CC] px-3 py-1.5 text-xs font-semibold text-[#3A332C] rounded-sm outline-none focus:border-[#C19A6B] cursor-pointer"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* VISUALIZER CANVAS CONTAINER WITH REALISTIC FLOOR BACKGROUNDS */}
            <div
              className={`relative w-full rounded-sm overflow-hidden border border-[#DFD8CC] shadow-xl transition-all duration-500 flex items-center justify-center ${
                zoomPreview ? "h-[540px] sm:h-[640px]" : "h-[440px] sm:h-[530px]"
              }`}
              style={{
                background:
                  floorScene === "oak"
                    ? "repeating-linear-gradient(90deg, #E6D8C2 0px, #E6D8C2 78px, #D5C5AC 79px, #DFD1B8 80px, #EFE4D2 160px)"
                    : floorScene === "walnut"
                    ? "repeating-linear-gradient(90deg, #3A2B20 0px, #3A2B20 80px, #2A1D14 81px, #443428 82px, #3D2D22 160px)"
                    : floorScene === "travertine"
                    ? "radial-gradient(circle at 50% 50%, #FAF6EE 0%, #EDE5D6 60%, #E3D9C6 100%)"
                    : "linear-gradient(135deg, #F5F1E8 0%, #E8E0D2 100%)",
              }}
            >
              {/* Floor Plank Seam Overlay for Wood */}
              {(floorScene === "oak" || floorScene === "walnut") && (
                <div
                  className="absolute inset-0 opacity-25 pointer-events-none"
                  style={{
                    backgroundImage: "linear-gradient(0deg, rgba(0,0,0,0.15) 1px, transparent 1px)",
                    backgroundSize: "100% 220px",
                  }}
                />
              )}

              {/* AMBIENT DROP SHADOW ON FLOOR */}
              <div className="absolute inset-0 bg-radial from-transparent via-black/5 to-black/20 pointer-events-none" />

              {/* 🌟 USER-REQUESTED CONCENTRIC BRAIDED SVG CANVAS */}
              <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 200, damping: 26 }}
                  className={`relative flex items-center justify-center transition-transform duration-300 drop-shadow-[0_25px_35px_rgba(0,0,0,0.38)] ${
                    zoomPreview ? "scale-115" : "scale-100"
                  }`}
                  style={{
                    width:
                      shape === "Runner"
                        ? "45%"
                        : shape === "Round" || shape === "Square"
                        ? "75%"
                        : "82%",
                    height: "100%",
                    maxHeight: "92%",
                    aspectRatio:
                      shape === "Round" || shape === "Square"
                        ? "1 / 1"
                        : shape === "Runner"
                        ? "540 / 1500"
                        : "1000 / 1400",
                  }}
                >
                  <ConcentricBraidedRugSvg
                    shape={shape}
                    brownColor={brownColor}
                    whiteColor={whiteColor}
                  />
                </motion.div>
              </div>
            </div>

            {/* 🌟 CONTROLS BAR OUTSIDE & BELOW VISUALIZER CANVAS (UNOBSCURED FULL PREVIEW) */}
            <div className="bg-white px-3.5 py-2.5 rounded-sm border border-[#EBE5DA] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs text-[#3A332C]">
              {/* Floor Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C7A63]">
                  Floor Scene:
                </span>
                <div className="flex items-center gap-1">
                  {(["atelier", "oak", "walnut", "travertine"] as FloorScene[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFloorScene(f)}
                      className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer ${
                        floorScene === f
                          ? "bg-[#3A332C] text-white shadow-xs"
                          : "bg-[#F8F5F0] text-[#6B6054] hover:bg-[#EBE5DA]"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoom & Color Indicators */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-2 py-1 rounded-xs border border-[#DFD8CC]">
                  <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: brownColor }} title="1st (Brown) Fiber" />
                  <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: whiteColor }} title="2nd (White) Fiber" />
                  <span className="text-[10px] font-mono font-medium text-[#7A7065] hidden sm:inline">
                    {brownColor} / {whiteColor}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setZoomPreview(!zoomPreview)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs border border-[#DFD8CC] bg-[#FAF8F5] hover:bg-white text-[#6B6054] hover:text-[#3A332C] transition-colors cursor-pointer text-[10px] uppercase tracking-wider font-bold"
                  title={zoomPreview ? "Normal View" : "Zoom In"}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {zoomPreview ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    )}
                  </svg>
                  <span>{zoomPreview ? "Normal View" : "Zoom"}</span>
                </button>
              </div>
            </div>

            {/* STATS PILLS */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2.5 rounded-sm border border-[#EBE5DA]">
                <span className="text-[9px] uppercase tracking-widest text-[#8C7A63] font-bold block">
                  Coverage
                </span>
                <span className="font-semibold text-[#3A332C]">
                  {areaSqFt.toFixed(1)} sq ft <span className="text-[10px] text-[#8C7A63]">({areaSqMeters.toFixed(2)} m²)</span>
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-sm border border-[#EBE5DA]">
                <span className="text-[9px] uppercase tracking-widest text-[#8C7A63] font-bold block">
                  Weave Architecture
                </span>
                <span className="font-semibold text-[#C19A6B]">
                  Concentric Braided
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-sm border border-[#EBE5DA]">
                <span className="text-[9px] uppercase tracking-widest text-[#8C7A63] font-bold block">
                  Reversible
                </span>
                <span className="font-semibold text-[#3A332C]">
                  100% (Double-Sided)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: SETTINGS & CONTROLS
        ========================================================= */}
        <div className="w-full lg:w-7/12 xl:w-1/2 space-y-8 bg-white p-6 sm:p-8 md:p-10 rounded-sm border border-[#EBE5DA] shadow-sm">
          
          {/* =========================================================
              🌟 2 ALAG COLOR SETTINGS (REQUESTED BY USER)
          ========================================================= */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#EBE5DA] pb-3">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C7A63] block">
                  Artisan Fiber Color Controls
                </span>
                <span className="text-sm font-serif font-semibold text-[#3A332C]">
                  Customise Individual Mixed Braid Strands
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSwapColors}
                  className="text-[10px] uppercase font-bold text-[#C19A6B] hover:text-[#3A332C] border border-[#DFD8CC] px-2.5 py-1 rounded-xs bg-[#FAF8F5] cursor-pointer transition-colors"
                >
                  ⇄ Swap 1 & 2
                </button>
                <button
                  type="button"
                  onClick={handleResetColors}
                  className="text-[10px] uppercase font-bold text-[#7A7065] hover:text-[#3A332C] border border-[#DFD8CC] px-2.5 py-1 rounded-xs bg-[#FAF8F5] cursor-pointer transition-colors"
                  title="Reset to Original Brown & White"
                >
                  ↺ Reset
                </button>
              </div>
            </div>

            {/* SETTING 1: BROWN FIBER COLOR */}
            <div className="bg-[#FAF8F5] p-5 rounded-sm border border-[#EBE5DA]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-5 h-5 rounded-full border border-black/20 shadow-xs"
                    style={{ backgroundColor: brownColor }}
                  />
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-[#3A332C] block">
                      Setting 1: Primary Fiber (Brown Color)
                    </span>
                    <span className="text-[10px] text-[#7A7065]">
                      Controls the main darker braided cords and fiber specks
                    </span>
                  </div>
                </div>

                {/* Custom Color Input Picker */}
                <div className="flex items-center gap-1.5 bg-white border border-[#DFD8CC] px-2 py-1 rounded-xs shadow-2xs">
                  <input
                    type="color"
                    value={brownColor}
                    onChange={(e) => setBrownColor(e.target.value)}
                    className="w-6 h-6 rounded-xs cursor-pointer border-0 p-0 bg-transparent"
                    title="Choose custom color"
                  />
                  <span className="text-[11px] font-mono font-bold text-[#3A332C]">
                    {brownColor.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Palette Swatches for Setting 1 */}
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 mt-3">
                {BROWN_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.name}
                    type="button"
                    onClick={() => setBrownColor(swatch.hex)}
                    title={swatch.name}
                    className={`group relative flex flex-col items-center p-1 rounded-xs border transition-all cursor-pointer ${
                      brownColor.toLowerCase() === swatch.hex.toLowerCase()
                        ? "border-[#C19A6B] ring-2 ring-[#C19A6B]/40 bg-white"
                        : "border-transparent hover:border-[#DFD8CC] bg-transparent"
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-full border border-black/15 shadow-2xs transition-transform group-hover:scale-110"
                      style={{ backgroundColor: swatch.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* SETTING 2: WHITE FIBER COLOR */}
            <div className="bg-[#FAF8F5] p-5 rounded-sm border border-[#EBE5DA]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-5 h-5 rounded-full border border-black/20 shadow-xs"
                    style={{ backgroundColor: whiteColor }}
                  />
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-[#3A332C] block">
                      Setting 2: Secondary Fiber (White Color)
                    </span>
                    <span className="text-[10px] text-[#7A7065]">
                      Controls the lighter intersecting fibers and woven highlights
                    </span>
                  </div>
                </div>

                {/* Custom Color Input Picker */}
                <div className="flex items-center gap-1.5 bg-white border border-[#DFD8CC] px-2 py-1 rounded-xs shadow-2xs">
                  <input
                    type="color"
                    value={whiteColor}
                    onChange={(e) => setWhiteColor(e.target.value)}
                    className="w-6 h-6 rounded-xs cursor-pointer border-0 p-0 bg-transparent"
                    title="Choose custom color"
                  />
                  <span className="text-[11px] font-mono font-bold text-[#3A332C]">
                    {whiteColor.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Palette Swatches for Setting 2 */}
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 mt-3">
                {WHITE_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.name}
                    type="button"
                    onClick={() => setWhiteColor(swatch.hex)}
                    title={swatch.name}
                    className={`group relative flex flex-col items-center p-1 rounded-xs border transition-all cursor-pointer ${
                      whiteColor.toLowerCase() === swatch.hex.toLowerCase()
                        ? "border-[#C19A6B] ring-2 ring-[#C19A6B]/40 bg-white"
                        : "border-transparent hover:border-[#DFD8CC] bg-transparent"
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-full border border-black/15 shadow-2xs transition-transform group-hover:scale-110"
                      style={{ backgroundColor: swatch.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* =========================================================
              SHAPE SELECTION (RECTANGLE, ROUND, OVAL, RUNNER, SQUARE, ARCH)
          ========================================================= */}
          <div className="border-t border-[#EBE5DA] pt-8">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C7A63]">
                Rug Shape & Silhouette
              </span>
              <span className="text-xs font-semibold text-[#C19A6B]">{shape}</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {SHAPE_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setShape(s.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-sm border transition-all cursor-pointer ${
                    shape === s.id
                      ? "border-[#C19A6B] bg-[#F8F5F0] text-[#C19A6B] shadow-xs"
                      : "border-[#DFD8CC] text-[#7A7065] hover:border-[#C19A6B]/60 bg-white"
                  }`}
                >
                  <svg className="w-6 h-6 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
                  </svg>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-center">
                    {s.label.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* =========================================================
              DIMENSIONS & QUICK SIZES
          ========================================================= */}
          <div className="border-t border-[#EBE5DA] pt-8">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C7A63]">
                Dimensions & Sizing
              </span>
              
              {/* Unit Toggle */}
              <div className="flex items-center gap-1 bg-[#F8F5F0] p-1 rounded-sm border border-[#DFD8CC]">
                {(["ft", "cm", "in"] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => handleUnitChange(u)}
                    className={`px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-xs transition-colors cursor-pointer ${
                      unit === u ? "bg-[#3A332C] text-white" : "text-[#7A7065] hover:text-[#3A332C]"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Preset Buttons for active shape */}
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="text-[10px] uppercase font-bold text-[#8C7A63] self-center mr-1">
                Popular:
              </span>
              {PRESET_SIZES.filter((p) => p.shape === shape).map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-2.5 py-1 text-xs font-semibold border border-[#DFD8CC] hover:border-[#C19A6B] rounded-xs bg-[#FAF8F5] text-[#3A332C] transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Dimension Inputs */}
            {shape === "Round" ? (
              <div className="bg-[#FAF8F5] p-4 rounded-sm border border-[#EBE5DA] flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-[#8C7A63] block mb-1">
                    Diameter ({unit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={diameter}
                    onChange={(e) => setDiameter(e.target.value)}
                    placeholder="e.g. 6"
                    className="w-full bg-white border border-[#DFD8CC] p-3 text-lg font-serif font-semibold text-[#3A332C] focus:outline-none focus:border-[#C19A6B]"
                  />
                </div>
                <div className="text-xs text-[#8C7A63] pt-5">
                  Circular area: <strong>{areaSqFt.toFixed(1)} sq ft</strong>
                </div>
              </div>
            ) : (
              <div className="bg-[#FAF8F5] p-4 rounded-sm border border-[#EBE5DA] grid grid-cols-2 gap-4 items-center">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8C7A63] block mb-1">
                    Width ({unit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full bg-white border border-[#DFD8CC] p-3 text-lg font-serif font-semibold text-[#3A332C] focus:outline-none focus:border-[#C19A6B]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8C7A63] block mb-1">
                    Length ({unit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="e.g. 8"
                    className="w-full bg-white border border-[#DFD8CC] p-3 text-lg font-serif font-semibold text-[#3A332C] focus:outline-none focus:border-[#C19A6B]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ARTISAN NOTES */}
          <div className="border-t border-[#EBE5DA] pt-8 space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C7A63] block">
              Weaver Notes & Special Instructions (Optional)
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any specific door clearance notes or placement requests for the Bhadohi weavers..."
              className="w-full bg-[#FAF8F5] border border-[#DFD8CC] p-3 text-xs text-[#3A332C] focus:outline-none focus:border-[#C19A6B] rounded-xs"
            />
          </div>

          {/* =========================================================
              PRICE & ACTION CTA BAR (RESPONSIVE & PERFECTLY CONTAINED)
          ========================================================= */}
          <div className="border-t-2 border-[#3A332C] pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#8C7A63] font-bold block">
                  Bespoke Order Total
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-[#3A332C]">
                    {formatPrice(calculatedPrice)}
                  </span>
                  <span className="text-xs text-[#8C7A63] font-sans">
                    ({areaSqFt.toFixed(1)} sq ft)
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-[#8C7A63] text-left sm:text-right">
                Includes custom concentric weaving & insured express delivery
              </span>
            </div>

            {/* TWO EQUAL-WIDTH BUTTONS CONTAINED 100% WITHIN CARD (NO OVERFLOW) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {/* 🌟 USER-REQUESTED SEND ORDER REQUEST BUTTON */}
              <button
                type="button"
                onClick={() => {
                  setRequestSuccess(null);
                  setRequestError("");
                  setShowRequestModal(true);
                }}
                className="w-full min-h-[50px] border-2 border-[#3A332C] bg-[#FAF8F5] hover:bg-[#3A332C] text-[#3A332C] hover:text-white px-3 py-3.5 uppercase tracking-[0.14em] text-[11px] font-bold transition-all rounded-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 text-[#C19A6B] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">Send Order Request</span>
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full min-h-[50px] bg-[#3A332C] text-[#F8F5F0] hover:bg-[#C19A6B] px-4 py-3.5 uppercase tracking-[0.14em] text-[11px] font-bold transition-colors rounded-xs shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAdding ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding to Bag...</span>
                  </>
                ) : (
                  <>
                    <span className="truncate">Add to Bag</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          🌟 USER-REQUESTED SEND CUSTOM ORDER MODAL (EMAILS TO rugzora@gmail.com)
      ========================================================= */}
      <AnimatePresence>
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white max-w-lg w-full rounded-sm border border-[#DFD8CC] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* MODAL HEADER */}
              <div className="bg-[#FAF8F5] border-b border-[#EBE5DA] p-5 sm:p-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C19A6B] block">
                    Bespoke Atelier Request
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[#3A332C]">
                    {requestSuccess ? "Request Submitted Successfully" : "Send Custom Order to Atelier"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="p-1.5 text-[#8C7A63] hover:text-[#3A332C] rounded-xs transition-colors cursor-pointer"
                  title="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* MODAL CONTENT */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
                {requestSuccess ? (
                  /* SUCCESS VIEW */
                  <div className="text-center space-y-5 py-4">
                    <div className="w-16 h-16 bg-[#F5EFE6] text-[#C19A6B] rounded-full flex items-center justify-center mx-auto border border-[#E0D5C3]">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    {/* BESPOKE ORDER CODE */}
                    <div className="bg-[#FAF8F5] p-4 rounded-sm border border-[#DFD8CC]">
                      <span className="text-[10px] uppercase tracking-widest text-[#8C7A63] font-bold block mb-1">
                        Your Bespoke Order Code
                      </span>
                      <div className="flex items-center justify-center gap-3">
                        <span className="font-mono text-2xl font-bold text-[#3A332C] tracking-wider">
                          {requestSuccess.orderCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(requestSuccess.orderCode);
                            setCopiedOrderCode(true);
                            setTimeout(() => setCopiedOrderCode(false), 2500);
                          }}
                          className="text-[10px] uppercase font-bold text-[#C19A6B] hover:text-[#3A332C] border border-[#DFD8CC] px-2.5 py-1 rounded-xs bg-white cursor-pointer"
                        >
                          {copiedOrderCode ? "Copied! ✔" : "Copy"}
                        </button>
                      </div>
                    </div>

                    {/* 🌟 EXACT MESSAGE REQUESTED BY USER */}
                    <div className="p-4 bg-[#F8F5F0] border border-[#C19A6B]/40 rounded-sm">
                      <p className="text-sm sm:text-base font-serif font-semibold text-[#3A332C] leading-relaxed">
                        &ldquo;we got your request please be pationt we will send you email&rdquo;
                      </p>
                    </div>

                    <p className="text-xs text-[#7A7065] leading-relaxed">
                      Your custom design coordinates, fiber color codes, and dimensions have been dispatched directly to <strong className="text-[#3A332C]">rugzora@gmail.com</strong>. We will contact you at <strong className="text-[#3A332C]">{custEmail}</strong> shortly.
                    </p>

                    <button
                      type="button"
                      onClick={() => setShowRequestModal(false)}
                      className="w-full bg-[#3A332C] text-white py-3.5 px-6 rounded-xs uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#C19A6B] transition-colors cursor-pointer"
                    >
                      Close & Return to Studio
                    </button>
                  </div>
                ) : (
                  /* FORM VIEW */
                  <form onSubmit={handleSendCustomRequest} className="space-y-5">
                    {/* SPECS RECAP PILL */}
                    <div className="bg-[#FAF8F5] p-3.5 rounded-sm border border-[#EBE5DA] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-serif font-bold text-[#3A332C] block">
                          {shape} {shape === "Round" ? `${diameter} ${unit} Dia` : `${width}' × ${length}' ${unit}`}
                        </span>
                        <span className="text-[10px] text-[#8C7A63]">
                          Concentric Braided • {areaSqFt.toFixed(1)} sq ft
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: brownColor }} title="Primary Fiber" />
                          <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: whiteColor }} title="Secondary Fiber" />
                        </div>
                        <span className="font-serif font-bold text-[#3A332C]">
                          {formatPrice(calculatedPrice)}
                        </span>
                      </div>
                    </div>

                    {requestError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
                        {requestError}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#8C7A63] mb-1.5">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        placeholder="e.g. Mohd Shahim"
                        className="w-full bg-[#FAF8F5] border border-[#DFD8CC] p-2.5 text-xs text-[#3A332C] focus:outline-none focus:border-[#C19A6B] rounded-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#8C7A63] mb-1.5">
                        Your Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        placeholder="patron@example.com"
                        className="w-full bg-[#FAF8F5] border border-[#DFD8CC] p-2.5 text-xs text-[#3A332C] focus:outline-none focus:border-[#C19A6B] rounded-xs"
                      />
                      <span className="text-[10px] text-[#8C7A63] mt-1 block">
                        We will send order confirmation and dispatch updates to this email.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#8C7A63] mb-1.5">
                        Phone / WhatsApp Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#FAF8F5] border border-[#DFD8CC] p-2.5 text-xs text-[#3A332C] focus:outline-none focus:border-[#C19A6B] rounded-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#8C7A63] mb-1.5">
                        Special Instructions for Master Weaver
                      </label>
                      <textarea
                        rows={2}
                        value={custNotes}
                        onChange={(e) => setCustNotes(e.target.value)}
                        placeholder="Custom room size requirements, door clearance notes, or delivery timing..."
                        className="w-full bg-[#FAF8F5] border border-[#DFD8CC] p-2.5 text-xs text-[#3A332C] focus:outline-none focus:border-[#C19A6B] rounded-xs"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowRequestModal(false)}
                        className="px-4 py-3 text-xs uppercase tracking-wider font-bold text-[#7A7065] hover:text-[#3A332C] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmittingRequest}
                        className="bg-[#3A332C] text-white hover:bg-[#C19A6B] px-6 py-3 rounded-xs uppercase tracking-[0.16em] text-xs font-bold transition-colors shadow-md disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                      >
                        {isSubmittingRequest ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Sending to Atelier...</span>
                          </>
                        ) : (
                          <>
                            <span>Send to rugzora@gmail.com</span>
                            <span>→</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CustomizePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center pt-40 pb-40 min-h-screen bg-[#F8F5F0] text-center">
          <div className="w-12 h-12 border-2 border-[#C19A6B] border-t-transparent rounded-full animate-spin mb-4" />
          <span className="text-sm uppercase tracking-[0.2em] text-[#8C7A63] font-semibold">
            Loading Bespoke Atelier...
          </span>
        </div>
      }
    >
      <CustomizerContent />
    </Suspense>
  );
}
