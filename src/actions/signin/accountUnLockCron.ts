"use server";

import { CronJob } from "cron";
import { prisma } from "@/lib/prisma/client";
import { cookies } from "next/headers";
import Iron from "@hapi/iron";

const currentTime = new Date();
const halfLater = new Date();

export const accountUnlock = new CronJob(
  new Date(halfLater.setTime(currentTime.getTime() + 30 * 60 * 1000)),
  async () => {
    try {
      const cookieStore = cookies();
      const unsealed: { username?: string; email?: string } = await Iron.unseal(
        cookieStore.get("lockAndKey")?.value as string,
        process.env.IRONPASS as string,
        Iron.defaults
      );
      if (unsealed.email) {
        await prisma.user.update({
          where: {
            email: unsealed.email,
          },
          data: {
            status: "active",
            lockedAt: null,
          },
        });
      } else if (unsealed.username) {
        await prisma.user.update({
          where: {
            username: unsealed.username,
          },
          data: {
            status: "active",
            lockedAt: null,
          },
        });
      }
      await prisma.$disconnect();
    } catch (error) {
      console.log("accountUnLockCron - ", error);
      await prisma.$disconnect();
    }
  },
  null
);
