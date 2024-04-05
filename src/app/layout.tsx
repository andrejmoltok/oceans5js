import type { Metadata } from "next";
import "./globals.css";

import AuthProvider from "@/context/Auth/AuthProvider";
import SessionProvider from "@/context/Session/SessionProvider";

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
      <body>
        <SessionProvider>
          <AuthProvider>{children}</AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
