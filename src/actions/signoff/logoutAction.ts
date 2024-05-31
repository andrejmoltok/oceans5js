"use server";

import { prisma } from "@/lib/prisma/client";
import { cookies } from "next/headers";
import { SessionExpiryStop } from "./sessionExpiredCron";

export default async function LogoutAction(): Promise<void> {
  try {
    const cookieStore = cookies();
    const cookieValue = cookieStore.get("userSession")?.value;

    if (cookieValue) {
      await prisma.session.update({
        where: {
          sessionData: cookieValue,
        },
        data: {
          logoutAt: new Date(),
          status: "loggedOut",
        },
      });
    }

    await SessionExpiryStop();

    cookieStore.delete("userSession");

    await prisma.$disconnect();
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
}
