"use client";

import React from "react";
import AccountLockAction from "@/actions/signin/accountLockAction";

export default function AccountLock({
  username,
  email,
}: {
  username?: string;
  email?: string;
}) {
  (async () => {
    if (username !== undefined && email === undefined) {
      await AccountLockAction({ username: username });
    } else if (email !== undefined && username === undefined) {
      await AccountLockAction({ email: email });
    } else {
      return;
    }
  })();
  return <>Your account has been locked for 30 minutes.</>;
}
