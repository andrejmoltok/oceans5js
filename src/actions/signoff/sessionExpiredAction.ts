var cron = require("node-cron");
import { prisma } from "@/lib/prisma/client";

export const sessionExpiry = cron.schedule("*/5 * * * *", async () => {
  try {
    const sessionsLoginAt = await prisma.session.findMany({
      where: {
        status: "active",
      },
      select: {
        loginAt: true,
        id: true,
      },
    });

    // console.log("SessionExpiryCheckCron");
    // console.log(sessionsLoginAt);

    if (sessionsLoginAt.length > 0) {
      sessionsLoginAt.map((val, idx) => {
        const loginHour = val.loginAt.getHours();
        const currentHour = new Date().getHours();

        const loginMinute = val.loginAt.getMinutes();
        const currentMinute = new Date().getMinutes();

        const isOneHourLater =
          currentHour === loginHour + 1 && currentMinute >= loginMinute;
        if (isOneHourLater) {
          console.log("1 hour later", val.id);
          (async () =>
            await prisma.session.update({
              where: { id: val.id },
              data: {
                logoutAt: new Date(),
                status: "expired",
              },
            }))();
        } else {
          console.log("Session is still active and within time range");
        }
      });
    } else {
      console.log("No active sessions");
    }

    await prisma.$disconnect();
  } catch (error) {
    console.log(error);
  }
});
