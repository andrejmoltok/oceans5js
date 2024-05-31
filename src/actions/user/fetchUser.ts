"use server";

import { prisma } from "@/lib/prisma/client";
import Iron from "@hapi/iron";
import { cookies } from "next/headers";
import { User } from "./user";

export default async function FetchUser(): Promise<User> {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get("userSession")?.value as string;

    if (cookie) {
      const unsealed = await Iron.unseal(
        cookie,
        process.env.IRONPASS as string,
        Iron.defaults
      );

      const fetchUser: User = await prisma.user.findUniqueOrThrow({
        where: {
          id: unsealed.userID,
        },
      });
      return fetchUser as User;
    } else {
      return {} as User;
    }
  } catch (error) {
    console.log("FetchUser Error: ", error);
    return {} as User;
  }
}
