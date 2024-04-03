"use client";

import React from "react";
import AccountLockAction from "@/actions/signin/accountLockAction";

export default function AccountLock() {
  (async () => {
    await AccountLockAction();
  })();
  return <>Your account has been locked for 30 minutes.</>;
}
