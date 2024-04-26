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
    return mfaStatusCheck?.mfaEnabled;
  } catch (error) {
    console.error("MFA Status Check Error: ", error);
  }
}
