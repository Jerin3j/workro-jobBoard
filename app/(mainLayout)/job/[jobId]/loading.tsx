import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-8 col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <Skeleton className="h-9 w-[300px] mb-2" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-[150px] mb-2" />
                <Skeleton className="h-5 w-[130px] mb-2" />
                <Skeleton className="h-5 w-[160px] mb-2" />
              </div>
            </div>
          </div>
          <section className="flex flex-col space-y-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/5 mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
          </section>
          <section>
            <Skeleton className="h-6 w-[200] mb-4" />
            <div className="flex flex-wrap gap-3">
              {[...Array(15)].map((itesm, index) => (
                <Skeleton key={index} className="h-7 w-[120px] rounded-full" />
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-[100px]" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-8 w-full" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-5 w-[150px]" />
              <div className="space-y-2">
                {[...Array(4)].map((itesm, index) => (
                  <div className="flex justify-between">
                    <Skeleton
                      key={index}
                      className="h-3 w-full rounded-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card className="p-6">
          <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12" />
          <div className="flex flex-col space-y-3">
          <Skeleton className="h-4 w-[150px]" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>
            <div className="flex items-center justify-left ml-3 gap-6">
            <Skeleton className="h-4 w-[90px]" />
            <Skeleton className="h-4 w-[90px]" />
            </div>
          </div>
          </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
