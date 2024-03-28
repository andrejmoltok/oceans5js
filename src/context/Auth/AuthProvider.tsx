"use client";

import React from "react";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuth, setIsAuth] = React.useState<boolean>(false);

  return (
    <AuthContext.Provider value={[isAuth, setIsAuth]}>
      {children}
    </AuthContext.Provider>
  );
}
