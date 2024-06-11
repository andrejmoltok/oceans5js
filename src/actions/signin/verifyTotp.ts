"use server";

import { prisma } from "@/lib/prisma/client";
import { cookies } from "next/headers";
import Iron from "@hapi/iron";
const twofactor = require("node-2fa");

export default async function VerifyTOTP(input: string[]) {
  try {
    const cookieStore = cookies();
    //read cookie data
    const userData = await Iron.unseal(
      cookieStore.get("userSession")?.value as string,
      process.env.IRONPASS as string,
      Iron.defaults
    );
    if (userData) {
      // read secret_base32 from database
      const secret = await prisma.mfa.findFirst({
        where: {
          userID: Number(userData.userID),
        },
        select: {
          secretBase32: true,
        },
      });
      // unseal secret_base32
      const unsealedSecret = await Iron.unseal(
        `${secret?.secretBase32}`,
        process.env.IRONPASS as string,
        Iron.defaults
      );
      // verify code input against unsealed secret_base32
      const verified: { delta: number } = twofactor.verifyToken(
        `${unsealedSecret.secret}`,
        `${input.join("")}`
      );
      if (verified.delta === 0) {
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.log("VerifyTOTP Error:", error);
    return error;
  }
}
