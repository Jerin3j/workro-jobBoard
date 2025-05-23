import { inngest } from "@/app/utils/inngest/client";
import { handleJobExpiration, helloWorld, notifyNewJobs } from "@/app/utils/inngest/functions";
import { serve } from "inngest/next";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
   helloWorld,
   handleJobExpiration,
   notifyNewJobs,
  ],
});
