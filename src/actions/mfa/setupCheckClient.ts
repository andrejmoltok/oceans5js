"use server";

import { cookies } from "next/headers";
import Iron from "@hapi/iron";
import MFASetupCheck from "./mfaSetupCheck";

export default async function SetupCheck() {
  try {
    const cookieStore = cookies();
    const unsealed = await Iron.unseal(
      cookieStore.get("userSession")?.value as string,
      process.env.IRONPASS as string,
      Iron.defaults
    );
    const check = await MFASetupCheck(unsealed.userID as number);
    if (check) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Initial MFA Setup Check error: ", error);
    return error;
  }
}
