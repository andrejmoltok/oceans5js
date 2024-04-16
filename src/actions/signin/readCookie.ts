"use server";

import { cookies } from "next/headers";

export default async function ReadCookieData(): Promise<string | null> {
  try {
    const cookieStore = cookies();
    return cookieStore.get("lockAndKey")?.value as string;
  } catch (error) {
    console.log(error);
    return null;
  }
}
