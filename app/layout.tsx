import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FarmOptima | Agricultural Selling Intelligence",
  description: "An editorial decision-support platform connecting mandi price intelligence, net-realization economics, and smart RouteMesh transport pooling for farmers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-stone-900 bg-[#fbf9f5] min-h-screen flex flex-col selection:bg-emerald-900 selection:text-amber-200">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
