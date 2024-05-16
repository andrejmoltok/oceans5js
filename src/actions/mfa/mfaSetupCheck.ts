"use server";

import { prisma } from "@/lib/prisma/client";

export default async function MFASetupCheck(
  id: number
): Promise<boolean | null> {
  try {
    const mfaCompleteByUser = await prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        mfaComplete: true,
      },
    });
    return mfaCompleteByUser?.mfaComplete as boolean;
  } catch (error) {
    console.log("mfaSetupCheck Error:", error);
    return null;
  }
}
