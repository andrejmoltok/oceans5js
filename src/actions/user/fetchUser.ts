"use server";

import { prisma } from "@/lib/prisma/client";
import Iron from "@hapi/iron";
import { cookies } from "next/headers";
import { User } from "./user";

export default async function FetchUser(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get("userSession")?.value as string;

    if (cookie) {
      const unsealed = await Iron.unseal(
        cookie,
        process.env.IRONPASS as string,
        Iron.defaults
      );

      const fetchUser: User = await prisma.user.findFirst({
        where: {
          id: unsealed.userID,
        },
        select: {
          id: true,
          username: true,
          email: true,
          firstname: true,
          lastname: true,
          birthYear: true,
          gender: true,
          location: true,
          lockedAt: true,
          mfaEnabled: true,
        },
      });
      return fetchUser;
    } else {
      return null;
    }
  } catch (error) {
    //console.log("FetchUser Error: ", error);
    return null;
  }
}
