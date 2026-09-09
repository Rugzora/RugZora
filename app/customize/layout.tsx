import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bespoke Rug Customizer Studio | RugZora",
  description:
    "Design your custom hand-braided carpet. Choose shapes, sizes, custom measurements, and duo-tone palette contrasts handcrafted in Bhadohi.",
};

export default function CustomizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
