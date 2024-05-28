"use server";

import { prisma } from "@/lib/prisma/client";
import Iron, { unseal } from "@hapi/iron";
import { CodeExpiryCronStop } from "./codeExpiryCron";

export default async function VerifyEmailCode({
  id,
  emailCode,
}: {
  id: number;
  emailCode: string;
}): Promise<{ success: boolean; error?: string } | undefined> {
  try {
    // get the user information about the `emailVerified` column
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        emailVerified: true,
      },
    });

    // get the latest verificationn code from the DB per user
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

    // use `Iron.unseal` to decode the verification code
    const unsealed = await Iron.unseal(
      codeFromDB[0]?.code as string,
      process.env.IRONPASS as string,
      Iron.defaults
    );

    // verification code obtained from the email link
    const codeFromEmail: string = await Iron.unseal(
      emailCode as string,
      process.env.IRONPASS as string,
      Iron.defaults
    );

    // check the `emailVerified` column
    if (user?.emailVerified === false && unsealed === codeFromEmail) {
      // verify the code
      // if the unsealed object equals to the code from the email link
      // then return success
      if (
        unsealed === codeFromEmail &&
        codeFromDB[0]?.expired === false &&
        codeFromDB[0]?.used === false
      ) {
        // update the user record at emailverified column
        await prisma.user.update({
          where: {
            id: Number(id),
          },
          data: {
            emailVerified: true,
          },
        });

        // obtain the id of the codes record
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

        // use previously obtained record to update the
        // the verification record to `used`
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
      }
    } else if (
      user?.emailVerified === true &&
      unsealed === codeFromEmail &&
      codeFromDB[0]?.expired === false &&
      codeFromDB[0]?.used === false
    ) {
      return {
        success: false,
        error: "Email already verified",
      };
    } else if (
      user?.emailVerified === false &&
      unsealed === codeFromEmail &&
      codeFromDB[0]?.expired === true &&
      codeFromDB[0]?.used === false
    ) {
      return {
        success: false,
        error: "Code is expired",
      };
    } else if (
      user?.emailVerified === true &&
      unsealed === codeFromEmail &&
      codeFromDB[0]?.used === true &&
      codeFromDB[0]?.expired === false
    ) {
      await CodeExpiryCronStop();

      return {
        success: false,
        error: "Code is already used",
      };
    }
  } catch (error) {
    console.log(error);
    return { success: false, error: `Unexpected error occured` };
  } finally {
    await prisma.$disconnect();
  }
}
