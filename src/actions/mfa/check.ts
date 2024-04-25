"use server";

import { prisma } from "@/lib/prisma/client";

export default async function Check(
  userID: number
): Promise<boolean | undefined> {
  try {
    const mfaStatusCheck = await prisma.user.findUnique({
      where: {
        id: userID,
      },
      select: {
        mfaEnabled: true,
      },
    });
    if (mfaStatusCheck?.mfaEnabled == true) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("MFA Status Check Error: ", error);
  }
}
