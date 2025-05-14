import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function JobListingLoading() {
  return (
    <div className="flex flex-col gap-6">
      {[...Array(4)].map((item, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-14 rounded" />
            <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-[200px]" />
           <div className="flex items-center gap-3">
             <Skeleton className="h-4 w-[60px] md:w-[120px]" />
             <Skeleton className="h-4 w-[60px] md:w-[120px] rounded-full" />
             <Skeleton className="h-4 hidden md:block w-[60px] md:w-[120px] rounded-full" />
             <Skeleton className="h-4 hidden md:block w-[60px] md:w-[120px]" />
           </div>
              <div className="flex flex-col gap-4 mt-4">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
            <div className="space-y-2 -mt-12">
              <Skeleton className="h-4 w-[60px] md:w-[120px]" />
              <Skeleton className=" hidden md:block h-4 w-[60px] md:w-[120px]" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
