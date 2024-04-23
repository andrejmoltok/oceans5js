"use client";

import React from "react";

import { handleZodValidation, ValidationError } from "@/lib/zod/ZodError";
import { resetWithEmailZodSchema } from "@/lib/reset/resetWithEmailZodSchema";

import Icon from "@mdi/react";
import { mdiEmail, mdiLoading, mdiCheck } from "@mdi/js";

import styles from "@/styles/signin.module.css";

import ResetLink from "@/actions/reset/resetlink";
import { resetInputType } from "@/lib/reset/resetInputType";

export default function Reset() {
  const [sentSuccess, setSentSuccess] = React.useState<boolean>(false);
  const [sending, setSending] = React.useState<boolean>(false);
  const [sentError, setSentError] = React.useState<string>("");
  const [emailInput, setEmailInput] = React.useState<resetInputType>({
    email: "",
    confirm: "",
  });

  const resetForm = () => {
    setEmailInput({
      email: "",
      confirm: "",
    });
  };

  const [resetError, setResetError] = React.useState<
    ValidationError<typeof resetWithEmailZodSchema>
  >({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetError({});
    setEmailInput((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  };

  const schemaParse = (data: resetInputType) => {
    handleZodValidation({
      onError: setResetError,
      data: data,
      onSuccess: async () => {
        setResetError({});
        setSentError("");
        const resetSuccess = await ResetLink({ userEmail: data.email });
        if (resetSuccess === true) {
          setSentSuccess(true);
        } else {
          setSentError(
            "Reset code could not be sent. Admin has been notified!"
          );
        }
        resetForm();
      },
      schema: resetWithEmailZodSchema,
    });
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.title}>Password Reset Step 1</div>
        <div className={styles.container}>
          <div className={styles.icons}>
            <Icon path={mdiEmail} size={0.8} />
            <Icon path={mdiEmail} size={0.8} />
          </div>
          <form className={styles.form}>
            <label htmlFor="email">Email: </label>
            <input
              type="text"
              id="email"
              name="email"
              value={emailInput.email}
              onChange={(e) => handleInputChange(e)}
              placeholder="Enter your email"
              aria-placeholder="Enter your email"
            />
            <label htmlFor="confirm">Confirm: </label>
            <input
              type="text"
              id="confirm"
              name="confirm"
              value={emailInput.confirm}
              onChange={(e) => handleInputChange(e)}
              placeholder="Enter your email again"
              aria-placeholder="Enter your email again"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <input
                type="submit"
                value={sentSuccess ? "Sent!" : sending ? "Sending..." : "Send"}
                onClick={(event) => {
                  event?.preventDefault();
                  schemaParse(emailInput);
                  setSending(true);
                }}
                disabled={sentSuccess || sending ? true : false}
              />
              {sentSuccess ? (
                <div>
                  <Icon
                    path={mdiCheck}
                    size={0.7}
                    title={"Checkmark"}
                    description={"Reset code sent successfully checkmark"}
                  />
                </div>
              ) : sending ? (
                <div>
                  <Icon
                    path={mdiLoading}
                    size={0.7}
                    title={"Loading"}
                    description={"Sending password reset code through email"}
                    spin
                  />
                </div>
              ) : null}
            </div>
          </form>
        </div>
        <div className={styles.error}>
          {resetError && resetError.confirm && (
            <div style={{ color: "red" }}>{resetError.confirm}</div>
          )}
          {sentError && <div style={{ color: "red" }}>{sentError}</div>}
        </div>
      </div>
    </>
  );
}
