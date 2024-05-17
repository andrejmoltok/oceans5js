"use server";

import { prisma } from "@/lib/prisma/client";
import { cookies } from "next/headers";
import { disableType } from "@/lib/mfa/disableType";
import Iron from "@hapi/iron";

const bcrypt = require("bcryptjs");

export default async function ValidPass(
  data: disableType
): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = cookies();
    const unsealed: { userID: number } = await Iron.unseal(
      cookieStore.get("userSession")?.value as string,
      process.env.IRONPASS as string,
      Iron.defaults
    );
    const userHash = await prisma.user.findFirst({
      where: {
        id: unsealed.userID,
      },
      select: {
        passwordHash: true,
      },
    });
    const dataHash = await bcrypt.compare(data.confirm, userHash?.passwordHash);
    if (dataHash === true) {
      return { success: true };
    } else {
      return { success: false, error: "Incorrect password" };
    }
  } catch (error) {
    return { success: false, error: "Valid Pass Check Error" };
  }
}
