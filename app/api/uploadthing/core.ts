import requireUser from "@/app/utils/requireUser";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  
  imageUploader: f({
    image: {
     maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })

    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const user = await requireUser()
      // If you throw, the user will not be able to upload
      if (!user.id) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),

    resumeUploader: f({
      'application/pdf': {
       maxFileSize: "2MB",
        maxFileCount: 1,
      },
    })
  
      // Set permissions and file types for this FileRoute
      .middleware(async () => {
        // This code runs on your server before upload
        const user = await requireUser()
        // If you throw, the user will not be able to upload
        if (!user.id) throw new UploadThingError("Unauthorized");
  
        // Whatever is returned here is accessible in onUploadComplete as `metadata`
        return { userId: user.id };
      })
      .onUploadComplete(async ({ metadata }) => {
        // This code RUNS ON YOUR SERVER after upload
        console.log("Upload complete for userId:", metadata.userId);
  
        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata.userId };
      }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
