"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AccountLockAction from "@/actions/signin/accountLockAction";

export default function AccountLock({
  username,
  email,
}: {
  username?: string;
  email?: string;
}): void {
  const router = useRouter();
  React.useEffect(() => {
    async function Lock() {
      if (username !== undefined && email === undefined) {
        await AccountLockAction({ username: username });
        router.push("/");
      } else if (email !== undefined && username === undefined) {
        await AccountLockAction({ email: email });
        router.push("/");
      } else {
        router.push("/");
      }
    }
    Lock();
  }, [router, username, email]);
}
