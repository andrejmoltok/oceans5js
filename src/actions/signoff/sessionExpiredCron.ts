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

    const isOneHourLater =
      currentHour === (loginHour as number) + 1 &&
      currentMinute >= (loginMinute as number);

    const newDateSetMinutes = new Date();
    newDateSetMinutes.setMinutes(loginMinute as number);
    newDateSetMinutes.setSeconds(loginSecond as number);

    if (isOneHourLater) {
      console.log("1 hour timeout for session no.: ", sessionLoginAt?.id);
      await prisma.session.update({
        where: { id: sessionLoginAt?.id },
        data: {
          logoutAt: newDateSetMinutes as Date,
          status: "expired",
        },
      });
    } else {
      console.log(`Session ${sessionLoginAt?.id} still active...`);
    }

    await prisma.$disconnect();
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
});

export default async function SessionExpiry() {
  sessionExpiry.start();
}
