import { prisma } from '@/app/utils/db'
import requireUser from '@/app/utils/requireUser';
import EmptyState from '@/components/layouts/EmptyState';
import JobCard from '@/components/layouts/JobCard';
import React from 'react'

export const getSavedJobs = async(userId: string)=> {

   const data =  await prisma.savedJobPost.findMany({
        where: {
            userId: userId
        },
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
            }
        }
    })
    return data;
}

export default async function SavedJobsPage() {

    const session = await requireUser()
    const data = await getSavedJobs(session?.id as string)
    await new Promise((resolve)=> setTimeout(resolve, 2000))

    if(data.length === 0) {
        return (
            <EmptyState 
            title='No saved jobs found' description="You don't have saved jobs yet." buttonText="Find a job" href='/'
             />
        )
    }
  return (
    <div className='grid grid-cols-1 mt-5 gap-4'>
        {data.map((favorite) => (
            <JobCard job={favorite.JobPost} key={favorite.JobPost.id}/>
        ))}
    </div>
  )
}
