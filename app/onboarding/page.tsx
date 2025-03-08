import { OnboardingForm } from "@/components/forms/onboarding/OnboardingForm";
import React from "react";
import { prisma } from "../utils/db";
import { redirect } from "next/navigation";
import requireUser from "../utils/requireUser";

async function checkUserHaseFinishedOnboarding(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      onBoardingCompleted: true,
    },
  });
  if (user?.onBoardingCompleted === true) {
    return redirect("/");
  }
  return user;
}

export default async function page() {
  const session = await requireUser();

  await checkUserHaseFinishedOnboarding(session.id as string);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center py-10">
      <OnboardingForm />
    </div>
  );
}
