import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import GoogleIcon from "../icons/GoogleIcon";
import GithubIcon from "../icons/GithubIcon";
import { auth, signIn } from "@/app/utils/auth";
import { GeneralSubmitButton } from "../layout/SubmitButton";
import { redirect } from "next/navigation";

export const LoginForm = async () => {
  const session = await auth();
  if (session?.user) {
    return redirect("/");
  }
  return (
    <div className="flex flex-col gap-6 ">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome Back</CardTitle>
          <CardDescription>
            Login with your Google or Github account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <form 
            action={async () => {
                "use server";
                await signIn("google", {
                  redirectTo: "/",
                });
              }}>
              <GeneralSubmitButton
                title="Login with Google"
                varient={"outline"}
                icon={<GoogleIcon />}
                width="w-full"
              />
            </form>
            <form
              action={async () => {
                "use server";
                await signIn("github", {
                  redirectTo: "/",
                });
              }}
            >
              <GeneralSubmitButton
                title="Login with Github"
                varient={"outline"}
                icon={<GithubIcon />}
                width="w-full"
              />
            </form>
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our Terms of Service and Privacy
        Policy.
      </div>
    </div>
  );
};
