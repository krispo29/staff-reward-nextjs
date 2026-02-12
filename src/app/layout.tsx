import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Staff Lucky Draw | ระบบจับรางวัลพนักงาน",
  description:
    "ระบบจับรางวัลพนักงานแบบ Slot Machine สำหรับจับรางวัลผู้โชคดี 10 ท่าน รางวัลละ 10,000 บาท",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="dark">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster richColors position="top-center" theme="dark" />
      </body>
    </html>
  );
}
