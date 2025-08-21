import { getSavedJobs } from "@/app/utils/getSavedJobs";
import requireUser from "@/app/utils/requireUser";
import EmptyState from "@/components/layouts/EmptyState";
import JobCard from "@/components/layouts/JobCard";
import React from "react";

export default async function SavedJobsPage() {
  const session = await requireUser();

  if (!session?.id) {
    return (
      <EmptyState
        title="Not authenticated"
        description="Please log in to see your saved jobs."
        buttonText="Login"
        href="/login"
      />
    );
  }

  const data = await getSavedJobs(session.id);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (data.length === 0) {
    return (
      <EmptyState
        title="No saved jobs found"
        description="You don't have saved jobs yet."
        buttonText="Home"
        href="/"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 mt-5 gap-4">
      {data.map(
        (favorite) =>
          favorite.JobPost && (
            <JobCard job={favorite.JobPost} key={favorite.JobPost.id} />
          )
      )}
    </div>
  );
}
