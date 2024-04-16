import { prisma } from "@/lib/prisma/client";
import { CronJob } from "cron";
import ReadCookieData from "./readCookie";

const currentTime = new Date();
const oneHourLater = new Date();

export const sessionExpiry = new CronJob(
  new Date(oneHourLater.setTime(currentTime.getTime() + 1 * 60 * 1000)),
  async () => {
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

      const loginHour = sessionsLoginAt?.loginAt.getHours();
      const currentHour = new Date().getHours();

      const loginMinute = sessionsLoginAt?.loginAt.getMinutes();
      const currentMinute = new Date().getMinutes();

      const loginSecond = sessionsLoginAt?.loginAt.getSeconds();

      const isOneHourLater =
        currentHour === (loginHour as number) + 1 &&
        currentMinute >= (loginMinute as number);

      const newDateSetMinutes = new Date();
      newDateSetMinutes.setMinutes(loginMinute as number);
      newDateSetMinutes.setSeconds(loginSecond as number);

      if (isOneHourLater) {
        console.log("1 hour timeout for session no.: ", sessionsLoginAt?.id);
        (async () =>
          await prisma.session.update({
            where: { id: sessionsLoginAt?.id },
            data: {
              logoutAt: newDateSetMinutes as Date,
              status: "expired",
            },
          }))();
      } else {
        console.log(`Session ${sessionsLoginAt?.id} active...`);
      }

      await prisma.$disconnect();
    } catch (error) {
      console.log(error);
      await prisma.$disconnect();
    }
  }
);
