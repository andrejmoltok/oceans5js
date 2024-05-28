"use server";

import { prisma } from "@/lib/prisma/client";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import Iron from "@hapi/iron";
import emailjs, { EmailJSResponseStatus } from "@emailjs/nodejs";
import { CodeExpiryCronStart } from "./codeExpiryCron";

export default async function SendEmailVerification({
  username,
  email,
}: {
  username: string;
  email: string;
}) {
  try {
    const cookieStore = cookies();
    const nanoCode = nanoid(64);

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });

    const sealedCode = await Iron.seal(
      nanoCode,
      process.env.IRONPASS as string,
      Iron.defaults
    );

    await prisma.codes.create({
      data: {
        userID: user?.id as number,
        codeType: "verify",
        code: sealedCode,
      },
    });

    emailjs.init({
      publicKey: process.env.EMAILJS_PUBLIC_KEY as string,
      privateKey: process.env.EMAILJS_PRIVATE_KEY as string,
    });

    await emailjs.send("service_bhfmm6g", "template_3ssucrd", {
      to_name: username,
      to_email: email,
      to_userID: user?.id,
      code: sealedCode,
    });

    cookieStore.set("codeExpiryByUser", String(user?.id), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      expires: Date.now() + 24 * 60 * 60 * 1000,
    });

    await CodeExpiryCronStart();
    await prisma.$disconnect();
    return true;
  } catch (err) {
    if (err instanceof EmailJSResponseStatus) {
      console.log("EMAILJS FAILED => ", err);
      await prisma.$disconnect();
      return;
    }

    console.log("ERROR: ", err);
    await prisma.$disconnect();
    return false;
  }
}
