"use server";

import { prisma } from "@/lib/prisma/client";

export default async function AccountLockCheck({
  username,
  email,
}: {
  username?: string;
  email?: string;
}): Promise<boolean> {
  try {
    const queryUsers = await prisma.user.findMany({
      select: {
        username: true,
        email: true,
      },
    });
    const statusCheckByUser: { status: string } | null =
      await prisma.user.findUnique({
        where: {
          username: queryUsers
            .map((val) => {
              return val.username.includes(`${username}`) ? val.username : null;
            })
            .toString(),
        },
        select: {
          status: true,
        },
      });

    const statusCheckByEmail: { status: string } | null =
      await prisma.user.findUnique({
        where: {
          email: queryUsers
            .map((val) => {
              return val.email.includes(`${email}`) ? val.email : null;
            })
            .toString(),
        },
        select: {
          status: true,
        },
      });

    if (
      statusCheckByUser?.status.toString() === "lockedOut" ||
      statusCheckByEmail?.status.toString() === "lockedOut"
    ) {
      await prisma.$disconnect();
      return true;
    } else {
      console.log("Can't find record or NOT LockedOut");
      await prisma.$disconnect();
      return false;
    }
  } catch (error) {
    console.log("AccountLockCheck - ", error);
    await prisma.$disconnect();
    return false;
  }
}
