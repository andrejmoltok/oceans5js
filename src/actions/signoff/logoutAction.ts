"use server";

import { prisma } from "@/lib/prisma/client";
import { cookies } from "next/headers";

export default async function LogoutAction(): Promise<void> {
  try {
    const cookieStore = cookies();
    const cookieValue = cookieStore.get("userSession")?.value;

    await prisma.session.update({
      where: {
        sessionData: cookieValue,
      },
      data: {
        logoutAt: new Date(),
        status: "loggedOut",
      },
    });

    cookieStore.delete("userSession");

    await prisma.$disconnect();
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
}