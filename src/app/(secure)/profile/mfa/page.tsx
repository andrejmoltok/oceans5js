"use client";

import React from "react";

import MFASecret from "@/actions/mfa/mfaSecret";

export default function Page() {
  const [secret, setSecret] = React.useState<{
    // ascii: string;
    // hex: string;
    base32: string;
    otpauth_url: string;
  }>();
  React.useEffect(() => {
    async function MFASecretCall() {
      const obj = await MFASecret();
      setSecret(obj);
    }
    MFASecretCall();
  }, [setSecret]);
  return (
    <>
      {/* <p>{secret?.ascii}</p>
      <p>{secret?.hex}</p> */}
      <p>{secret?.base32}</p>
      <p>{secret?.otpauth_url}</p>
    </>
  );
}
