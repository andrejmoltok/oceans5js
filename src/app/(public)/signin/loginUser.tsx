"use client";

import React from "react";
import Icon from "@mdi/react";
import ChooseButton from "./chooseButton";

import { handleZodValidation, ValidationError } from "@/lib/zod/ZodError";
import { signinUserType } from "@/lib/signin/byuser/signinUserType";
import { signinUserZodSchema } from "@/lib/signin/byuser/signinUserZodSchema";
import LoginUserAction from "@/actions/signin/loginUserAction";

import styles from "@/styles/signin.module.css";
import { mdiAccountCircle, mdiLockQuestion, mdiReload } from "@mdi/js";

export default function LoginUser({
  choose,
  setChoose,
}: {
  choose: boolean;
  setChoose: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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

  const [userErrors, setUserErrors] = React.useState<
    ValidationError<typeof signinUserZodSchema>
  >({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginUser((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  };

  const onClickSubmit = async (data: signinUserType) => {
    await LoginUserAction(data);
    resetUserForm();
  };

  const schemaParse = (data: signinUserType) => {
    handleZodValidation({
      onError: setUserErrors,
      data: data,
      onSuccess: async () => {
        setUserErrors({});
        await onClickSubmit(data);
        resetUserForm();
      },
      schema: signinUserZodSchema,
    });
  };

  return (
    <>
      <div className={styles.main}>
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
            <div>
              <span style={{ color: "red" }}>*</span> - marked as compulsory
            </div>
          </form>
        </div>
        <div className={styles.error}>
          {userErrors && userErrors.username && (
            <div style={{ color: "red" }}>Username - {userErrors.username}</div>
          )}
          {userErrors && userErrors.password && (
            <div style={{ color: "red" }}>Password - {userErrors.password}</div>
          )}
          {userErrors && userErrors.confirm && (
            <div style={{ color: "red" }}>Confirm - {userErrors.confirm}</div>
          )}
        </div>
      </div>
    </>
  );
}
