"use server";

import { prisma } from "@/lib/prisma/client";

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
    await prisma.$disconnect();
  } catch (error) {
    console.log("MFA Switch Error: ", error);
    await prisma.$disconnect();
  }
}
