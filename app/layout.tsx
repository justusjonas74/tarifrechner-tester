import type { Metadata, Viewport } from "next";
import { ToastContainer } from "react-toastify";
// add bootstrap css
import "bootstrap/dist/css/bootstrap.css";

import NavbarComponent from "@/components/NavBarComponent";

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
        <NavbarComponent />
        {children} <ToastContainer />
      </body>
    </html>
  );
}
