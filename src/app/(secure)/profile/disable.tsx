"use client";

import React from "react";

import styles from "@/styles/disable.module.css";

import Icon from "@mdi/react";
import { mdiLockQuestion } from "@mdi/js";

import { disableType } from "@/lib/mfa/disableType";
import { disableZodSchema } from "@/lib/mfa/disableZodSchema";
import { handleZodValidation, ValidationError } from "@/lib/zod/ZodError";

// TODO - ask for users' password to disable MFA
// TODO - add return button to redirect user to profile page
export default function Disable() {
  const [mfaDisable, setMFADisable] = React.useState<disableType>({
    password: "",
    confirm: "",
  });

  const resetDisableForm = (): void => {
    setMFADisable({
      password: "",
      confirm: "",
    });
  };

  const [disableErrors, setDisableErrors] = React.useState<
    ValidationError<typeof disableZodSchema>
  >({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDisableErrors({});
    setMFADisable((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  };

  const onClickSubmit = async (data: disableType) => {};

  const schemaParse = (data: disableType) => {
    handleZodValidation({
      onError: setDisableErrors,
      data: data,
      onSuccess: async () => {
        setDisableErrors({});
        await onClickSubmit(data);
        // resetUserForm();
      },
      schema: disableZodSchema,
    });
  };

  return (
    <>
      <section className={styles.main}>
        <section className={styles.wheel}>
          <span className={styles.title}>Disable MFA</span>
        </section>
        <section className={styles.container}>
          <form className={styles.form}>
            <label htmlFor="password">
              <Icon path={mdiLockQuestion} size={0.8} /> Password:
              <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={mfaDisable.password}
              onChange={(e) => handleInputChange(e)}
              autoComplete="on"
              placeholder="password"
            />
            <label htmlFor="confirm">
              <Icon path={mdiLockQuestion} size={0.8} />
              Confirm:<span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="password"
              id="confirm"
              name="confirm"
              value={mfaDisable.confirm}
              onChange={(e) => handleInputChange(e)}
              autoComplete="on"
              placeholder="confirm password"
            />
            <div className={styles.disableButtons}>
              <input
                type="submit"
                value="Cancel"
                onClick={(event) => {
                  event?.preventDefault();
                  //TODO close Disable window and set mfaCheckBox to Enabled
                }}
              />
              <input
                type="submit"
                value="Submit"
                onClick={(event) => {
                  event?.preventDefault();
                  schemaParse(mfaDisable);
                }}
              />
            </div>
          </form>
        </section>
        <section className={styles.error}>
          {disableErrors && disableErrors.password && (
            <div style={{ color: "red" }}>
              Password - {disableErrors.password}
            </div>
          )}
          {disableErrors && disableErrors.confirm && (
            <div style={{ color: "red" }}>
              Confirm - {disableErrors.confirm}
            </div>
          )}
        </section>
      </section>
    </>
  );
}
