"use client";

import React from "react";

import { User } from "@/actions/user/user";

import Switch from "@/actions/mfa/switch";

import styles from "@/styles/mfa.module.css";
import clsx from "clsx";

export default function MFA({ fetchedUser }: { fetchedUser: User }) {
  const [mfaCheckBox, setMFACheckBox] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (fetchedUser) {
      setMFACheckBox(fetchedUser.mfaEnabled as boolean);
    }
  }, [fetchedUser]);

  const mfaToggle = async (id: number, setting: boolean) => {
    await Switch(id, setting);
  };

  const handleMFAToggle = React.useCallback(async () => {
    await mfaToggle(fetchedUser?.id as number, !mfaCheckBox);
    setMFACheckBox(!mfaCheckBox);
  }, [fetchedUser?.id, mfaCheckBox]);

  return (
    <section>
      Multi-Factor Authentication: {mfaCheckBox ? "Enabled" : "Disabled"}{" "}
      <label className={styles.switch}>
        <input
          type="checkbox"
          checked={mfaCheckBox}
          onChange={() => {
            handleMFAToggle();
          }}
        ></input>
        <span className={clsx([styles.slider, styles.round])}></span>
      </label>
    </section>
  );
}
