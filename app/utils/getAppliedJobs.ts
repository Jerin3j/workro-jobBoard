import { prisma } from '@/app/utils/db';


export const getAppliedJobs = async (userId: string) => {
  const data = await prisma.appliedJobPost.findMany({
    where: { userId },
    select: {
      JobPost: {
        select: {
          id: true,
          jobTitle: true,
          salaryFrom: true,
          salaryTo: true,
          location: true,
          employmentType: true,
          createdAt: true,
          Company: {
            select: {
              name: true,
              logo: true,
              location: true,
              about: true,
              website: true,
              LinkedinAccount: true,
            },
          },
        },
      },
    },
  });

  // Filter out null JobPosts (just in case)
  return data.filter((item) => item.JobPost !== null);
};