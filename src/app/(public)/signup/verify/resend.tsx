"use client";

import React from "react";

import styles from "@/styles/resend.module.css";
import Icon from "@mdi/react";
import { mdiAccountCircle, mdiEmail } from "@mdi/js";

import { resendType } from "@/lib/verify/resend/resendType";
import { resendZodSchema } from "@/lib/verify/resend/resendZodSchema";
import { handleZodValidation, ValidationError } from "@/lib/zod/ZodError";
import SendEmailVerification from "@/actions/emailVerify/sendEmailVerification";

export default function Resend() {
  const [resendData, setResendData] = React.useState<resendType>({
    username: "",
    confirmUser: "",
    email: "",
    confirmEmail: "",
  });

  const resetResendForm = (): void => {
    setResendData({
      username: "",
      confirmUser: "",
      email: "",
      confirmEmail: "",
    });
  };

  const [resendActionError, setResendActionError] = React.useState<string>("");
  const [resendMessage, setResendMessage] = React.useState<string>("");

  const [resendValidationErrors, setResendValidationErrors] = React.useState<
    ValidationError<typeof resendZodSchema>
  >({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResendActionError("");
    setResendValidationErrors({});
    setResendData((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  };

  const onClickSubmit = async (data: resendType) => {
    const resend = await SendEmailVerification({
      username: data.confirmUser,
      email: data.confirmEmail,
    });

    if (resend) {
      setResendActionError("");
      setResendMessage("Email verification code sent!");
      resetResendForm();
    } else {
      setResendActionError(
        "Unexpected error occured while sending! Contact Admin!"
      );
      resetResendForm();
    }
  };

  const schemaParse = (data: resendType) => {
    handleZodValidation({
      onError: setResendValidationErrors,
      data: data,
      onSuccess: async () => {
        setResendValidationErrors({});
        await onClickSubmit(data);
        resetResendForm();
      },
      schema: resendZodSchema,
    });
  };

  return (
    <>
      <section className={styles.main}>
        <div className={styles.title}>Resend Email Verification Code</div>
        <section className={styles.container}>
          <form className={styles.form}>
            <label htmlFor="username">
              <Icon path={mdiAccountCircle} size={0.8} /> Username:
              <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={resendData.username}
              onChange={(e) => handleInputChange(e)}
              autoComplete="on"
              placeholder="username"
            />
            <label htmlFor="confirmUser">
              <Icon path={mdiAccountCircle} size={0.8} /> Confirm Username:
              <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              id="confirmUser"
              name="confirmUser"
              value={resendData.confirmUser}
              onChange={(e) => handleInputChange(e)}
              autoComplete="on"
              placeholder="confirm username"
            />
            <label htmlFor="email">
              <Icon path={mdiEmail} size={0.8} /> Email:
              <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={resendData.email}
              onChange={(e) => handleInputChange(e)}
              autoComplete="on"
              placeholder="email"
            />
            <label htmlFor="confirmEmail">
              <Icon path={mdiEmail} size={0.8} /> Confirm Email:
              <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="email"
              id="confirmEmail"
              name="confirmEmail"
              value={resendData.confirmEmail}
              onChange={(e) => handleInputChange(e)}
              autoComplete="on"
              placeholder="confirm email"
            />
            <input
              type="submit"
              value="Log In"
              onClick={(event) => {
                event?.preventDefault();
                schemaParse(resendData);
              }}
            />
            <div className={styles.method}>
              <div>
                <span style={{ color: "red" }}>*</span> - marked as compulsory
              </div>
            </div>
          </form>
        </section>
        <section className={styles.error}>
          {resendValidationErrors && resendValidationErrors.username && (
            <div style={{ color: "red" }}>
              Username - {resendValidationErrors.username}
            </div>
          )}
          {resendValidationErrors && resendValidationErrors.confirmUser && (
            <div style={{ color: "red" }}>
              Confirm Username - {resendValidationErrors.confirmUser}
            </div>
          )}
          {resendValidationErrors && resendValidationErrors.email && (
            <div style={{ color: "red" }}>
              Email - {resendValidationErrors.email}
            </div>
          )}
          {resendValidationErrors && resendValidationErrors.confirmEmail && (
            <div style={{ color: "red" }}>
              Confirm Email - {resendValidationErrors.confirmEmail}
            </div>
          )}
          {resendActionError ? (
            <div style={{ color: "red" }}>{resendActionError}</div>
          ) : null}
          {resendMessage ? <div>{resendMessage}</div> : null}
        </section>
      </section>
    </>
  );
}
