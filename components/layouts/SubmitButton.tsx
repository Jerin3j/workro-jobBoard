'use client'
import React, { ReactNode } from "react";
import { Button } from "../ui/button";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

type SubmitButtonProps = {
  title: string;
  varient?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  icon: ReactNode;
  width: string;
};

export const GeneralSubmitButton = ({
  title,
  varient,
  icon,
  width,
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button variant={varient} className={`cursor-pointer ${width}` }>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Submitting...</span>
        </>
      ) : (
        <>
          {icon && icon}
          {title}
        </>
      )}
    </Button>
  );
};
