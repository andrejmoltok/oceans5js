"use server";

import { cookies } from "next/headers";

export default async function AutoLogout(): Promise<void> {
  const cookieStore = cookies();

  cookieStore.delete("userSession");
}
