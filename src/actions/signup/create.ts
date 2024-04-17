"use server";

import { prisma } from "@/lib/prisma/client";
import { signUpType } from "@/lib/signup/signUpType";
const bcrypt = require("bcryptjs");

export default async function Create(
  data: signUpType
): Promise<{ success: boolean; error?: string }> {
  try {
    const queryUsers = await prisma.user.findMany({
      select: {
        username: true,
        email: true,
      },
    });

    const checkUserByUsername = await prisma.user.findUnique({
      where: {
        username: queryUsers
          .map((val) => {
            return val.username.includes(`${data.username}`)
              ? val.username
              : null;
          })
          .toString(),
      },
      select: {
        username: true,
      },
    });

    const checkUserByEmail = await prisma.user.findUnique({
      where: {
        email: queryUsers
          .map((val) => {
            return val.email.includes(`${data.email}`) ? val.email : null;
          })
          .toString(),
      },
      select: {
        email: true,
      },
    });

    if (!checkUserByEmail && !checkUserByUsername) {
      bcrypt.genSalt(10, async function (error: string, salt: string) {
        bcrypt.hash(
          data.password,
          salt,
          async function (error: string, result: string) {
            await prisma.user.create({
              data: {
                username: data.username,
                email: data.email,
                passwordHash: result,
                firstname: data.firstname,
                lastname: data.lastname || null,
                status: "active",
              },
            });
          }
        );
      });
    } else if (checkUserByEmail && !checkUserByUsername) {
      return {
        success: false,
        error: "Email is already taken. Try a different one!",
      };
    } else if (checkUserByUsername && !checkUserByEmail) {
      return {
        success: false,
        error: "Username is already taken. Try a different one!",
      };
    } else if (checkUserByEmail && checkUserByUsername) {
      return {
        success: false,
        error:
          "Both Username and Email are already taken. Try a different one!",
      };
    }

    await prisma.$disconnect();
    return { success: true };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Email is already taken. Try a different one!",
    };
  }
}
