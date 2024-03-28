"use server";

import { prisma } from "@/lib/prisma/client";
import { signUpType } from "@/lib/signup/signUpType";
const bcrypt = require("bcryptjs");

export default async function Create(data: signUpType): Promise<void> {
  try {
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

    await prisma.$disconnect();
  } catch (error) {
    console.log(error);
  }
}
