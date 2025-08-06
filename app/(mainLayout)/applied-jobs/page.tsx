import { getAppliedJobs } from "@/app/utils/getAppliedJobs";
import requireUser from "@/app/utils/requireUser";
import EmptyState from "@/components/layouts/EmptyState";
import JobCard from "@/components/layouts/JobCard";
import React from "react";

export default async function AppliedJobsPage() {
  const session = await requireUser();

  if (!session?.id) {
    return (
      <EmptyState
        title="Not authenticated"
        description="Please log in to see your applied jobs."
        buttonText="Login"
        href="/login"
      />
    );
  }

  const data = await getAppliedJobs(session.id);
  
  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (data.length === 0) {
    return (
      <EmptyState
        title="No applied jobs found"
        description="You don't have applied jobs yet."
        buttonText="Find a job"
        href="/"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 mt-5 gap-4">
      {data.map(
        (applied) =>
          applied.JobPost && (
            <JobCard job={applied.JobPost} key={applied.id} />
          )
      )}
    </div>
  );
}
