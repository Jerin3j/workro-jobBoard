import JobFilter from "@/components/layouts/JobFilters";
import JobListings from "@/components/layouts/JobListings";
import JobListingLoading from "@/components/layouts/loadings/JobListingLoading";
import { Suspense } from "react";

type SearchParams = {
  searchParams: Promise<{
    page?: string;
    jobTypes?: string;
    location?: string;
  }>;
}
export default async function Home({searchParams}: SearchParams) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const jobTypes = params?.jobTypes?.split(",") || [];
  const jobLocation = params.location || ""
  
  const filterKey = `page=${currentPage};types=${jobTypes.join(",")};location=${jobLocation}`;
  return (
    <div className="flex flex-col gap-3 md:grid md:grid-cols-3 lg:gap-8 w-full">
        <JobFilter/>

      <div className="col-span-2 flex flex-col gap-6">
        <Suspense fallback={<JobListingLoading/>} key={filterKey}>
          <JobListings currentPage={currentPage} jobTypes={jobTypes} jobLocation={jobLocation}/>
        </Suspense>
      </div>
    </div>
  );
}
