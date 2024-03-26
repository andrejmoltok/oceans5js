import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oceans5",
  description: "Battleship Clone Game in NextJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
