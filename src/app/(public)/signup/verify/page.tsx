import Client from "./client";
import VerifyEmailCode from "@/actions/emailVerify/verifyEmailCode";

export default async function Page({
  searchParams,
}: {
  searchParams: { t: number; c: string };
}) {
  const emailVerify = await VerifyEmailCode({
    id: searchParams.t,
    emailCode: searchParams.c,
  });
  return (
    <Client
      emailVerify={
        emailVerify as { success: boolean; message?: string; error?: string }
      }
    />
  );
}
