"use server";

import MFASetupCheck from "./mfaSetupCheck";

export default async function SetupCheck() {
  try {
    const check = await MFASetupCheck();
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
