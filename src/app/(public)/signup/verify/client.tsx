"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "@/styles/signin.module.css";
import Icon from "@mdi/react";
import { mdiLoading, mdiCheck } from "@mdi/js";

import Resend from "./resend";

export default function Client({
  emailVerify,
}: {
  emailVerify: {
    success: boolean;
    message?: string;
    error?: string;
  };
}) {
  const router = useRouter();
  const [verify, setVerify] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [resendRender, setResendRender] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (emailVerify?.success) {
      setVerify(true);
      setMessage(emailVerify.message as string);
      setError("");
    } else {
      setVerify(false);
      setMessage("");
      setError(emailVerify?.error as string);
    }
  }, [emailVerify]);

  return (
    <>
      <div className={styles.main}>
        {!verify && !error ? (
          <>
            Verifying email...
            <Icon
              path={mdiLoading}
              size={0.7}
              title={"Email verification"}
              description={"Loading sequence icon"}
              spin={true}
            />
          </>
        ) : null}{" "}
        {verify && !error ? (
          <>
            {" "}
            {message}
            <Icon
              path={mdiCheck}
              size={0.7}
              title={"Email Verification"}
              description={"Success Checkmark"}
            />
          </>
        ) : null}
        {error && !resendRender ? (
          <>
            <div style={{ margin: "10px 10px" }}>{error}</div>
            <div
              style={{
                cursor: "pointer",
                border: "1px solid black",
                borderRadius: "5px",
                padding: "3px",
              }}
              onClick={() => {
                setResendRender(true);
              }}
            >
              Resend
            </div>
            <div style={{ margin: "10px 10px" }}>
              <a href="/" style={{ textDecoration: "none" }}>
                Main Page
              </a>
            </div>
          </>
        ) : null}
        {resendRender ? <Resend /> : null}
      </div>
    </>
  );
}
