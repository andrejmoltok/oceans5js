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

    // console.log("active sessions: ", sessionsLoginAt.length);

    if (sessionsLoginAt.length > 0) {
      sessionsLoginAt.map((val, idx) => {
        const loginHour = val.loginAt.getHours();
        const currentHour = new Date().getHours();

        const loginMinute = val.loginAt.getMinutes();
        const currentMinute = new Date().getMinutes();

        const loginSecond = val.loginAt.getSeconds();

        const isOneHourLater =
          currentHour === loginHour + 1 && currentMinute >= loginMinute;

        const newDateSetMinutes = new Date();
        newDateSetMinutes.setMinutes(loginMinute);
        newDateSetMinutes.setSeconds(loginSecond);

        if (isOneHourLater) {
          console.log("1 hour timeout for session no.: ", val.id);
          (async () =>
            await prisma.session.update({
              where: { id: val.id },
              data: {
                logoutAt: newDateSetMinutes as Date,
                status: "expired",
              },
            }))();
        } else {
          console.log(
            `Session no.: ${val.id} is still active and within time range`
          );
        }
      });
    }

    await prisma.$disconnect();
  } catch (error) {
    console.log(error);
  }
});
