"use client";

import React from "react";
import { SessionContext } from "./SessionContext";

export default function SessionProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSession, setIsSession] = React.useState<string>("");

  return (
    <SessionContext.Provider value={[isSession, setIsSession]}>
      {children}
    </SessionContext.Provider>
  );
}
