"use client";
import { useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import Loading from "@/components/loading";
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
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

const LoginPage = () => {
  const { isLoaded, signIn } = useSignIn();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isLoaded) {
      return <Loading />;
    }

    try {
      setVerifying(true);
      await signIn.create({
        identifier: formData.email,
        password: formData.password,
        zz,
      });
      setVerifying(false);
      if (signIn.status === "complete") {
        router.push("/");
      }
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <main className={"flex justify-center items-center h-screen"}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Link
              href={"/auth/signup"}
              className={buttonVariants({ variant: "link" })}
            >
              Sign Up
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
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
                  <Link
                    href={"/auth/forgot-password"}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
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
          <Button
            type="submit"
            onClick={handleSubmit}
            className="w-full cursor-pointer"
          >
            {verifying ? <Spinner /> : "Login"}
          </Button>
          <GoogleLogin />
        </CardFooter>
      </Card>
    </main>
  );
};

export default LoginPage;
