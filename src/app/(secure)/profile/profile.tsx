"use client";

import React from "react";
import { useRouter } from "next/navigation";

import LogoutAction from "@/actions/signoff/logoutAction";
import { User } from "@/actions/user/user";

export default function Profile({
  data,
  children,
}: {
  data: User;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = React.useState<User>();

  React.useEffect(() => {
    if (data) {
      setUser(data as User);
    }
  }, [data]);

  return (
    <>
      <section>
        <p>
          username: <span>{user?.username}</span>
        </p>
        <p>
          firstname: <span>{user?.firstname}</span>
        </p>
        {children}
        <input
          type="button"
          value="Log Out"
          onClick={async () => {
            await LogoutAction();
            router.replace("/");
          }}
        />
      </section>
    </>
  );
}
