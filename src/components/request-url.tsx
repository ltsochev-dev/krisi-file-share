"use client";

import { useActionState, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { SendIcon } from "lucide-react";
import Recaptcha from "./recaptcha";
import requestUploadUrl from "@/actions/requestUploadUrl";
import { useRouter } from "next/navigation";

export default function RequestUrl() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [state, formAction, pending] = useActionState(requestUploadUrl, null);

  if (state?.success) {
    router.push("/thank-you");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full h-9 px-4 py-2 mb-0 bg-purple-600 hover:bg-purple-700 text-white">
          Request Upload URL
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Requesting Upload Access</DialogTitle>
          <DialogDescription>
            Once you request upload access you will have to wait to hear from me
            by email or our communication tool of choice. Once I grant you the
            access you will receive an upload link that would allow you to
            upload files directly to me!
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} ref={formRef}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name for Reference"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                E-Mail
              </Label>
              <Input
                id="username"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your E-Mail Address for contact"
                className="col-span-3"
                autoComplete="off"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Reason
              </Label>
              <Textarea
                id="reason"
                name="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please use a short reason. This is to defend against bots that constantly spam my inbox."
                className="col-span-3"
                rows={4}
                autoComplete="off"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4">
                <Recaptcha
                  siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                />
              </div>
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button
            disabled={pending}
            type="submit"
            onClick={() => formRef.current?.requestSubmit()}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {pending ? (
              "Requesting..."
            ) : (
              <>
                Request Share URL
                <SendIcon className="w-5 h-5" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
