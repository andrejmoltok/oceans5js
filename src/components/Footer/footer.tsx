"use client";

import React from "react";
import Link from "next/link";

import styles from "@/styles/footer.module.css";

export default function Footer() {
  return (
    <>
      <section className={styles.footer}>
        Copyright &copy; 2023-2024 Oceans5 Team. Licensed under{" "}
        <Link
          href="https://github.com/andrejmoltok/oceans5js/blob/main/LICENSE"
          target="blank"
          style={{
            textDecoration: "none",
            color: "#e77200",
            marginLeft: "4px",
          }}
        >
          MIT License
        </Link>
        .
      </section>
    </>
  );
}
