"use server";

import { CronJob } from "cron";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma/client";

const currentTime = new Date();
const futureTime = new Date();

const codeExpiryCron = new CronJob(
  new Date(futureTime.setTime(currentTime.getTime() + 24 * 60 * 60 * 1000)),
  async () => {
    try {
      const cookieStore = cookies();
      const userIDForCodeCookie = Number(
        cookieStore.get("codeExpiryByUser")?.value as string
      );
      const codeRecordbyUser = await prisma.codes.findMany({
        where: {
          AND: [
            {
              userID: userIDForCodeCookie,
              codeType: "verify",
            },
          ],
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        select: {
          id: true,
        },
      });
      await prisma.codes.update({
        where: {
          id: codeRecordbyUser[0]?.id as number,
        },
        data: {
          expired: true,
        },
      });
    } catch (error) {
      console.log("Code Expiry Cron Error: ", error);
    }
  }
);

export default async function CodeExpiryStart() {
  codeExpiryCron.start();
}
