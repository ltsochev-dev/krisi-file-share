"use server";

import { Resend } from "resend";
import { headers } from "next/headers";
import RequestUrlEmail from "@/components/email/request-url";

export default async function requestUploadUrl(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _: any,
  formData: FormData
) {
  const headerList = await headers();
  const payload = Object.fromEntries(formData.entries());
  const ip = getCustomerIpAddress(headerList);

  if (
    !payload.email ||
    !payload.name ||
    !payload.reason ||
    !payload["cf-turnstile-response"]
  ) {
    return {
      success: false,
      error: "Invalid form data",
      payload,
    };
  }

  // Challenge cloudflare
  const cfFormData = new FormData();
  cfFormData.append("secret", process.env.RECAPTCHA_SECRET_KEY!);
  cfFormData.append("response", payload["cf-turnstile-response"].toString());
  cfFormData.append("remoteip", ip);

  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const result = await fetch(url, {
    body: cfFormData,
    method: "POST",
  });

  const outcome = await result.json();
  if (outcome.success) {
    const resend = new Resend(process.env.RESEND_API_KEY!);

    await resend.emails.send({
      from: process.env.MAIL_FROM_ADDRESS!,
      to: process.env.SUPPORT_MAIL!,
      subject: `A client requested an URL for file sharing - By ${payload.name}`,
      react: RequestUrlEmail({
        name: payload.name.toString(),
        email: payload.email.toString(),
        reason: payload.reason.toString(),
      }),
    });

    return { success: true, error: false };
  }

  return { success: false, error: "This shouldn't really be happening." };
}

const getCustomerIpAddress = (
  headerList: Awaited<ReturnType<typeof headers>>
) => {
  const forwardedFor = headerList.get("x-forwarded-for");
  const realIp = headerList.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0].trim() || realIp || "IP not available";

  return ip;
};
