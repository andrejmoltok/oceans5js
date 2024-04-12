import type { Metadata } from "next";
import "./globals.css";

import { sessionExpiry } from "@/actions/signoff/sessionExpiredCron";

export const metadata: Metadata = {
  title: "Oceans5",
  description: "Battleship Clone Game",
};

sessionExpiry.start();

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
