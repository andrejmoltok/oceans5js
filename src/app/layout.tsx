import type { Metadata } from "next";
import "./globals.css";
import Menu from "@/components/Menu/menu";
import Footer from "@/components/Footer/footer";
import QPC from "./QueryClientProvider";

export const metadata: Metadata = {
  title: "Oceans5",
  description: "Battleship Clone Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QPC>
      <html lang="en">
        <body>
          <Menu />
          {children}
          <Footer />
        </body>
      </html>
    </QPC>
  );
}
