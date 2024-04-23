"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { handleZodValidation, ValidationError } from "@/lib/zod/ZodError";
import { resetPassZodSchema } from "@/lib/reset/resetPassZodSchema";
import { resetPasswordType } from "@/lib/reset/resetInputType";

import styles from "@/styles/signin.module.css";
import Icon from "@mdi/react";
import { mdiLockQuestion, mdiCheck, mdiLoading } from "@mdi/js";

import ResetAction from "@/actions/reset/resetAction";

export default function Page({
  searchParams,
}: {
  searchParams: { t: number; c: string };
}) {
  const router = useRouter();

  const [saveSuccess, setSaveSuccess] = React.useState<boolean>(false);
  const [saving, setSaving] = React.useState<boolean>(false);
  const [saveError, setSaveError] = React.useState<string>("");

  const [passInput, setPassInput] = React.useState<resetPasswordType>({
    password: "",
    confirm: "",
  });

  const resetForm = () => {
    setPassInput({
      password: "",
      confirm: "",
    });
  };
  const [passInputErrors, setPassInputErrors] = React.useState<
    ValidationError<typeof resetPassZodSchema>
  >({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassInputErrors({});
    setPassInput((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  };

  const schemaParse = (data: resetPasswordType) => {
    handleZodValidation({
      onError: setPassInputErrors,
      data: data,
      onSuccess: async () => {
        setPassInputErrors({});
        setSaveError("");
        setSaving(false);
        const saveNewPass = await ResetAction({
          userID: searchParams.t,
          code: searchParams.c,
          pass: passInput.confirm,
        });
        if (saveNewPass.success === false) {
          setSaveError(saveNewPass.error as string);
        } else {
          setSaveSuccess(true);
        }
        resetForm();
        setTimeout(() => {
          router.push("/signin");
        }, 4000);
      },
      schema: resetPassZodSchema,
    });
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.title}>Password Reset Step 2</div>
        <div className={styles.container}>
          <div className={styles.icons}>
            <Icon path={mdiLockQuestion} size={0.8} />
            <Icon path={mdiLockQuestion} size={0.8} />
          </div>
          <form className={styles.form}>
            <label htmlFor="email">Password: </label>
            <input
              type="password"
              id="password"
              name="password"
              value={passInput.password}
              onChange={(e) => handleInputChange(e)}
              placeholder="Enter your password"
              aria-placeholder="Enter your password"
            />
            <label htmlFor="confirm">Confirm: </label>
            <input
              type="password"
              id="confirm"
              name="confirm"
              value={passInput.confirm}
              onChange={(e) => handleInputChange(e)}
              placeholder="Enter your password again"
              aria-placeholder="Enter your password again"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <input
                type="submit"
                value={saveSuccess ? "Saved!" : saving ? "Saving..." : "Save"}
                onClick={(event) => {
                  event?.preventDefault();
                  schemaParse(passInput);
                  setSaving(true);
                }}
                disabled={saveSuccess || saving ? true : false}
              />
              {saveSuccess ? (
                <div>
                  <Icon
                    path={mdiCheck}
                    size={0.7}
                    title={"Checkmark"}
                    description={"Password changed successfully"}
                  />
                </div>
              ) : saving ? (
                <div>
                  <Icon
                    path={mdiLoading}
                    size={0.7}
                    title={"Loading"}
                    description={"Updating password"}
                    spin
                  />
                </div>
              ) : null}
            </div>
          </form>
        </div>
        <div className={styles.error}>
          {passInputErrors && passInputErrors.confirm && (
            <div style={{ color: "red" }}>{passInputErrors.confirm}</div>
          )}
          {saveError && <div style={{ color: "red" }}>{saveError}</div>}
        </div>
      </div>
    </>
  );
}
