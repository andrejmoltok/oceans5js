"use server";

import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma/client";
import { cookies } from "next/headers";
import Iron from "@hapi/iron";
import emailjs from "@emailjs/nodejs";
import ResetExpiryCron from "./resetExpiryCron";

export default async function ResetLink({
  email,
}: {
  email: string;
}): Promise<boolean> {
  try {
    const resetCode = nanoid(64);
    const cookieStore = cookies();
    const sealedCode = await Iron.seal(
      resetCode,
      process.env.IRONPASS as string,
      Iron.defaults
    );
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        username: true,
        id: true,
      },
    });
    emailjs.init({
      publicKey: process.env.EMAILJS_PUBLIC_KEY as string,
      privateKey: process.env.EMAILJS_PRIVATE_KEY as string,
    });
    emailjs.send("service_bhfmm6g", "template_1jjl0kr", {
      to_name: user?.username,
      to_email: email,
      code: sealedCode,
    });
    cookieStore.set("resetExpiryByUser", String(user?.id), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      expires: Date.now() + 5 * 60 * 1000,
    });
    await prisma.codes.create({
      data: {
        userID: Number(user?.id),
        codeType: "reset",
        code: sealedCode,
      },
    });
    await ResetExpiryCron();
    return true;
  } catch (error) {
    console.log(error);
    //TODO send notification to Admin UI
    return false;
  }
}
