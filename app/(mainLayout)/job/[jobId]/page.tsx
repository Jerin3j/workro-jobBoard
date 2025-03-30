import { saveJobPost, unSaveJobPost } from "@/app/actions";
import arcjet, { detectBot } from "@/app/utils/arcjet";
import { auth } from "@/app/utils/auth";
import { prisma } from "@/app/utils/db";
import { benefits } from "@/app/utils/listOfBenefits";
import JsonToHtml from "@/components/layouts/JsonToHtml";
import SubmitButton from "@/components/layouts/SubmitButton";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fixedWindow, request, tokenBucket } from "@arcjet/next";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const aj = arcjet.withRule(
  detectBot({
    mode: "LIVE",
    allow: [
      "CATEGORY:SEARCH_ENGINE",
      "OPENAI_CRAWLER_SEARCH",
      "CATEGORY:PREVIEW",
    ],
  })
);

function getClient(session: boolean) {
  if (session) {
    return aj.withRule(
      tokenBucket({
        mode: "LIVE",
        capacity: 100,
        interval: 60,
        refillRate: 30,
      })
    );
  } else {
    return aj.withRule(
      tokenBucket({
        mode: "LIVE",
        capacity: 100,
        interval: 60,
        refillRate: 10,
      })
    );
  }
}

const getJob = async (jobId: string, userId?: string) => {
  const [jobData, savedJob] = await Promise.all([
    prisma.jobPost.findUnique({
      where: {
        status: "ACTIVE",
        id: jobId,
      },
      select: {
        jobTitle: true,
        jobDescription: true,
        location: true,
        employmentType: true,
        benefits: true,
        createdAt: true,
        listingDuration: true,
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
    }),

    userId
      ? prisma.savedJobPost.findUnique({
          where: {
            userId_jobPostId: {
              userId: userId,
              jobPostId: jobId,
            },
          },
          select: {
            id: true,
          },
        })
      : null,
  ]);

  if (!jobData) {
    return notFound();
  }

  return { jobData, savedJob };
};

type Params = Promise<{ jobId: string }>;

export default async function page({ params }: { params: Params }) {
  const { jobId } = await params;

  const session = await auth();
  const req = await request();
  const decision = await getClient(!!session)?.protect(req, { requested: 10 });

  if (decision.isDenied()) {
    throw new Error("forbidden");
  }

  const { jobData: data, savedJob } = await getJob(jobId, session?.user?.id);
  return (
    <div className="grid lg:grid-cols-3 gap-8 mt-7">
      <div className="space-y-9 col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Frontend Developer</h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="font-medium">{data.jobTitle}</p>
              <span className="hidden md:inline text-muted-foreground">•</span>
              <Badge className="rounded-full" variant={"secondary"}>
                {data.employmentType}
              </Badge>
              <span className="hidden md:inline text-muted-foreground">•</span>
              <Badge className="rounded-full">{data.location}</Badge>
            </div>
          </div>
          {/* <Button variant={'outline'}>
                    <Heart className='size-4' />
                    Save Job
                </Button> */}

          {session?.user ? (
            <form
              action={
                savedJob
                  ? unSaveJobPost.bind(null, savedJob.id)
                  : saveJobPost.bind(null, jobId)
              }
            >
              <SubmitButton savedJob={!!savedJob} />
            </form>
          ) : (
            <Link
              href={"/login"}
              className={buttonVariants({ variant: "outline" })}
            >
              <Heart className="size-4" />
              Save Job
            </Link>
          )}
        </div>
        <section>
          <JsonToHtml json={JSON.parse(data.jobDescription)} />
        </section>
        <section className="benefits">
          <h3 className="font-semibold mb-4">
            Benefits{" "}
            <span className="text-sm text-muted-foreground">
              (
              <span className="text-red-400 darktext-muted-foreground">
                red
              </span>{" "}
              is offered)
            </span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {benefits.map((benefit) => {
              const isOffered = data.benefits.includes(benefit.id);
              return (
                <Badge
                  className={cn(
                    isOffered ? "" : "opacity-75 cursor-not-allowed",
                    "text-sm px-4 py-1.5 rounded-full"
                  )}
                  key={benefit.id}
                  variant={isOffered ? "default" : "outline"}
                >
                  <span className="flex items-center gap-2">
                    {benefit.icon}
                    {benefit.label}
                  </span>
                </Badge>
              );
            })}
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold">Apply now</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Please let {data.Company.name} know you found this job on
                Workro!. This helps us grow.
              </p>
            </div>
            <Button className="w-full">Apply now</Button>
          </div>
        </Card>

        {/* Job Details Card */}
        <Card className="p-3">
          <h3 className="font-semibold">About this job</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Apply before
              </span>
              <span className="text-sm">
                {new Date(
                  data.createdAt.getTime() +
                    data.listingDuration * 24 * 60 * 60 * 1000
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Posted on</span>
              <span className="text-sm">
                {data.createdAt.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Employment type
              </span>
              <span className="text-sm">{data.employmentType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="text-sm">{data.location}</span>
            </div>
          </div>
        </Card>

        {/* company card */}
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Image
              src={data.Company.logo}
              alt="company-logo"
              width={48}
              height={48}
              className="rounded-full size-12"
            />
            <div className="flex flex-col">
              <h3 className="font-semibold truncate">
                {data.Company.name} | {data.Company.location}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {data.Company.about}
              </p>
              <div className="flex items-center justify-left ml-3 gap-6">
                <Link
                  href={data.Company.website}
                  className="flex gap-1 font-semibold text-sm items-center hover:opacity-75"
                >
                  {" "}
                  website
                  <Image
                    src={"/www.png"}
                    alt="website"
                    width={20}
                    height={20}
                  />
                </Link>
                {data.Company.LinkedinAccount && (
                  <Link
                    href={data.Company.LinkedinAccount}
                    className="flex gap-1 font-semibold text-sm items-center hover:opacity-75"
                  >
                    linkedIn
                    <Image
                      src={"/linkedIn.png"}
                      alt="iflinkedin"
                      width={26}
                      height={26}
                    />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
