import { prisma } from "@/lib/prisma/client";
import { CronJob } from "cron";
import { cookies } from "next/headers";

const currentTime = new Date();
const futureTime = new Date();

export const codeExpiryCron = new CronJob(
  new Date(futureTime.setTime(currentTime.getTime() + 24 * 60 * 60 * 1000)),
  async () => {
    try {
      const cookieStore = cookies();
      const userIDForCodeCookie = Number(
        cookieStore.get("codeExpiryByUser")?.value as string
      );
      const codeRecordByUser = await prisma.codes.findMany({
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
          id: codeRecordByUser[0]?.id as number,
        },
        data: {
          expired: true,
        },
      });
      cookieStore.delete("codeExpiryByUser");
    } catch (error) {
      console.error("Code Expiry Cron Error: ", error);
    }
  }
);
