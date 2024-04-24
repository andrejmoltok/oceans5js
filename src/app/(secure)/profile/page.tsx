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
  const [mfaChecked, setMFAChecked] = React.useState<boolean>(false);
  React.useEffect(() => {
    (async () => {
      const fetchedUser = await FetchUser();
      setUser(fetchedUser as User);
    })();
  }, []);
  React.useEffect(() => {
    (async () => {
      await Switch(user?.id as number, mfaChecked);
    })();
  }, [user?.id, mfaChecked]);
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
              checked={mfaChecked}
              onClick={() => {
                setMFAChecked(!mfaChecked);
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
