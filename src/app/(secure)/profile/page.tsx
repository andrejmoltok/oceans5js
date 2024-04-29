"use client";

import React from "react";
import { useRouter } from "next/navigation";

import LogoutAction from "@/actions/signoff/logoutAction";
import Switch from "@/actions/mfa/switch";
import FetchUser from "@/actions/user/fetchUser";
import { User } from "@/actions/user/user";

import styles from "@/styles/mfa.module.css";
import clsx from "clsx";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = React.useState<User>(null);
  const [mfacheck, setMFACheck] = React.useState<boolean>(false);
  const [mfaSetting, setMFASetting] = React.useState<boolean>(false);

  React.useEffect(() => {
    async function handleMounted() {
      const fetchedUser = (await FetchUser()) as User;
      setUser(fetchedUser);
      setMFACheck(fetchedUser?.mfaEnabled as boolean);
    }
    handleMounted().catch(console.error);
  }, []);

  const handleMfaToggle = async (id: number, setting: boolean) => {
    await Switch(id, setting);
  };

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
          Enable Multi-Factor Authentication:{" "}
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={mfacheck}
              onChange={() => {
                setMFACheck(!mfacheck);
                setMFASetting(!mfaSetting);
              }}
              onClick={async () => {
                await handleMfaToggle(user?.id as number, mfaSetting);
              }}
            ></input>
            <span className={clsx([styles.slider, styles.round])}></span>
          </label>
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
