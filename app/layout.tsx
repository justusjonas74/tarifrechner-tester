import type { Metadata, Viewport } from "next";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Inter } from "next/font/google";
// import './globals.css'

// add bootstrap css
import "bootstrap/dist/css/bootstrap.css";

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
      <body>
        {children} <ToastContainer />
      </body>
    </html>
  );
}
