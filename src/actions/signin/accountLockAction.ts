"use server";

import { prisma } from "@/lib/prisma/client";
import Iron from "@hapi/iron";
import { cookies } from "next/headers";

export default async function AccountLockAction(): Promise<void> {
  const cookieStore = cookies();
  const cookie = cookieStore.get("userSession")?.value as string;
  const unsealed = await Iron.unseal(
    cookie,
    process.env.IRONPASS as string,
    Iron.defaults
  );

  await prisma.user.update({
    where: {
      id: unsealed.userID,
    },
    data: {
      status: "lockedOut",
      lockedAt: new Date(),
    },
  });
}
