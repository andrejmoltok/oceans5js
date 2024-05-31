"use client";

import React from "react";
import Profile from "./profile";
import { User } from "@/actions/user/user";
import MFAClient from "./mfaClient";
import { useCheckStore } from "@/lib/zustand/store/checkStore";
import { useUserStore } from "@/lib/zustand/store/userStore";

export default function Page() {
  // const { check, needCheck, fetchMFAComplete } = useCheckStore();
  const { user, needRefetch, fetchUserData } = useUserStore();

  React.useEffect(() => {
    fetchUserData();
  }, [fetchUserData, needRefetch]);

  // React.useEffect(() => {
  //   fetchMFAComplete();
  // }, [fetchMFAComplete, needCheck]);
  return (
    <>
      <Profile data={user as User}>
        <MFAClient fetchedUser={user as User} />
      </Profile>
    </>
  );
}
