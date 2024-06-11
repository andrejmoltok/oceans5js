"use client";

//TODO - https://oceans5cn.atlassian.net/browse/O5T-23?focusedCommentId=10024

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCheckStore } from "@/lib/zustand/store/checkStore";

import styles from "@/styles/mfasetup.module.css";

import TOTP from "./totp";

const twofactor = require("node-2fa");
var QRCode = require("qrcode");

export default function Page({
  searchParams,
}: {
  searchParams: { email: string };
}) {
  const router = useRouter();
  const { check } = useCheckStore();
  const [dataURL, setDataURL] = React.useState<string>("");
  const [otpAuthURLError, setOTPAuthURLError] = React.useState<string>("");
  const [secret, setSecret] = React.useState<{
    secret: string;
    uri: string;
    qr: string;
  }>();

  React.useEffect(() => {
    if (check) {
      router.push("/profile");
    }
  }, [router, check]);

  React.useEffect(() => {
    const newSecret = twofactor.generateSecret({
      name: "Oceans5",
      account: `${searchParams.email}`,
    });
    setSecret(newSecret);
  }, [searchParams.email]);

  React.useEffect(() => {
    QRCode.toDataURL(secret?.uri, function (err: any, data_url: string) {
      if (err) {
        setOTPAuthURLError("QRCode cannot be displayed");
      }
      setDataURL(data_url);
    });
  }, [secret?.uri]);

  return (
    <>
      <section className={styles.breadcrumb}>
        <div>
          {"> "}
          <Link
            href="/profile"
            style={{ textDecoration: "none", color: "black" }}
          >
            Profile
          </Link>{" "}
          {"> MFA Setup"}
        </div>
      </section>
      <section className={styles.qr}>
        {dataURL ? (
          <>
            <span>Scan the QR code with Google Authenticator or similar</span>
            <Image
              src={dataURL}
              alt="OTP Auth QR Code"
              width={200}
              height={200}
            />
          </>
        ) : otpAuthURLError ? (
          <span>{otpAuthURLError}</span>
        ) : null}
        <div>
          Enter the time-based one-time password below from your device:
        </div>
        <TOTP secret={secret} />
        <input
          type="button"
          value="Done"
          onClick={() => router.push("/profile")}
        />
      </section>
    </>
  );
}
