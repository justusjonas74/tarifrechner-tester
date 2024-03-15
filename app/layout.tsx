import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
// import './globals.css'

// add bootstrap css
import "bootstrap/dist/css/bootstrap.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tarifrechner Test-Tool",
  description: "Testet den VVO-Tarifrechner",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
