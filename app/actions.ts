"use server";

import { redirect } from "next/navigation";
import { prisma } from "./utils/db";
import requireUser from "./utils/requireUser";
import { companyScema } from "./utils/zodSchemas";
import { z } from "zod";

export const createCompany = async (data: z.infer<typeof companyScema>) => {
  const session = await requireUser();
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
