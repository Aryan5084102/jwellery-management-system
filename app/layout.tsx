import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { Providers } from "../components/Providers";

export const metadata: Metadata = {
  title: "Lavkush Verma Jwellers - Munim",
  description: "Accounting Software for Jewelry Business",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex min-h-screen">
            {/* Left Sidebar */}
            <Sidebar />
            
            {/* Right Main Content */}
            <main className="flex-1 ml-64 bg-gray-100 min-h-screen">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

