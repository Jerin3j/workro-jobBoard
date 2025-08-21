import { handleAcceptSendEmail } from "@/app/actions";
import { prisma } from "@/app/utils/db";
import requireUser from "@/app/utils/requireUser";
import EmptyState from "@/components/layouts/EmptyState";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircleIcon, DownloadIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

async function getEmployerApplications(employerId: string) {
  const data = await prisma.appliedJobPost.findMany({
    where: {
      JobPost: {
        Company: {
          userId: employerId,
        },
      },
    },
    include: {
      User: {
        include: {
          JobSeeker: true, // candidate details
        },
      },
      JobPost: {
        include: {
          Company: true, // job post + company
        },
      },
    },
  });
  return data;
}

export default async function page() {
  const session = await requireUser();
  const jobApplications = await getEmployerApplications(session.id as string);

  if (jobApplications.length === 0) {
      return (
        <EmptyState
          title="No Applications Found"
          description="You have not received any applications yet."
          buttonText="Find a job"
          href="/"
        />
      );
    }
  
  return (
    <div>
      {jobApplications.map((application) => (
        <Card key={application.id} className="mb-4">
          <CardHeader>
            <CardTitle>
              {application?.JobPost?.jobTitle}
              {"  "}
              <Badge
                variant={"outline"}
                className="border-red-600 text-red-600"
              >
                {application.JobPost.status}
              </Badge>
            </CardTitle>
            <CardDescription>{application?.JobPost?.location}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant&apos;s Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Resume</TableHead>
                  <TableHead>Applied At</TableHead>
                  <TableHead>-</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key={application.User?.id}>
                  <TableCell>{application.User?.JobSeeker?.name}</TableCell>
                  <TableCell>{application.User?.email}</TableCell>
                  <TableCell>
                    <Link
                      href={application.User?.JobSeeker?.resume as string}
                      target="_blank"
                      className="flex items-center gap-1 text-blue-500 hover:underline"
                    >
                      <DownloadIcon size={16} /> Resume
                    </Link>
                  </TableCell>
                  <TableCell>
                    {application?.createdAt.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <form
                      action={async () => {
                        "use server";
                        await handleAcceptSendEmail({
                          userEmail: application.User.email!,
                          userName: application.User?.JobSeeker?.name,
                          jobTitle: application.JobPost.jobTitle!,
                        });
                      }}
                    >
                      <Button
                        variant={"outline"}
                        type="submit"
                        className="cursor-pointer"
                      >
                        Accept
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
      <Alert variant="destructive" className="grid w-full max-w-md items-start">
        <AlertCircleIcon />
        <AlertTitle>Cannot send email</AlertTitle>
        <AlertDescription>
          Email sending is currently disabled because the Resend domain is not
          added. Please contact support.
        </AlertDescription>
      </Alert>
    </div>
  );
}
