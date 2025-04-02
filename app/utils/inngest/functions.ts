import { prisma } from "../db";
import { inngest } from "./client";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const handleJobExpiration = inngest.createFunction(
    {id: "job-expiration", cancelOn: [
        {
            event: 'job/cancel.expiration',
            if: 'event.data.jobId == async.data.jobId'
        }
    ]},
    {event: "job/created"},
    
    async({event, step}) => {
       const {jobId, expirationDays} = event.data;
        await step.sleep("wait-for-expiration", `${expirationDays}d`);
        await step.run('update-job-status', async() => {
            await prisma.jobPost.update({
                where: {
                    id: jobId,
                },
                data: {
                    status: "EXPIRED"
                }
            })
        })
        return {jobId, message: "Job marked as expired"};
    }
)

export const notifyNewJobs = inngest.createFunction(
    {id: "send-job-listings"},
    {event: "jobseaker/created"},
    async({event, step}) => {
        const {userId, email} = event.data;
        const totalDays = 30;
        const intervalDays = 2;
        let currentDay = 0;

        while(currentDay < totalDays) {
            await step.sleep("wait-interval", `1m`);
            currentDay += intervalDays;

            const recentJobs = await step.run('fetch-recent-jobs', async() => {
                return await prisma.jobPost.findMany({
                    where:{
                        status: "ACTIVE",
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 10,
                    include: {
                        Company: {
                            select: {
                                name: true,
                                logo: true,
                            },
                        },
                    },
                });
            });

            if(recentJobs.length > 0) {
                await step.run('send-email', async() => {
                    const jobListingsHtml = recentJobs
                    .map(
                      (job) => `
                      <div style= "display: flex; justify-items: left; margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 5px;">
                      <img src=${job.Company.logo} style="width:20px;height:20px;" alt="Company icon">
                    <div style="margin-left: 4px;">
                      <h3 style="margin: 0;">${job.jobTitle}</h3>
                      <p style="margin: 5px 0;">${job.Company.name} • ${
                        job.location
                      }</p>
                      <p style="margin: 5px 0;">₹${job.salaryFrom.toLocaleString()} - ₹${job.salaryTo.toLocaleString()}</p>
                    </div>
                    </div>
                  `
                    )
                    .join("");

                    await resend.emails.send({
                        from: "Workro! <onboarding@resend.dev>",
                        to: ["jerinjj202@gmail.com"],
                        subject: "Latest Job Opportniues for you",
                        html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2>Latest Job Opportunities</h2>
                            ${jobListingsHtml}
                            <div style="margin-top: 30px; text-align: center;">
                              <a href="${process.env.NEXT_PUBLIC_URL}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View More Jobs</a>
                            </div>
                          </div>
                        `,
                    })
                })
            }
        }
        return { userId, message: "Completed 30 day job listing notifications"}
    }
)
