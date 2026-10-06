import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({ variable: "--font-sans", subsets: ["latin"] });
const display = Fraunces({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Linasprint — Indkøbsposer & muleposer med logo",
  description: "Indkøbsposer og muleposer med dit logo. Gratis vareprøver, gratis digital korrektur og levering fra 5 hverdage.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="da" className={`${sans.variable} ${display.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
