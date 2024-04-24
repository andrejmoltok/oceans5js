"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import styles from "@/styles/menu.module.css";

export default function Menu() {
  return (
    <>
      <div className={styles.navbar}>
        <ul className={styles.navlist}>
          <li className={styles.logo}>
            <Link href="/">
              <Image
                src="/oceans5.png"
                alt="Oceans5 logo with a medieval ship and text saying Oceans5"
                width={185}
                height={64}
                priority
              />
            </Link>
          </li>
          <li className={styles.listitem}>
            <Link href="/lobby">Lobby</Link>
          </li>
          <li className={styles.listitem}>Leaderboard</li>
          <li className={styles.listitem}>How to Play</li>
          <li className={styles.listitem}>About</li>
          {/* TODO add JOTAI for authentication check */}
          <li className={styles.listitem}>
            <Link href="/signin">Sign In</Link>
          </li>
          <li className={styles.listitem}>
            <Link href="/signup">Sign Up</Link>
          </li>
          {/* Prpofile & SignOUt */}
        </ul>
      </div>
      <div className={styles.spacer}></div>
    </>
  );
}
