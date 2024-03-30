"use client";

import React from "react";
import { useRouter } from "next/navigation";
import LogoutAction from "@/actions/signoff/logoutAction";

export default function Page() {
  const router = useRouter();
  return (
    <>
      <div>
        Logged In
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
