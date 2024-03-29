"use server";

import { signinUserType } from "@/lib/signin/byuser/signinUserType";

export default async function LoginUserAction(data: signinUserType): Promise<{
  success: boolean;
  error: string;
}> {
  return {
    success: false,
    error: "Error on login attempt at LoginUser server action",
  };
}
