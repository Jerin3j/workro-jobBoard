"use server";

import { redirect } from "next/navigation";
import { prisma } from "./utils/db";
import requireUser from "./utils/requireUser";
import { companyScema, jobSchema } from "./utils/zodSchemas";
import { userSchema } from "./utils/zodSchemas";
import { z } from "zod";
import arcjet, { detectBot, shield } from "./utils/arcjet";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
  shield({
    mode: 'LIVE'
  })
).withRule(
  detectBot({
    mode: 'LIVE',
    allow: []
  })
)


export const createCompany = async (data: z.infer<typeof companyScema>) => {
  const session = await requireUser();
  //arcjet validation
  const req = await request();
  const decision = await aj.protect(req);

  if(decision.isDenied()){
    throw new Error("Forbidden")
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

 if(decision.isDenied()){
   throw new Error("Forbidden")
 }
 
  const validateData = userSchema.parse(data);

  await prisma.user.update({
    where: {
      id: session.id as string,
    },
    data: {
      onBoardingCompleted: true,
      userType: 'JOB_SEEKER',
      JobSeeker: {
        create: {
          ...validateData
        },
      },
    }
  })
  return redirect("/")
}


export const createJob = async(data: z.infer<typeof jobSchema>) => {
  const session = await requireUser();

  const req = await request();
  const decision = await aj.protect(req);

 if(decision.isDenied()){
  throw new Error("Forbidden")
}

const validateData = jobSchema.parse(data);

const company = await prisma.company.findUnique({
  where: {
    userId: session.id   //session means loggined user obj
  },
  select: {
    id: true
  }
})

if(!company?.id){
  return redirect("/")
}

await prisma.jobPost.create({
  data:{
    jobTitle: validateData.jobTitle,
    jobDescription: validateData.jobDescription,
    employmentType: validateData.employmentType,
    location: validateData.location,
    salaryFrom: validateData.salaryFrom,
    salaryTo: validateData.salaryTo,
    listingDuration: validateData.listingDuration,
    benefits: validateData.benefits,
    companyId: company?.id
  }
})

return redirect("/")

}