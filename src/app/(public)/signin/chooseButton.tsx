"use client";

import React from "react";
import Icon from "@mdi/react";
import { mdiReload } from "@mdi/js";
import styles from "@/styles/signin.module.css";

export default function ChooseButton({
  choose,
  setChoose,
  resetEmailForm,
  resetUserForm,
}: {
  choose: boolean;
  setChoose: React.Dispatch<React.SetStateAction<boolean>>;
  resetEmailForm?: () => void;
  resetUserForm?: () => void;
}) {
  return (
    <div
      className={styles.chooseButton}
      onClick={() => {
        setChoose(!choose), resetEmailForm, resetUserForm;
      }}
    >
      <Icon
        path={mdiReload}
        size={0.8}
        className={choose ? styles.rotateOrigin : styles.rotate180}
      />
    </div>
  );
}
