"use client";

import React from "react";
import { AuthSessionContext } from "./AuthSessionContext";

export default function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSession, setIsSession] = React.useState<string>("");
  const [isAuth, setIsAuth] = React.useState<boolean>(false);

  return (
    <AuthSessionContext.Provider
      value={[isSession, setIsSession, isAuth, setIsAuth]}
    >
      {children}
    </AuthSessionContext.Provider>
  );
}
