import type { Metadata } from "next";
import "./globals.css";
import Menu from "@/components/Menu/menu";

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
    <html lang="en">
      <body>
        <Menu />
        {children}
      </body>
    </html>
  );
}
