import { prisma } from "@/app/utils/db";
import requireUser from "@/app/utils/requireUser";
import { CopyLinkMenuItem } from "@/components/layouts/CopyLink";
import EmptyState from "@/components/layouts/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, PenIcon, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const getJobs = async (userId: string) => {
  const data = await prisma.jobPost.findMany({
    where: {
      Company: {
        userId: userId,
      },
    },
    select: {
      id: true,
      jobTitle: true,
      status: true,
      createdAt: true,
      Company: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
};

export default async function page() {
  const session = await requireUser();
  const data = await getJobs(session.id as string);
  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No job posts found"
          description="You dont have any job posts yet."
          {...(session.userType == "COMPANY" && {
            buttonText: "Create a job post now!",
          })}
          href="/post-job"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>My Jobs</CardTitle>
            <CardDescription>
              Manage your job listing and applications here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created at</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <Image
                        src={listing.Company.logo}
                        alt="logo of company"
                        width={40}
                        height={40}
                        className="rounded-md size-10"
                      />
                    </TableCell>
                    <TableCell>{listing.Company.name}</TableCell>
                    <TableCell>{listing.jobTitle}</TableCell>
                    <TableCell>
                      {listing.status.charAt(0).toUpperCase() +
                        listing.status.slice(1).toLowerCase()}
                    </TableCell>
                    <TableCell>
                      {listing.createdAt.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant={"ghost"} size={"icon"}>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="px-3">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenu>
                            <DropdownMenuItem asChild>
                              <Link href={`/my-jobs/${listing.id}/edit`}>
                                <PenIcon />
                                Edit Job
                              </Link>
                            </DropdownMenuItem>
                            <CopyLinkMenuItem
                              jobUrl={`${process.env.NEXT_PUBLIC_URL}/job/${listing.id}`}
                            />
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/my-jobs/${listing.id}/delete`}>
                                <XCircle />
                                Delete Job
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenu>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
