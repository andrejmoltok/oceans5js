"use client";

import React from "react";
import { useRouter } from "next/navigation";
import LogoutAction from "@/actions/signoff/logoutAction";
import FetchUser from "@/actions/user/fetchUser";
import { User } from "@/actions/user/user";
import { AuthSessionContext } from "@/context/Session/AuthSessionContext";

export function Profile() {
  const router = useRouter();
  const [user, setUser] = React.useState<User>(null);
  const [isSession, setSession, isAuth, setIsAuth] =
    React.useContext(AuthSessionContext);

  React.useEffect(() => {
    async function userFetcher() {
      const fetchedUser = await FetchUser();
      setUser(fetchedUser as User);
    }
    if (isSession) {
      console.log("session", isSession);
      userFetcher();
    }
  }, [isSession]);
  return (
    <>
      {isSession && (
        <div>
          <p>
            username: <span>{user?.username}</span>
          </p>
          <p>
            firstname: <span>{user?.firstname}</span>
          </p>
          <p>
            Multi Factor Authentication Enabled:{" "}
            <span>{user?.mfaEnabled.toString()}</span>
          </p>
          <input
            type="button"
            value="Log Out"
            onClick={async () => {
              await LogoutAction();
              router.replace("/");
            }}
          />
        </div>
      )}
    </>
  );
}
