"use server";

import { prisma } from "@/lib/prisma/client";
import Iron from "@hapi/iron";
import { cookies } from "next/headers";
import { accountUnlock } from "@/actions/signin/accountUnLockCron";

export default async function AccountLockAction({
  username,
  email,
}: {
  username?: string;
  email?: string;
}): Promise<void> {
  try {
    const cookieStore = cookies();

    const queryUsers = await prisma.user.findMany({
      select: {
        username: true,
        email: true,
      },
    });

    const queryUserByUsername = queryUsers
      .map((val) => {
        return val.username.includes(`${username}`) ? val.username : null;
      })
      .toString();
    const queryUserByEmail = queryUsers
      .map((val) => {
        return val.email.includes(`${email}`) ? val.email : null;
      })
      .toString();

    if (username !== undefined && email === undefined) {
      const userInfo = {
        username: username,
      };

      const sealed = await Iron.seal(
        userInfo,
        process.env.IRONPASS as string,
        Iron.defaults
      );

      cookieStore.set("lockAndKey", sealed, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 1800,
      });

      await prisma.user.update({
        where: {
          username: queryUserByUsername,
        },
        data: {
          status: "lockedOut",
          lockedAt: new Date(),
        },
      });

      await accountUnlock.start();
    } else if (email !== undefined && username === undefined) {
      const userInfo = {
        email: email,
      };

      const sealed = await Iron.seal(
        userInfo,
        process.env.IRONPASS as string,
        Iron.defaults
      );

      cookieStore.set("lockAndKey", sealed, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 1800,
      });

      await prisma.user.update({
        where: {
          email: queryUserByEmail,
        },
        data: {
          status: "lockedOut",
          lockedAt: new Date(),
        },
      });
      await accountUnlock.start();
    } else {
      return;
    }
    await prisma.$disconnect();
    return;
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    return;
    //TODO sends a notifiction to the admin panel
  }
}
