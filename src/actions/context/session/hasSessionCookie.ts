"use server";

import { cookies } from "next/headers";

export default async function HasSessionCookie(): Promise<boolean> {
  try {
    const cookieStore = cookies();
    return cookieStore.has("userSession") as boolean;
  } catch (error) {
    console.log("HasSessionCookie Error: ", error);
    return false;
  }
}
