"use client";

import React from "react";

import MFASetup from "@/actions/mfa/mfaSetup";

import styles from "@/styles/totp.module.css";
import Icon from "@mdi/react";
import { mdiLoading, mdiCheck } from "@mdi/js";

export default function TOTP({
  secret,
}: {
  secret: { secret: string; uri: string; qr: string } | undefined;
}) {
  const [verifySecret, setVerifySecret] = React.useState<boolean>(false);
  const [verifySuccess, setVerifySuccess] = React.useState<boolean>(false);
  const [successMessage, setSuccessMessage] = React.useState<string>("");
  const [isDisabled, setIsDisabled] = React.useState<boolean>(false);
  const [values, setValues] = React.useState<string[]>(Array(6).fill(""));
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>(
    Array(6).fill(null)
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValues = [...values];
    newValues[index] = e.target.value;

    if (e.target.value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    setValues(newValues);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  React.useEffect(() => {
    if (values.every((val) => val === "")) {
      setIsDisabled(false);
      setVerifySecret(false);
    } else if (values.every((val) => val !== "") && values[5] !== "") {
      setIsDisabled(true);
      setVerifySecret(true);
    }
  }, [values]);

  React.useEffect(() => {
    async function Verify() {
      if (verifySecret) {
        const setup = await MFASetup({
          input: values,
          secret: `${secret?.secret}`,
        });
        if (setup?.success === true) {
          setVerifySuccess(true);
          setVerifySecret(false);
        } else {
          setVerifySecret(false);
          setVerifySuccess(false);
          setValues(Array(6).fill(""));
          setSuccessMessage("Please try a new code!");
        }
      }
    }
    Verify();
  }, [verifySecret, values, secret?.secret]);

  return (
    <>
      <section className={styles.main}>
        <div className={styles.totp}>
          {values.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(node) => {
                if (node) {
                  inputsRef.current[index] = node;
                }
              }}
              disabled={isDisabled}
            />
          ))}
        </div>
        <div className={styles.icons}>
          {verifySecret ? (
            <Icon path={mdiLoading} size={1.2} spin />
          ) : verifySuccess ? (
            <Icon path={mdiCheck} size={1.2} />
          ) : successMessage ? (
            <span
              style={{
                margin: "auto",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                color: "red",
              }}
            >
              {successMessage}
            </span>
          ) : null}
        </div>
      </section>
    </>
  );
}
