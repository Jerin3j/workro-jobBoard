"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserTypeForm } from "./UserTypeForm";
import { CompanyForm } from "./CompanyForm";
import { UserForm } from "./UserForm";

type UserSelectionType = "company" | "jobseeker" | null;

export const OnboardingForm = () => {
  const [step, setStep] = useState(1);
  const [UserSelection, setUserSelection] = useState<UserSelectionType>(null);

  const handleUserSelection = (type: UserSelectionType) => {
    setUserSelection(type);
    setStep(2);
  };
  const renderStep = () => {
    switch (step) {
      case 1:
        return <UserTypeForm handleUserSelection={handleUserSelection} />;
      case 2:
        return UserSelection === "company" ? <CompanyForm /> : <UserForm />;
      default:
        console.warn("Invalid step");
    }
  };

  return (
    <div className="flex flex-col gap- items-center">
      <div className="flex items-center gap-4 mb-10">
        <Image src={"/workro-logo.png"} width={50} height={50} alt="" />
        <h1 className="text-2xl font-bold">
          Workro
          <span className="text-primary">!</span>
        </h1>
      </div>
      <Card className="max-w-lg w-full">
        <CardContent className="p-6">{renderStep()}</CardContent>
      </Card>
    </div>
  );
};
