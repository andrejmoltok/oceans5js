"use server";

import { prisma } from "@/lib/prisma/client";
import { CronJob } from "cron";
import ActiveSessionCheck from "./activeSessionCheck";

const currentTime = new Date();
const oneHourLater = new Date();
const pattern = new Date(
  oneHourLater.setTime(currentTime.getTime() + 60 * 60 * 1000)
);

const sessionExpiry = new CronJob(pattern, async () => {
  try {
    const sessionLoginAt = await ActiveSessionCheck();

    const loginHour = sessionLoginAt?.loginAt.getHours();
    const currentHour = new Date().getHours();

    const loginMinute = sessionLoginAt?.loginAt.getMinutes();
    const currentMinute = new Date().getMinutes();

    const loginSecond = sessionLoginAt?.loginAt.getSeconds();

    const isOneHourLaterOrGreater =
      currentHour > (loginHour as number) + 1 ||
      (currentHour === (loginHour as number) + 1 &&
        currentMinute >= (loginMinute as number));

    const newDateSetMinutes = new Date();
    newDateSetMinutes.setMinutes(loginMinute as number);
    newDateSetMinutes.setSeconds(loginSecond as number);

    if (isOneHourLaterOrGreater) {
      console.log("1 hour timeout for session no.: ", sessionLoginAt?.id);
      await prisma.session.update({
        where: { id: sessionLoginAt?.id },
        data: {
          logoutAt: newDateSetMinutes as Date,
          status: "expired",
        },
      });
    } else {
      console.log(`Session ended before expiry`);
    }

    await prisma.$disconnect();
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
});

export async function SessionExpiryStart() {
  sessionExpiry.start();
}

export async function SessionExpiryStop() {
  sessionExpiry.stop();
}
