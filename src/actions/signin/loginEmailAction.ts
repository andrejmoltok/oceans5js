"use server";

import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma/client";
import { publicIpv4 } from "public-ip";
import Iron from "@hapi/iron";
const bcrypt = require("bcryptjs");
import { signinEmailType } from "@/lib/signin/byemail/signinEmailType";

export default async function LoginEmailAction(data: signinEmailType): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const cookieStore = cookies();
    const ironPass = process.env.IRONPASS as string;
    const userIP = await publicIpv4();
    const randomNano = nanoid(32);

    const findUserByEmail = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        id: true,
        username: true,
        email: true,
        passwordHash: true,
        status: true,
        emailVerified: true,
      },
    });

    if (!findUserByEmail) {
      return {
        success: false,
        error: "The provided email doesn't exist or it's invalid",
      };
    }

    const passMatchEmail = await bcrypt.compare(
      data.password,
      findUserByEmail?.passwordHash
    );

    if (!passMatchEmail) {
      return { success: false, error: "The given password is incorrect" };
    }

    if (findUserByEmail.status === "lockedOut") {
      return {
        success: false,
        error: "Your account is locked for 30 minutes",
      };
    }

    if (findUserByEmail.emailVerified === false) {
      return {
        success: false,
        error: "Please verify your email address first",
      };
    }

    const sessionTokenByEmail = {
      userID: findUserByEmail?.id,
      email: findUserByEmail?.email,
      userIP,
      randomNano,
    };

    const sealed = await Iron.seal(
      sessionTokenByEmail,
      ironPass,
      Iron.defaults
    );

    cookieStore.set("userSession", sealed, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 3600, // 1 hour in seconds
    });

    await prisma.session.create({
      data: {
        userID: findUserByEmail?.id,
        sessionData: sealed as string,
        loginAt: new Date(),
        status: "active" as string,
      },
    });

    await prisma.user.update({
      where: {
        email: data.email,
      },
      data: {
        lastActive: new Date(),
      },
    });

    await prisma.$disconnect();
    return { success: true };
  } catch (error) {
    console.error("Error during login:", error);
    await prisma.$disconnect();
    return {
      success: false,
      error: "Error during login",
    };
  }
}
