"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { applyJob } from "@/app/actions";

export function ApplyJobButton({ jobId, session, isApplied }: any) {
  const [isPending, startTransition] = useTransition();
  const [localApplied, setLocalApplied] = useState(false);

  if (isApplied || localApplied) {
    return (
      <Button disabled className="w-full">
        Already Applied
      </Button>
    );
  }

  async function handleApply() {
    startTransition(async () => {
      try {
        await applyJob(jobId); // call server action
        setLocalApplied(true); // prevent multiple clicks immediately
      } catch (err) {
        console.error("Apply error:", err);
      }
    });
  }

  return (
    <form action={handleApply}>
      <Button
        disabled={session?.user?.userType === "COMPANY" || isPending}
        type="submit"
        className="w-full"
      >
        {isPending ? "Applying..." : "Apply now"}
      </Button>
    </form>
  );
}
