"use server";

import { prisma } from "@/lib/prisma/client";
import Iron from "@hapi/iron";
const bcrypt = require("bcryptjs");

export default async function ResetAction({
  userID,
  code,
  pass,
}: {
  userID: number;
  code: string;
  pass: string;
}): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const resetCode = await prisma.codes.findMany({
      where: {
        AND: [
          {
            userID: Number(userID),
            codeType: "reset",
          },
        ],
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      select: {
        code: true,
        used: true,
        expired: true,
        id: true,
      },
    });
    const unsealedFromDB = await Iron.unseal(
      resetCode[0].code as string,
      process.env.IRONPASS as string,
      Iron.defaults
    );
    const unsealedFromEmail = await Iron.unseal(
      code,
      process.env.IRONPASS as string,
      Iron.defaults
    );

    if (resetCode[0].used === true) {
      return {
        success: false,
        error: "Reset code is already used",
      };
    }

    if (resetCode[0].expired === true) {
      return {
        success: false,
        error: "Reset code is expired",
      };
    }

    if (unsealedFromEmail === unsealedFromDB) {
      const newSalt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(pass, newSalt);
      await prisma.user.update({
        where: {
          id: Number(userID),
        },
        data: {
          passwordHash: newHash,
        },
      });
      await prisma.codes.update({
        where: {
          id: Number(resetCode[0].id),
        },
        data: {
          used: true,
          usedAt: new Date(),
        },
      });
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: "Reset code is invalid",
      };
    }
  } catch (error) {
    console.log("Reset Action Error: ", error);
    return {
      success: false,
      error: "Reset Action Error",
    };
  }
}
