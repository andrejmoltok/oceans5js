"use client";

import React from "react";

import { handleZodValidation, ValidationError } from "@/lib/zod/ZodError";
import { resetPassZodSchema } from "@/lib/reset/resetPassZodSchema";
import { resetInputType, resetPasswordType } from "@/lib/reset/resetInputType";

import ResetAction from "@/actions/reset/resetAction";

export default function Page({
  searchParams,
}: {
  searchParams: { t: string; e: string; c: string };
}) {
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

  const onClickSubmit = async (data: resetInputType) => {};

  const schemaParse = (data: resetInputType) => {
    handleZodValidation({
      onError: setPassInputErrors,
      data: data,
      onSuccess: async () => {
        setPassInputErrors({});
        await onClickSubmit(data);
        resetForm();
      },
      schema: resetPassZodSchema,
    });
  };

  return <></>;
}
