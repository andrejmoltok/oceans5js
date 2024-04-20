"use client";

import React from "react";
import styles from "@/styles/signin.module.css";
import VerifyEmailCode from "@/actions/emailVerify/verifyEmailCode";
import Icon from "@mdi/react";
import { mdiLoading, mdiCheck } from "@mdi/js";

export default function Page({
  searchParams,
}: {
  searchParams: { t: number; c: string };
}) {
  const [verify, setVerify] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  React.useEffect(() => {
    async function VerifyEffect() {
      const emailVerify = await VerifyEmailCode({
        id: searchParams.t,
        emailCode: searchParams.c,
      });
      if (emailVerify.success === true) {
        setVerify(true);
      } else {
        setError(emailVerify.error as string);
      }
    }
    VerifyEffect();
  }, [searchParams.t, searchParams.c]);
  return (
    <>
      <div className={styles.main}>
        {!verify && error === "" && (
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
        )}
        {verify && error === "" && (
          <>
            {" "}
            Email verified successfully!
            <Icon
              path={mdiCheck}
              size={0.7}
              title={"Email Verification"}
              description={"Success Checkmark"}
            />
          </>
        )}
        {error ? (
          <>
            <div>{error}</div>
            <div>
              <a href="/" style={{ textDecoration: "none" }}>
                Main Page
              </a>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
