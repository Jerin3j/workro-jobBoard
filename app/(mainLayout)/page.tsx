import JobFilter from "@/components/layouts/JobFilters";
import JobListings from "@/components/layouts/JobListings";
import JobListingLoading from "@/components/layouts/loadings/JobListingLoading";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";

type SearchParams = {
  searchParams: Promise<{
    page?: string;
  }>;
}
export default async function Home({searchParams}: SearchParams) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  return (
    <div className="grid grid-cols-3 gap-8">
        <JobFilter/>

      <div className="col-span-2 flex flex-col gap-6">
        <Suspense fallback={<JobListingLoading/>} key={currentPage}>
          <JobListings currentPage={currentPage}/>
        </Suspense>
      </div>
    </div>
  );
}
