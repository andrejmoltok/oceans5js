"use server";

import { prisma } from "@/lib/prisma/client";

//ALIAS mfaEnabled

export default async function Switch(id: number, checked: boolean) {
  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        mfaEnabled: checked as boolean,
      },
    });
  } catch (error) {
    console.log("MFA Switch Error: ", error);
  }
  await prisma.$disconnect();
}
