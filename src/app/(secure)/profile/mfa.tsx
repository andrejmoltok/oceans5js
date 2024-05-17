"use client";

import React from "react";

import { redirect } from "next/navigation";

import { User } from "@/actions/user/user";

import Disable from "./disable";
import { disableType } from "@/lib/mfa/disableType";

import Switch from "@/actions/mfa/switch";
import MFASetupCheck from "@/actions/mfa/mfaSetupCheck";
import ValidPass from "@/actions/mfa/disable/validPass";

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
    if (mfaCheckBox) {
      setDisable(true);
    } else {
      await mfaToggle(fetchedUser?.id as number, !mfaCheckBox);
      setMFACheckBox(!mfaCheckBox);
    }
  }, [fetchedUser?.id, mfaCheckBox]);

  React.useEffect(() => {
    if (mfaCheckBox && !mfaComplete) {
      redirect("/profile/mfa");
    }
  }, [mfaCheckBox, mfaComplete]);

  const [validPassError, setValidPassError] = React.useState<string>("");

  const handleDisableSubmit = async (passwordData: disableType) => {
    const validatePass = await ValidPass(passwordData);

    if (validatePass.success) {
      await mfaToggle(fetchedUser?.id as number, false);
      setMFACheckBox(false);
      setDisable(false);
    } else {
      setValidPassError(validatePass.error as string);
      setMFACheckBox(true);
      setDisable(true);
    }
  };

  if (disable) {
    return (
      <Disable
        setMFACheckBox={setMFACheckBox}
        setDisable={setDisable}
        handleDisableSubmit={handleDisableSubmit}
        validPassError={validPassError}
        setValidPassError={setValidPassError}
      />
    );
  }

  return (
    <section>
      Multi-Factor Authentication:{" "}
      {!mfaCheckBox && <span className={styles.disabled}>Disabled </span>}
      {mfaCheckBox && <span className={styles.enabled}>Enabled </span>}
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
  );
}
