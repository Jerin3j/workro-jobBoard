import { createJobSeeker } from "@/app/actions";
import { userSchema } from "@/app/utils/zodSchemas";
import { UploadDropzone } from "@/components/layout/UploadWrapper";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ResumePdf from "@/public/pdf.png";

export const UserForm = () => {
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      bio: "",
      resume: "",
      // location: "",
      // website: "",
      // LinkedinAccount: "",
    },
  });

  const [pending, setPending] = useState(false);

  const onSubmit = async (data: z.infer<typeof userSchema>) => {
    try {
      setPending(true);
      await createJobSeeker(data);
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        console.log("something went wrong", error);
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Bio*</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about yourself" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume (PDF)*</FormLabel>
              <FormControl>
                {field.value ? (
                  <div className="w-fit relative">
                    <Image
                      src={ResumePdf}
                      alt="company Logo"
                      width={50}
                      height={50}
                      className="rounded-lg"
                    />
                    <Button
                      type="button"
                      variant={"outline"}
                      size={"icon"}
                      className="absolute -top-2 -right-2 bg-red-500/50 cursor-pointer size-7"
                      onClick={() => field.onChange("")}
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <UploadDropzone
                    endpoint={"resumeUploader"}
                    onClientUploadComplete={(res) => {
                      field.onChange(res[0].url);
                    }}
                    onUploadError={(error) => {
                      console.log("something went wrong", error);
                    }}
                    className="ut-button:bg-primary ut-button::text-white ut-button:hover:bg-primary/90 ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border-primary cursor-pointer"
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={pending}
        >
          {pending ? "Submitting.." : "Continue"}
        </Button>
      </form>
    </Form>
  );
};
