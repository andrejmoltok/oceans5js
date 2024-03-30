import type { Metadata } from "next";
import "./globals.css";

import AuthProvider from "@/context/Auth/AuthProvider";
import SessionProvider from "@/context/Session/SessionProvider";

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
      <AuthProvider>
        <SessionProvider>
          <body>{children}</body>
        </SessionProvider>
      </AuthProvider>
    </html>
  );
}
