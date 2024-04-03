"use server";

import { prisma } from "@/lib/prisma/client";
import Iron from "@hapi/iron";
import { cookies } from "next/headers";

export default async function AccountLockCheck(): Promise<boolean> {
  const cookieStore = cookies();
  const cookie = cookieStore.get("userSession")?.value as string;
  const unsealed = await Iron.unseal(
    cookie,
    process.env.IRONPASS as string,
    Iron.defaults
  );

  const statusCheck: { status: string } | null = await prisma.user.findUnique({
    where: {
      id: unsealed.userID,
    },
    select: {
      status: true,
    },
  });

  if (statusCheck?.status === "lockedOut") {
    return true;
  } else {
    console.log("Can't find record or not lockedOut");
    return false;
  }
}
