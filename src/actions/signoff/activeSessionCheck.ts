"use server";

import { prisma } from "@/lib/prisma/client";
import ReadCookieData from "./readCookie";

export default async function ActiveSessionCheck(): Promise<{
  id: number;
  loginAt: Date;
  status: string;
} | null> {
  try {
    const sessionsLoginAt = await prisma.session.findFirst({
      where: {
        AND: [
          {
            userID: { equals: (await ReadCookieData()) as number },
            status: { equals: "active" },
          },
        ],
      },
      select: {
        loginAt: true,
        id: true,
        status: true,
      },
    });
    return sessionsLoginAt;
  } catch (error) {
    return null;
  }
}
