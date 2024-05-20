"use client";

import React from "react";
import { useRouter } from "next/navigation";

import ChooseButton from "./chooseButton";

import AccountLock from "./accountLock";
import AccountLockCheck from "@/actions/signin/accountLockCheck";
import LoginEmailAction from "@/actions/signin/loginEmailAction";

import { handleZodValidation, ValidationError } from "@/lib/zod/ZodError";
import { signinEmailType } from "@/lib/signin/byemail/signinEmailType";
import { signinEmailZodSchema } from "@/lib/signin/byemail/signinEmailZodSchema";

import Icon from "@mdi/react";
import styles from "@/styles/signin.module.css";
import { mdiEmail, mdiLockQuestion, mdiReload } from "@mdi/js";

import SessionExpiry from "@/actions/signoff/sessionExpiredCron";
import Reset from "./reset";
import TOTPCheck from "@/actions/signin/totpCheck";
import TOTP from "./totp";

export default function LoginEmail({
  choose,
  setChoose,
}: {
  choose: boolean;
  setChoose: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [renderTOTP, setRenderTOTP] = React.useState<boolean>(false);
  const [loginAttempt, setLoginAttempt] = React.useState<number>(0);
  const [loadReset, setLoadReset] = React.useState<boolean>(false);
  const [loginEmail, setLoginEmail] = React.useState<signinEmailType>({
    email: "",
    password: "",
    confirm: "",
  });

  const resetEmailForm = (): void => {
    setLoginEmail({
      email: "",
      password: "",
      confirm: "",
    });
  };

  // Login error messages
  const [loginError, setLoginError] = React.useState<string>("");

  // zod validation error messages
  const [emailErrors, setEmailErrors] = React.useState<
    ValidationError<typeof signinEmailZodSchema>
  >({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginError("");
    setEmailErrors({});
    setLoginEmail((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  };

  const onClickSubmit = async (data: signinEmailType) => {
    const emailLogin = await LoginEmailAction(data);
    const accountLockCheck = await AccountLockCheck({
      email: loginEmail.email,
    });
    const totpCheck = await TOTPCheck();

    if (emailLogin.success === false) {
      setLoginError(emailLogin.error as string);
      if (accountLockCheck === false) {
        setLoginAttempt(loginAttempt + 1);
      }
    } else {
      resetEmailForm();
      await SessionExpiry();
      if (totpCheck) {
        setRenderTOTP(true);
      } else {
        router.replace("/profile");
      }
    }
  };

  const schemaParse = (data: signinEmailType) => {
    handleZodValidation({
      onError: setEmailErrors,
      data: data,
      onSuccess: async () => {
        setEmailErrors({});
        await onClickSubmit(data);
        // resetEmailForm();
      },
      schema: signinEmailZodSchema,
    });
  };

  return (
    <>
      {loadReset ? (
        <Reset />
      ) : loginAttempt === 3 ? (
        <AccountLock email={loginEmail.email} />
      ) : !renderTOTP ? (
        <section className={styles.main}>
          <section className={styles.wheel}>
            <div className={styles.title}>Login with Email</div>
            <ChooseButton
              choose={choose}
              setChoose={setChoose}
              resetEmailForm={resetEmailForm}
            />
          </section>
          <section className={styles.container}>
            <form className={styles.form}>
              <label htmlFor="email">
                <Icon path={mdiEmail} size={0.8} /> Email:
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginEmail.email}
                onChange={(e) => handleInputChange(e)}
                autoComplete="on"
                placeholder="email"
              />
              <label htmlFor="password">
                <Icon path={mdiLockQuestion} size={0.8} /> Password:
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginEmail.password}
                onChange={(e) => handleInputChange(e)}
                autoComplete="on"
                placeholder="password"
              />
              <label htmlFor="confirm">
                <Icon path={mdiLockQuestion} size={0.8} /> Confirm:
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="password"
                id="confirm"
                name="confirm"
                value={loginEmail.confirm}
                onChange={(e) => handleInputChange(e)}
                autoComplete="on"
                placeholder="confirm password"
              />
              <input
                type="submit"
                value="Log In"
                onClick={(event) => {
                  event?.preventDefault();
                  schemaParse(loginEmail);
                }}
              />
              <div className={styles.method}>
                <div>
                  <span style={{ color: "red" }}>*</span> - marked as compulsory
                </div>
                <div>
                  <span>
                    <Icon path={mdiReload} size={0.7} />
                  </span>{" "}
                  - change login method
                </div>
              </div>
              <div
                onClick={() => setLoadReset(true)}
                style={{
                  border: "1px solid black",
                  borderRadius: "5px",
                  padding: "3px",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                Reset password
              </div>
            </form>
          </section>
          <section className={styles.error}>
            {loginAttempt > 0 && (
              <div style={{ color: "red" }}>
                Failed login attempts: {loginAttempt} of 3
              </div>
            )}
            {emailErrors && emailErrors.email && (
              <div style={{ color: "red" }}>Email - {emailErrors.email}</div>
            )}
            {emailErrors && emailErrors.password && (
              <div style={{ color: "red" }}>
                Password - {emailErrors.password}
              </div>
            )}
            {emailErrors && emailErrors.confirm && (
              <div style={{ color: "red" }}>
                Confirm - {emailErrors.confirm}
              </div>
            )}
            {loginError && <div style={{ color: "red" }}>{loginError}</div>}
          </section>
        </section>
      ) : (
        <>
          <TOTP />
        </>
      )}
    </>
  );
}
