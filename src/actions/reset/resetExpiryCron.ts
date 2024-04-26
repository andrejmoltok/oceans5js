"use server";

import { prisma } from "@/lib/prisma/client";
import { CronJob } from "cron";
import { cookies } from "next/headers";

const currentTime = new Date();
const fiveMinsLater = new Date();

export const resetExpiryCron = new CronJob(
  new Date(fiveMinsLater.setTime(currentTime.getTime() + 5 * 60 * 1000)),
  async () => {
    try {
      const cookieStore = cookies();
      const userIDForResetCookie = Number(
        cookieStore.get("resetExpiryByUser")?.value as string
      );
      const resetRecordByUser = await prisma.codes.findMany({
        where: {
          AND: [
            {
              userID: userIDForResetCookie,
              codeType: "reset",
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
          id: resetRecordByUser[0]?.id as number,
        },
        data: {
          expired: true,
        },
      });
      cookieStore.delete("resetExpiryByUser");
    } catch (error) {
      console.log("Reset Expiry Cron Error: ", error);
      //TODO - send notification to Admin UI
    }
  }
);

export default async function ResetExpiryStart() {
  resetExpiryCron.start();
}
