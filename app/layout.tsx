import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
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
          {/* <Header /> */}
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}

