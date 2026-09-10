import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      orderCode,
      customerName,
      customerEmail,
      customerPhone,
      shape,
      dimensions,
      areaSqFt,
      brownColor,
      whiteColor,
      thickness,
      edgeFinish,
      monogramText,
      specialInstructions,
      calculatedPrice,
      currency,
      configUrl,
    } = body;

    const newRequest = {
      orderCode: orderCode || `RZ-CUST-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: customerName || "Anonymous Patron",
      customerEmail: customerEmail || "",
      customerPhone: customerPhone || "",
      shape: shape || "Rectangular",
      dimensions: dimensions || "",
      areaSqFt: areaSqFt || 0,
      brownColor: brownColor || "#B58A60",
      whiteColor: whiteColor || "#F8F3E9",
      thickness: thickness || "Classic Chunky (12mm)",
      edgeFinish: edgeFinish || "Seamless Tailored Fold",
      monogramText: monogramText || "",
      specialInstructions: specialInstructions || "",
      calculatedPrice: calculatedPrice || 0,
      currency: currency || "USD",
      configUrl: configUrl || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // 1. Try to persist into Supabase custom_orders table (if table exists)
    try {
      await supabase.from("custom_orders").insert([
        {
          order_code: newRequest.orderCode,
          customer_name: newRequest.customerName,
          customer_email: newRequest.customerEmail,
          customer_phone: newRequest.customerPhone,
          shape: newRequest.shape,
          dimensions: newRequest.dimensions,
          area_sq_ft: newRequest.areaSqFt,
          fiber_color_1: newRequest.brownColor,
          fiber_color_2: newRequest.whiteColor,
          thickness: newRequest.thickness,
          edge_finish: newRequest.edgeFinish,
          monogram_text: newRequest.monogramText,
          special_instructions: newRequest.specialInstructions,
          price: newRequest.calculatedPrice,
          currency: newRequest.currency,
          config_url: newRequest.configUrl,
          created_at: newRequest.createdAt,
        },
      ]);
    } catch (dbErr) {
      // Table might not exist yet, fallback to site_content
    }

    // 2. Persist into site_content custom_requests list (guaranteed fallback)
    try {
      const { data: existingData } = await supabase
        .from("site_content")
        .select("data")
        .eq("id", "custom_requests")
        .maybeSingle();

      const currentList = Array.isArray(existingData?.data?.list)
        ? existingData.data.list
        : [];
      const updatedList = [newRequest, ...currentList];

      await supabase.from("site_content").upsert({
        id: "custom_requests",
        data: { list: updatedList },
      });
    } catch (siteContentErr) {
      console.error("Supabase site_content persistence notice:", siteContentErr);
    }

    // 3. Dispatch Email to rugzora@gmail.com
    try {
      const emailPayload = {
        _subject: `[RugZora Bespoke] New Custom Rug Request #${newRequest.orderCode} from ${newRequest.customerName}`,
        _replyto: newRequest.customerEmail,
        "Order Code": newRequest.orderCode,
        "Customer Name": newRequest.customerName,
        "Customer Email": newRequest.customerEmail,
        "Customer Phone": newRequest.customerPhone || "Not provided",
        "Rug Shape": newRequest.shape,
        "Dimensions": newRequest.dimensions,
        "Area (sq ft)": `${newRequest.areaSqFt} sq ft`,
        "Setting 1 (Brown Fiber Color)": newRequest.brownColor,
        "Setting 2 (White Fiber Color)": newRequest.whiteColor,
        "Pile Thickness": newRequest.thickness,
        "Edge Finish": newRequest.edgeFinish,
        "Bespoke Monogram": newRequest.monogramText || "None",
        "Special Instructions": newRequest.specialInstructions || "None",
        "Estimated Price": `${newRequest.currency} ${newRequest.calculatedPrice}`,
        "Visualizer Link": newRequest.configUrl,
        "Timestamp": newRequest.createdAt,
      };

      await fetch("https://formsubmit.co/ajax/rugzora@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(emailPayload),
      }).catch((fetchErr) => {
        console.warn("FormSubmit delivery notice:", fetchErr);
      });
    } catch (emailErr) {
      console.warn("Email dispatch notice:", emailErr);
    }

    return NextResponse.json({
      success: true,
      orderCode: newRequest.orderCode,
      message: "we got your request please be pationt we will send you email",
    });
  } catch (error: any) {
    console.error("Custom request submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process custom request",
      },
      { status: 500 }
    );
  }
}
