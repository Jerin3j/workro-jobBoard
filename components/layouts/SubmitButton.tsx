'use client'
import React, { ReactNode } from "react";
import { Button } from "../ui/button";
import { useFormStatus } from "react-dom";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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



export default function SubmitButton({savedJob} : {savedJob: boolean}) {

  const {pending} = useFormStatus()
  return (
    <Button variant={'outline'} type="submit" disabled={pending}>
      {pending? (
        <>
        <Loader2 className="size-4 animate-spin"/>
        <span>Saving...</span>
        </>
      ) : (
        <>
         <Heart className={cn(
          savedJob? 'fill-current' :
          'size-4 transition-colors'
         )} />
           {savedJob ? "Saved" : "Save Job"}
         </>
      )}
 </Button>
  )
}
