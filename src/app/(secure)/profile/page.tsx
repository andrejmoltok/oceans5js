"use client";

import React from "react";
import { useRouter } from "next/navigation";
import LogoutAction from "@/actions/signoff/logoutAction";
import FetchUser from "@/actions/user/fetchUser";
import { User } from "@/actions/user/user";
import { AuthContext } from "@/context/Auth/AuthContext";
import { SessionContext } from "@/context/Session/SessionContext";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = React.useState<User>(null);
  const [isAuth, setIsAuth] = React.useContext(AuthContext);
  const [isSession, setIsSession] = React.useContext(SessionContext);
  React.useEffect(() => {
    (async () => {
      const fetchedUser = await FetchUser();
      setUser(fetchedUser as User);
    })();
  }, [isAuth, isSession]);
  return (
    <>
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
    </>
  );
}
