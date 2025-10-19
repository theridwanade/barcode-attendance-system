"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleLogin from "../google/GoogleLogin";
import Loading from "@/components/loading";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded) {
      return <Loading />;
    }

    try {
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerifying(true);
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();

    if (!isLoaded) {
      return <Loading />;
    }

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({
          session: signUpAttempt.createdSessionId,
          navigate: async () => {
            router.push("/");
            return;
          },
        });
      } else {
        console.error("Sign-up attempt not complete:", signUpAttempt);
        console.error("Sign-up attempt status:", signUpAttempt.status);
      }
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  };

  if (verifying) {
    return (
      <main className={"flex justify-center items-center h-screen"}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Verify your email</CardTitle>
            <CardDescription>
              Enter the verification code sent to your email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid gap-2">
                <Label htmlFor="verificationCode">Verification Code</Label>
                <div className="w-full text-center justify-center flex">
                  <InputOTP
                    maxLength={6}
                    onChange={(value) => setVerificationCode(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" onClick={handleVerify} className="w-full">
              Verify
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className={"flex justify-center items-center h-screen"}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
          <CardAction>
            <Link
              href={"/auth/login"}
              className={buttonVariants({ variant: "link" })}
            >
              Login
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="username"
                  type="username"
                  placeholder="mm"
                  required
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" onClick={handleSubmit} className="w-full">
            Signup
          </Button>
          <GoogleLogin />
        </CardFooter>
      </Card>
    </main>
  );
};

export default Signup;
