"use server";

import { redirect } from "next/navigation";
import { prisma } from "./utils/db";
import requireUser from "./utils/requireUser";
import { companyScema, jobSchema } from "./utils/zodSchemas";
import { userSchema } from "./utils/zodSchemas";
import { z } from "zod";
import arcjet, { detectBot, shield } from "./utils/arcjet";
import { request } from "@arcjet/next";
import Razorpay from "razorpay";
import { inngest } from "./utils/inngest/client";
import { revalidatePath } from "next/cache";

const aj = arcjet
  .withRule(
    shield({
      mode: "LIVE",
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  );

export const createCompany = async (data: z.infer<typeof companyScema>) => {
  const session = await requireUser();
  //arcjet validation
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }
  const validateData = companyScema.parse(data);

  await prisma.user.update({
    where: {
      id: session.id,
    },
    data: {
      onBoardingCompleted: true,
      userType: "COMPANY",
      company: {
        create: {
          ...validateData,
        },
      },
    },
  });
  return redirect("/");
};

export const createJobSeeker = async (data: z.infer<typeof userSchema>) => {
  const session = await requireUser();
  //arcjet validation
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validateData = userSchema.parse(data);

  await prisma.user.update({
    where: {
      id: session.id as string,
    },
    data: {
      onBoardingCompleted: true,
      userType: "JOB_SEEKER",
      JobSeeker: {
        create: {
          ...validateData,
        },
      },
    },
  });
  return redirect("/");
};

export const createJob = async (data: z.infer<typeof jobSchema>) => {
  try {
    const session = await requireUser();

    if (!session || !session.email || !session.name || !session.id) {
      throw new Error("Session data is missing or invalid");
    }

    const req = await request();
    const decision = await aj.protect(req);
    if (decision.isDenied()) {
      throw new Error(" Forbidden: User is not authorized.");
    }

    const validateData = jobSchema.parse(data);

    const company = await prisma.company.findUnique({
      where: { userId: session.id },
      select: {
        id: true,
        user: { select: { razorpayCustomerId: true } },
      },
    });

    if (!company?.id) {
      console.log("No company found for user:", session.id);
      return redirect("/");
    }

    let razorpayCustomerId = company.user.razorpayCustomerId;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    try {
      const uniqueEmail = `${session.email.split("@")[0]}+${Date.now()}@${
        session.email.split("@")[1]
      }`;

      const customer = await razorpay.customers.create({
        email: uniqueEmail,
        name: session.name,
      });

      razorpayCustomerId = customer.id;

      await prisma.user.findUnique({
        where: { id: session.id },
      });

      await prisma.user.update({
        where: { id: session.id },
        data: { razorpayCustomerId: razorpayCustomerId },
      });
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create Razorpay customer");
    }

    const jobPost = await prisma.jobPost.create({
      data: {
        jobTitle: validateData.jobTitle,
        jobDescription: validateData.jobDescription,
        employmentType: validateData.employmentType,
        location: validateData.location,
        salaryFrom: validateData.salaryFrom,
        salaryTo: validateData.salaryTo,
        listingDuration: validateData.listingDuration,
        benefits: validateData.benefits,
        companyId: company.id,
      },
      select: { id: true },
    });

    console.log("JobPost ID:", jobPost.id);

    //inngest setting
try {
  await inngest.send({
    name: "job/created",
    data: {
      jobId: jobPost.id,
      expirationDays: validateData.listingDuration,
    },
  });
} catch (err) {
  console.error("Inngest error (will not block job creation):", err);
}

    return jobPost;
  } catch (error) {
    console.error("Error in createJob function:", error);
  }
};

export const saveJobPost = async (jobId: string) => {
  const user = await requireUser();
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }
  await prisma.savedJobPost.create({
    data: {
      jobPostId: jobId,
      userId: user.id as string,
    },
  });

  revalidatePath(`/job/${jobId}`);
};

export const unSaveJobPost = async (savedJobPostId: string) => {
  const user = await requireUser();
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }
  const data = await prisma.savedJobPost.delete({
    where: {
      id: savedJobPostId,
      userId: user.id as string,
    },
    select: {
      jobPostId: true,
    },
  });

  revalidatePath(`/job/${data.jobPostId}`);
};

export const editJobPost = async (
  data: z.infer<typeof jobSchema>,
  jobId: string
) => {
  const user = await requireUser();
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validateData = jobSchema.parse(data);

  await prisma.jobPost.update({
    where: {
      id: jobId,
      Company: {
        userId: user.id,
      },
    },
    data: {
      jobTitle: validateData.jobTitle,
      jobDescription: validateData.jobDescription,
      benefits: validateData.benefits,
      employmentType: validateData.employmentType,
      location: validateData.location,
      salaryFrom: validateData.salaryFrom,
      salaryTo: validateData.salaryTo,
      listingDuration: validateData.listingDuration,
    },
  });
  return redirect("/");
};

export async function deleteJobPost(jobId: string) {
  const user = await requireUser();
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  await prisma.jobPost.delete({
    where: {
      id: jobId,
      Company: {
        userId: user.id,
      },
    },
  });

  await inngest.send({
    name: "job/cancel.expiration",
    data: { jobId: jobId },
  });
  return redirect("/");
}
