"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import { CustomizerContent } from "@/app/customize/page";

export default function ProductCustomizePage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);

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
      <CustomizerContent initialProductId={id} />
    </Suspense>
  );
}