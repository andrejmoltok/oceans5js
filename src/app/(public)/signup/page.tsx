"use client";

import React from "react";

import Create from "@/actions/signup/create";

import { handleZodValidation, ValidationError } from "@/lib/zod/ZodError";
import { signUpType } from "@/lib/signup/signUpType";
import { signupZodSchema } from "@/lib/signup/signupZodSchema";

import styles from "@/styles/signup.module.css";
import Icon from "@mdi/react";
import {
  mdiAccountCircle,
  mdiEmail,
  mdiFountainPen,
  mdiLockQuestion,
  mdiShipWheel,
} from "@mdi/js";

export default function Page() {
  const [signUpData, setSignUpData] = React.useState<signUpType>({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    confirm: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setSignUpData({
      username: "",
      email: "",
      firstname: "",
      lastname: "",
      password: "",
      confirm: "",
    });
  };

  const [errors, setErrors] = React.useState<
    ValidationError<typeof signupZodSchema>
  >({});

  const onClickSubmit = async (data: signUpType) => {
    await Create(data);
    resetForm();
  };

  const schemaParse = (data: signUpType) => {
    handleZodValidation({
      onError: setErrors,
      data: data,
      onSuccess: async () => {
        setErrors({});
        await onClickSubmit(data);
        resetForm();
      },
      schema: signupZodSchema,
    });
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.wheel}>
          <h2>Register Your Player Account</h2>
          <Icon path={mdiShipWheel} size={0.8} />
        </div>
        <div className={styles.container}>
          <div className={styles.icons}>
            <Icon path={mdiAccountCircle} size={0.8} />
            <Icon path={mdiEmail} size={0.8} />
            <Icon path={mdiFountainPen} size={0.8} />
            <Icon path={mdiFountainPen} size={0.8} />
            <Icon path={mdiLockQuestion} size={0.8} />
            <Icon path={mdiLockQuestion} size={0.8} />
          </div>
          <form className={styles.form} aria-label="Register player account">
            <label htmlFor="username">
              Username:<span style={{ color: "red" }}>*</span>
            </label>
            <input
              name="username"
              type="text"
              id="username"
              value={signUpData.username}
              onChange={handleInputChange}
            />
            <label htmlFor="email">
              Email:<span style={{ color: "red" }}>*</span>
            </label>
            <input
              name="email"
              type="email"
              id="email"
              value={signUpData.email}
              onChange={handleInputChange}
            />
            <label htmlFor="firstname">
              Firstname:<span style={{ color: "red" }}>*</span>
            </label>
            <input
              name="firstname"
              type="text"
              id="firstname"
              value={signUpData.firstname}
              onChange={handleInputChange}
            />
            <label htmlFor="lastname">Lastname:</label>
            <input
              name="lastname"
              type="text"
              id="lastname"
              value={signUpData.lastname}
              onChange={handleInputChange}
            />
            <label htmlFor="password">
              Password:<span style={{ color: "red" }}>*</span>
            </label>
            <input
              name="password"
              type="password"
              id="password"
              value={signUpData.password}
              onChange={handleInputChange}
            />
            <label htmlFor="confirm">
              Confirm:<span style={{ color: "red" }}>*</span>
            </label>
            <input
              name="confirm"
              type="password"
              id="confirm"
              value={signUpData.confirm}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              onClick={(event) => {
                event.preventDefault();
                schemaParse(signUpData);
              }}
            >
              Register
            </button>
            <div>
              <span style={{ color: "red" }}>*</span> - marks as compulsory
            </div>
          </form>
        </div>
        <div className={styles.errors}>
          {errors && errors.username && (
            <div style={{ color: "red" }}>Username - {errors.username}</div>
          )}
          {errors && errors.email && (
            <div style={{ color: "red" }}>Email - {errors.email}</div>
          )}
          {errors && errors.firstname && (
            <div style={{ color: "red" }}>Firstname - {errors.firstname}</div>
          )}
          {errors && errors.password && (
            <div style={{ color: "red" }}>Password - {errors.password}</div>
          )}
          {errors && errors.confirm && (
            <div style={{ color: "red" }}>Confirm - {errors.confirm}</div>
          )}
        </div>
      </div>
    </>
  );
}