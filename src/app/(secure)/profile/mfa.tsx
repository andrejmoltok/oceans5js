"use client";

import React from "react";

import { redirect } from "next/navigation";

import { User } from "@/actions/user/user";

import Disable from "./disable";

import Switch from "@/actions/mfa/switch";
import MFASetupCheck from "@/actions/mfa/mfaSetupCheck";

import styles from "@/styles/mfa.module.css";
import clsx from "clsx";

export default function MFA({ fetchedUser }: { fetchedUser: User }) {
  const [mfaComplete, setMFAComplete] = React.useState<boolean>(false);
  const [mfaCheckBox, setMFACheckBox] = React.useState<boolean>(false);
  const [disable, setDisable] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (fetchedUser) {
      setMFACheckBox(fetchedUser.mfaEnabled);
    }
  }, [fetchedUser]);

  React.useEffect(() => {
    async function CompleteCheck() {
      const check: boolean | null = await MFASetupCheck(
        fetchedUser?.id as number
      );
      setMFAComplete(check as boolean);
    }
    CompleteCheck();
  }, [fetchedUser]);

  const mfaToggle = async (id: number, setting: boolean) => {
    await Switch(id, setting);
  };

  const handleMFAToggle = React.useCallback(async () => {
    await mfaToggle(fetchedUser?.id as number, !mfaCheckBox);
    setMFACheckBox(!mfaCheckBox);
    setDisable(!disable);
  }, [fetchedUser?.id, mfaCheckBox, disable]);

  //TODO - check if setup is completed, if true don't redirect else redirect
  React.useEffect(() => {
    if (mfaCheckBox === true && mfaComplete === false) {
      redirect("/profile/mfa");
    } else if (mfaCheckBox === false && mfaComplete === true) {
      setDisable(true);
    }
  }, [mfaCheckBox, mfaComplete]);

  // if MFA is being disabled, then render component which asks for user's password
  if (disable) {
    return (
      <>
        <section>
          Multi-Factor Authentication:{" "}
          {!mfaCheckBox && <span className={styles.disabled}>Disabled</span>}{" "}
          <label className={styles.switch}>
            <input
              id="switch"
              type="checkbox"
              checked={mfaCheckBox}
              onChange={() => {
                handleMFAToggle();
              }}
            ></input>
            <span className={clsx([styles.slider, styles.round])}></span>
          </label>
        </section>
        <Disable />
      </>
    );
  } else {
    return (
      <>
        <section>
          Multi-Factor Authentication:{" "}
          {mfaCheckBox && <span className={styles.enabled}>Enabled</span>}{" "}
          <label className={styles.switch}>
            <input
              id="switch"
              type="checkbox"
              checked={mfaCheckBox}
              onChange={() => {
                handleMFAToggle();
              }}
            ></input>
            <span className={clsx([styles.slider, styles.round])}></span>
          </label>
        </section>
      </>
    );
  }
}
