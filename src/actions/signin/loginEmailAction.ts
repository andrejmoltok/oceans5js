"use server";

import { signinEmailType } from "@/lib/signin/byemail/signinEmailType";

export default async function LoginEmailAction(data: signinEmailType): Promise<{
  success: boolean;
  error: string;
}> {
  return {
    success: false,
    error: "Error on login attempt at LoginEmail server action",
  };
}
