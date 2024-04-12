"use client";

import React from "react";
import { useRouter } from "next/navigation";

import ChooseButton from "./chooseButton";

import AccountLock from "./accountLock";
import AccountLockCheck from "@/actions/signin/accountLockCheck";
import LoginUserAction from "@/actions/signin/loginUserAction";

import { handleZodValidation, ValidationError } from "@/lib/zod/ZodError";
import { signinUserType } from "@/lib/signin/byuser/signinUserType";
import { signinUserZodSchema } from "@/lib/signin/byuser/signinUserZodSchema";

import Icon from "@mdi/react";
import styles from "@/styles/signin.module.css";
import { mdiAccountCircle, mdiLockQuestion, mdiReload } from "@mdi/js";

import { AuthContext } from "@/context/Auth/AuthContext";
import { SessionContext } from "@/context/Session/SessionContext";
import GetSessionCookie from "@/actions/context/session/getSessionCookie";

export default function LoginUser({
  choose,
  setChoose,
}: {
  choose: boolean;
  setChoose: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();

  const [isAuth, setIsAuth] = React.useContext(AuthContext);
  const [isSession, setIsSession] = React.useContext(SessionContext);

  const [loginAttempt, setLoginAttempt] = React.useState<number>(0);

  const [lockCheck, setLockCheck] = React.useState<boolean>(false);

  const [loginUser, setLoginUser] = React.useState<signinUserType>({
    username: "",
    password: "",
    confirm: "",
  });

  const resetUserForm = (): void => {
    setLoginUser({
      username: "",
      password: "",
      confirm: "",
    });
  };

  const [loginError, setLoginError] = React.useState<string>("");

  const [userErrors, setUserErrors] = React.useState<
    ValidationError<typeof signinUserZodSchema>
  >({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginError("");
    setUserErrors({});
    setLoginUser((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  };

  const onClickSubmit = async (data: signinUserType) => {
    const userLogin = await LoginUserAction(data);
    const cookie = await GetSessionCookie();
    const accountLockCheck = await AccountLockCheck({
      username: loginUser.username,
    });

    if (userLogin.success === false) {
      setLoginError(userLogin.error as string);
      if (accountLockCheck === false) {
        setLoginAttempt(loginAttempt + 1);
      }
    } else {
      resetUserForm();
      setIsAuth(true);
      setIsSession(cookie);
      router.replace("/profile");
    }
  };

  const schemaParse = (data: signinUserType) => {
    handleZodValidation({
      onError: setUserErrors,
      data: data,
      onSuccess: async () => {
        setUserErrors({});
        await onClickSubmit(data);
        // resetUserForm();
      },
      schema: signinUserZodSchema,
    });
  };

  return (
    <>
      {loginAttempt === 3 ? (
        <AccountLock username={loginUser.username} />
      ) : (
        <>
          <div className={styles.wheel}>
            <div className={styles.title}>Login with Username</div>
            <ChooseButton
              choose={choose}
              setChoose={setChoose}
              resetUserForm={resetUserForm}
            />
          </div>
          <div className={styles.container}>
            <div className={styles.icons}>
              <Icon path={mdiAccountCircle} size={0.8} />
              <Icon path={mdiLockQuestion} size={0.8} />
              <Icon path={mdiLockQuestion} size={0.8} />
            </div>
            <form className={styles.form}>
              <label htmlFor="username">
                Username:<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={loginUser.username}
                onChange={(e) => handleInputChange(e)}
                autoComplete="on"
                placeholder="username"
              />
              <label htmlFor="password">
                Password:<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginUser.password}
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
                value={loginUser.confirm}
                onChange={(e) => handleInputChange(e)}
                autoComplete="on"
                placeholder="confirm password"
              />
              <input
                type="submit"
                value="Log In"
                onClick={(event) => {
                  event?.preventDefault();
                  schemaParse(loginUser);
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
            {loginAttempt > 0 && (
              <div style={{ color: "red" }}>
                Failed login attempts: {loginAttempt} of 3
              </div>
            )}
            {userErrors && userErrors.username && (
              <div style={{ color: "red" }}>
                Username - {userErrors.username}
              </div>
            )}
            {userErrors && userErrors.password && (
              <div style={{ color: "red" }}>
                Password - {userErrors.password}
              </div>
            )}
            {userErrors && userErrors.confirm && (
              <div style={{ color: "red" }}>Confirm - {userErrors.confirm}</div>
            )}
            {loginError && <div style={{ color: "red" }}>{loginError}</div>}
          </div>
        </>
      )}
    </>
  );
}
