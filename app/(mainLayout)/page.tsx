import JobFilter from "@/components/layouts/JobFilters";
import JobListings from "@/components/layouts/JobListings";
import JobListingLoading from "@/components/layouts/loadings/JobListingLoading";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="grid grid-cols-3 gap-8">
        <JobFilter/>

      <div className="col-span-2 flex flex-col gap-6">
        <Suspense fallback={<JobListingLoading/>}>
          <JobListings/>
        </Suspense>
      </div>
    </div>
  );
}
