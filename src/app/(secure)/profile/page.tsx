"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import MFA from "./mfa";
import LogoutAction from "@/actions/signoff/logoutAction";
import FetchUser from "@/actions/user/fetchUser";
import { User } from "@/actions/user/user";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = React.useState<User>(null);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await FetchUser(),
  });

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
        <MFA fetchedUser={user} />
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
