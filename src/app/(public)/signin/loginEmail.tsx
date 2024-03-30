"use client";

import React from "react";
import Icon from "@mdi/react";
import ChooseButton from "./chooseButton";
import { useRouter } from "next/navigation";

import LoginEmailAction from "@/actions/signin/loginEmailAction";

import { handleZodValidation, ValidationError } from "@/lib/zod/ZodError";
import { signinEmailType } from "@/lib/signin/byemail/signinEmailType";
import { signinEmailZodSchema } from "@/lib/signin/byemail/signinEmailZodSchema";

import styles from "@/styles/signin.module.css";
import { mdiEmail, mdiLockQuestion, mdiReload } from "@mdi/js";

export default function LoginEmail({
  choose,
  setChoose,
}: {
  choose: boolean;
  setChoose: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();

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

  const [loginError, setLoginError] = React.useState<string>("");

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

    if (emailLogin.success === false) {
      setLoginError(emailLogin.error as string);
    } else {
      resetEmailForm();
      router.replace("/profile");
    }
  };

  const schemaParse = (data: signinEmailType) => {
    handleZodValidation({
      onError: setEmailErrors,
      data: data,
      onSuccess: async () => {
        setEmailErrors({});
        await onClickSubmit(data);
        resetEmailForm();
      },
      schema: signinEmailZodSchema,
    });
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.wheel}>
          <div className={styles.title}>Login with Email</div>
          <ChooseButton
            choose={choose}
            setChoose={setChoose}
            resetEmailForm={resetEmailForm}
          />
        </div>
        <div className={styles.container}>
          <div className={styles.icons}>
            <Icon path={mdiEmail} size={0.8} />
            <Icon path={mdiLockQuestion} size={0.8} />
            <Icon path={mdiLockQuestion} size={0.8} />
          </div>
          <form className={styles.form}>
            <label htmlFor="email">
              Email:<span style={{ color: "red" }}>*</span>
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
              Password:<span style={{ color: "red" }}>*</span>
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
              Confirm:<span style={{ color: "red" }}>*</span>
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
          </form>
        </div>
        <div className={styles.error}>
          {emailErrors && emailErrors.email && (
            <div style={{ color: "red" }}>Username - {emailErrors.email}</div>
          )}
          {emailErrors && emailErrors.password && (
            <div style={{ color: "red" }}>
              Password - {emailErrors.password}
            </div>
          )}
          {emailErrors && emailErrors.confirm && (
            <div style={{ color: "red" }}>Confirm - {emailErrors.confirm}</div>
          )}
          {loginError && <div style={{ color: "red" }}>{loginError}</div>}
        </div>
      </div>
    </>
  );
}
