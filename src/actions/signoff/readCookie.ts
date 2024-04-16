"use server";

import Iron from "@hapi/iron";
import { cookies } from "next/headers";

export default async function ReadCookieData(): Promise<number | null> {
  try {
    const cookieStore = cookies();
    const unsealed = await Iron.unseal(
      cookieStore.get("userSession")?.value as string,
      process.env.IRONPASS as string,
      Iron.defaults
    );
    return unsealed.userID as number;
  } catch (error) {
    console.log(error);
    return null;
  }
}
