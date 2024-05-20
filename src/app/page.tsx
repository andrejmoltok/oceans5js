"use client";

import React from "react";
import Image from "next/image";

import styles from "@/styles/page.module.css";

export default function Page() {
  return (
    <>
      <Image
        src="/loading.gif"
        alt="Loading state ship"
        width={191}
        height={180}
        priority
        unoptimized
        className={styles.loading}
      />
      <span className={styles.loadingText}>
        Click on the Menu items to start playing
      </span>
    </>
  );
}
