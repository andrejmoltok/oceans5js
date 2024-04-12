"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma/client";

export default async function GetSessionDB(): Promise<string> {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get("userSession")?.value as string;
    const sessionDB = await prisma.session.findFirst({
      where: {
        sessionData: cookie,
      },
      select: {
        sessionData: true,
      },
    });
    return sessionDB?.sessionData as string;
  } catch (error) {
    return error as string;
  }
}
