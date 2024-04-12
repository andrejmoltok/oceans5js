"use client";

import { AuthContext } from "@/context/Auth/AuthContext";
import { SessionContext } from "@/context/Session/SessionContext";
import React from "react";

export default function Page() {
  const [isAuth, setIsAuth] = React.useContext(AuthContext);
  const [isSession, setIsSession] = React.useContext(SessionContext);
  return (
    <>
      Oceans5 - Battleship clone game
      <div>
        <a href="/signup">SignUp</a>
        <a href="/signin">SignIn</a>
        {isAuth && (
          <>
            <a href="/profile">Profile</a>
          </>
        )}
      </div>
    </>
  );
}
