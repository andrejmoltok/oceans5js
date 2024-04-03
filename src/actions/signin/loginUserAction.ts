"use server";

import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma/client";
import { publicIpv4 } from "public-ip";
import Iron from "@hapi/iron";
const bcrypt = require("bcryptjs");
import { signinUserType } from "@/lib/signin/byuser/signinUserType";

export default async function LoginUserAction(data: signinUserType): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const cookieStore = cookies();
    const ironPass = process.env.IRONPASS as string;
    const userIP = await publicIpv4();
    const randomNano = nanoid(32);

    const findUserByUsername = await prisma.user.findUnique({
      where: {
        username: data.username,
      },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        status: true,
      },
    });

    if (!findUserByUsername) {
      return {
        success: false,
        error: "The provided username doesn't exist or incorrect",
      };
    }

    const passMatchUser = await bcrypt.compare(
      data.password,
      findUserByUsername.passwordHash
    );

    if (!passMatchUser) {
      return { success: false, error: "The provided password is incorrect" };
    }

    if (findUserByUsername.status === "lockedOut") {
      return {
        success: false,
        error: "Your account has been locked for 30 minutes",
      };
    }

    const sessionTokenByUser = {
      userID: findUserByUsername.id,
      email: findUserByUsername.email,
      userIP,
      randomNano,
    };

    const sealed = await Iron.seal(sessionTokenByUser, ironPass, Iron.defaults);

    cookieStore.set("userSession", sealed, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 3600, // 1 hour
    });

    await prisma.session.create({
      data: {
        userID: findUserByUsername.id,
        sessionData: sealed,
        loginAt: new Date(),
        status: "active",
      },
    });

    await prisma.user.update({
      where: {
        username: data.username,
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
