"use server";

import { prisma } from "@/lib/prisma/client";
import Iron from "@hapi/iron";

export default async function VerifyEmailCode({
  id,
  emailCode,
}: {
  id: number;
  emailCode: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const codeFromDB = await prisma.codes.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      where: {
        userID: Number(id),
      },
      select: {
        code: true,
        used: true,
        expired: true,
      },
    });
    const unsealed = await Iron.unseal(
      codeFromDB[0]?.code as string,
      process.env.IRONPASS as string,
      Iron.defaults
    );
    const codeFromEmail: string = await Iron.unseal(
      emailCode as string,
      process.env.IRONPASS as string,
      Iron.defaults
    );
    if (codeFromDB[0]?.used === true) {
      return {
        success: false,
        error: "Code is already used",
      };
    }
    if (codeFromDB[0]?.expired === true) {
      return {
        success: false,
        error: "Code is expired",
      };
    }
    if (unsealed === codeFromEmail) {
      await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          emailVerified: true,
        },
      });
      const codes: { id: number }[] | null = await prisma.codes.findMany({
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        where: {
          userID: Number(id),
        },
        select: {
          id: true,
        },
      });
      await prisma.codes.update({
        where: {
          id: codes[0]?.id,
        },
        data: {
          used: true,
          usedAt: new Date(),
        },
      });
      await prisma.$disconnect();
      return {
        success: true,
      };
    } else {
      await prisma.$disconnect();
      return {
        success: false,
        error: "Code is invalid",
      };
    }
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    return {
      success: false,
      error: `Unexpected error occured:, ${error}`,
    };
  }
}
