"use server";

import { prisma } from "@/lib/prisma/client";
import { cookies } from "next/headers";
import Iron from "@hapi/iron";

export default async function RemoveSecret() {
  try {
    const cookieStore = cookies();
    const unsealed = await Iron.unseal(
      cookieStore.get("userSession")?.value as string,
      process.env.IRONPASS as string,
      Iron.defaults
    );

    if (unsealed !== undefined && unsealed !== null) {
      await prisma.mfa.delete({
        where: {
          userID: Number(unsealed?.userID),
        },
      });

      await prisma.user.update({
        where: {
          id: Number(unsealed?.userID),
        },
        data: {
          mfaComplete: false,
        },
      });
    }
  } catch (error) {
    console.log("Remove Secret Action Error: ", error);
    return null;
  }
}
