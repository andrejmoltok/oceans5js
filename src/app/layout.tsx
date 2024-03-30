import type { Metadata } from "next";
import "./globals.css";

import AuthProvider from "@/context/Auth/AuthProvider";
import SessionProvider from "@/context/Session/SessionProvider";

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
        <AuthProvider>
          <SessionProvider>{children}</SessionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
