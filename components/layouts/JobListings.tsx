import { prisma } from "@/app/utils/db";
import EmptyState from "./EmptyState";
import JobCard from "./JobCard";
import { resolve } from "path";
import MainPagination from "./MainPagination";
import { JobPostStatus } from "@prisma/client";

const getData = async ({
  page = 1,
  pageSize = 4,
  jobTypes = [],
  jobLocation = "",
}: {
  page: number;
  pageSize: number;
  jobTypes: string[];
  jobLocation: string;
}) => {
  const skip = (page - 1) * pageSize;

  const where: any = {
    status: JobPostStatus.ACTIVE,
    ...(jobTypes.length > 0 && {
      employmentType: {
        in: jobTypes,
      },
    }),
    ...(jobLocation && {
      location: jobLocation,
    }),
  };

  await new Promise((resolve) => setTimeout(resolve, 2000));
  const [data, totalCount] = await Promise.all([
    prisma.jobPost.findMany({
      where,
      select: {
        id: true,
        jobTitle: true,
        salaryFrom: true,
        salaryTo: true,
        benefits: true,
        employmentType: true,
        location: true,
        createdAt: true,
        Company: {
          select: {
            name: true,
            logo: true,
            location: true,
            about: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize,
      skip: skip,
    }),

    prisma.jobPost.count({
      where,
    }),
  ]);
  return {
    jobs: data,
    totalPages: Math.ceil(totalCount / pageSize),
  };
};

export default async function JobListings({
  currentPage,
  jobTypes,
  jobLocation,
}: {
  currentPage: number;
  jobTypes: string[];
  jobLocation: string;
}) {
  const { jobs, totalPages } = await getData({
    page: currentPage,
    pageSize: 2,
    jobTypes,
    jobLocation: jobLocation,
  });
  console.log(jobs.length);

  return (
    <>
      {jobs.length !== 0 ? (
        <div className="flex flex-col gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No jobs found"
          description="Try searching for a different job title or description"
          buttonText="Clear all filters"
          href="/"
        />
      )}
      <div className="flex justify-center mt-6">
        <MainPagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </>
  );
}
