"use server";

import { prisma } from "@/lib/prisma/client";
import { cookies } from "next/headers";
import Iron from "@hapi/iron";

export default async function MFASetupCheck(): Promise<boolean> {
  try {
    const cookieStore = cookies();
    const unsealed = await Iron.unseal(
      cookieStore.get("userSession")?.value as string,
      process.env.IRONPASS as string,
      Iron.defaults
    );
    const mfaCompleteByUser = await prisma.user.findFirst({
      where: {
        id: Number(unsealed.userID),
      },
      select: {
        mfaComplete: true,
      },
    });
    return mfaCompleteByUser?.mfaComplete as boolean;
  } catch (error) {
    console.log("mfaSetupCheck Error:", error);
    return false;
  }
}
