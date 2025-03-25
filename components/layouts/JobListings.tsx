import { prisma } from "@/app/utils/db";
import EmptyState from "./EmptyState";
import JobCard from "./JobCard";

const getData = async () => {
  const data = await prisma.jobPost.findMany({
    where: {
      status: "ACTIVE",
    },
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
  });
  return data;
};

export default async function JobListings() {
  const data = await getData();
  console.log(data.length);
  
  return (
    <>
      {data.length !== 0 ? (
        <div className="flex flex-col gap-6">
          {data.map((job) => (
            <JobCard key={job.id} job={job}/>
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
    </>
  );
}
