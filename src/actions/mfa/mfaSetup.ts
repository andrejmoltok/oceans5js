"use server";

import { prisma } from "@/lib/prisma/client";
import { cookies } from "next/headers";
import Iron from "@hapi/iron";
const twofactor = require("node-2fa");

export default async function MFASetup({
  input,
  secret,
}: {
  input: string[];
  secret: { secret: string; uri: string; qr: string };
}) {
  try {
    const cookieStore = cookies();
    const userData = await Iron.unseal(
      cookieStore.get("userSession")?.value as string,
      process.env.IRONPASS as string,
      Iron.defaults
    );
    const sealedSecret = await Iron.seal(
      secret,
      process.env.IRONPASS as string,
      Iron.defaults
    );
    const verified: { delta: number } = twofactor.verifyToken(
      `${secret?.secret}`,
      `${input.join("")}`
    );

    if (verified.delta === 0) {
      //update user table mfaComplete column to TRUE
      await prisma.user.update({
        where: {
          id: Number(userData.userID),
        },
        data: {
          mfaComplete: true,
        },
      });
      // save secret into mfa table
      await prisma.mfa.create({
        data: {
          userID: Number(userData.userID),
          secretBase32: sealedSecret,
        },
      });

      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.log("MFA Setup Token Verify Error: ", error);
    return { success: false };
  }
}
