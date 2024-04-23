"use server";

const bcrypt = require("bcryptjs");

export default async function ResetAction({
  to,
  email,
  code,
}: {
  to: number;
  email: string;
  code: string;
}) {}
