import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import requireUser from "@/app/utils/requireUser";
import { getSavedJobs } from "@/app/utils/getSavedJobs";

export default async function loading() {
  const session = await requireUser();
  const savedJob = await getSavedJobs(session?.id as string);
  return (
    <div className="grid grid-cols-1 mt-5 gap-4">
      {savedJob.map((_, id) => (
        <Card key={id} className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-14 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-[200px]" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-[120px] rounded-full" />
                <Skeleton className="h-4 w-[120px] rounded-full" />
                <Skeleton className="h-4 w-[120px]" />
              </div>
              <div className="flex flex-col gap-4 mt-4">
                <Skeleton className="h-3 w-[120px] md:w-full" />
                <Skeleton className="h-3 w-[120px] md:w-full" />
              </div>
            </div>
            <div className="space-y-2 -mt-12">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[120px]" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
