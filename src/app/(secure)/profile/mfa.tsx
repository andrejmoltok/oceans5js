"use client";

import React from "react";

import { User } from "@/actions/user/user";

import Switch from "@/actions/mfa/switch";

import styles from "@/styles/mfa.module.css";
import clsx from "clsx";

export default function MFA({ fetchedUser }: { fetchedUser: User }) {
  const [mfaSetting, setMFASetting] = React.useState<boolean>(false);
  const [mfaCheckBox, setMFACheckBox] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (fetchedUser) {
      setMFACheckBox(fetchedUser.mfaEnabled as boolean);
    }
  }, [fetchedUser]);

  const mfaToggle = async (id: number, setting: boolean) => {
    console.log(id, setting);
    await Switch(id, setting);
  };

  const handleMFAToggle = React.useCallback(async () => {
    await mfaToggle(fetchedUser?.id as number, mfaSetting);
  }, [fetchedUser?.id, mfaSetting]);

  return (
    <section>
      Enable Multi-Factor Authentication:{" "}
      <label className={styles.switch}>
        <input
          type="checkbox"
          checked={mfaCheckBox}
          onChange={() => {
            handleMFAToggle();
          }}
          onClick={() => {
            setMFASetting(!mfaSetting);
            setMFACheckBox(!mfaCheckBox);
          }}
        ></input>
        <span className={clsx([styles.slider, styles.round])}></span>
      </label>
    </section>
  );
}
