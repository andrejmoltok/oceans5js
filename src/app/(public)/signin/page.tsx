"use client";

import React from "react";

import styles from "@/styles/signin.module.css";
import LoginEmail from "./loginEmail";
import LoginUser from "./loginUser";

export default function Page() {
  const [choose, setChoose] = React.useState<boolean>(false);

  return (
    <>
      <div className={styles.choose}>
        {choose ? (
          <LoginEmail choose={choose} setChoose={setChoose} />
        ) : (
          <LoginUser choose={choose} setChoose={setChoose} />
        )}
      </div>
    </>
  );
}
