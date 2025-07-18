'use client'
import React, { useState } from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "../ui/form";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SalaryRangeSelector } from '../layouts/SalaryRangeSelector';
import JobDescriptionEditor from '../RichTextEditor.tsx/JobDescriptionEditor';
import BenefitsSelector from '../layouts/BenefitsSelector';
import Image from 'next/image';
import { Button } from '../ui/button';
import JobListingSelector from '../layouts/JobListingSelector';
import { useForm } from 'react-hook-form';
import { jobSchema } from '@/app/utils/zodSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UploadDropzone } from '../layouts/UploadWrapper';
import { XIcon } from 'lucide-react';
import { editJobPost } from '@/app/actions';
import { IndianCities } from '@/app/utils/IndianCities';

interface iAppProps{
 jobPost: {
        id: string;
        jobTitle: string;
    employmentType: string;
    location: string;
    salaryFrom: number;
    salaryTo: number;
    jobDescription: string;
    listingDuration: number;
    benefits: string[];
        Company: {
            name: string;
            location: string;
            about: string;
            logo: string;
            website: string;
            LinkedinAccount: string | null;
        };
    }
}
export default function EditJobForm({jobPost}: iAppProps) {

    const indianCities = Object.entries(IndianCities).flatMap(([key, values]) =>
        values.map((value) => `${key}, ${value}`)
      );

      const form = useForm<z .infer<typeof jobSchema>>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
          benefits: jobPost.benefits,
          companyAbout: jobPost.Company.about,
          companyLocation: jobPost.Company.location,
          companyLogo: jobPost.Company.logo,
          companyName: jobPost.Company.name,
          companyWebsite: jobPost.Company.website,
          companyLinkedinAccount: jobPost.Company.LinkedinAccount || "",
          employmentType: jobPost.employmentType,
          jobDescription: jobPost.jobDescription,
          jobTitle: jobPost.jobTitle,
          listingDuration: jobPost.listingDuration,
          location: jobPost.location,
          salaryFrom: jobPost.salaryFrom,
          salaryTo: jobPost.salaryTo,
        },
      });
    
      const [pending, setPending] = useState(false);

        const onSubmit = async (data: z.infer<typeof jobSchema>) => {
        //   const pricingTier = jobListingPrices.find(
        //     (tier) => tier.days === data.listingDuration
        //   );
      
          try {
            setPending(true);
            await editJobPost(data, jobPost.id);
            
          } catch (error) {
            if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
              console.log("Something went wrong:", error.message);
            }
          } finally {
            setPending(false);
          }
        };

  return (
    <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="col-span-1 lg:col-span-2 flex flex-col gap-8"
    >
      <Card>
        <CardHeader>
          <CardTitle>Job Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Job Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Type*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Employment Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select Employment Type</SelectLabel>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="internship">
                          Internship
                        </SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Location*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Job Location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Remote</SelectLabel>
                        <SelectItem value="remote">
                          <span>🌍</span>{" "}
                          <span className="pl-2">Remote / Worldwide</span>
                        </SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Location</SelectLabel>
                        {indianCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            <span className="pl-2">{city}</span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Salary Range*</FormLabel>
              <FormControl>
                <SalaryRangeSelector
                  control={form.control as any}
                  minSalary={1000}
                  maxSalary={100000}
                  currency="INR"
                  step={2000}
                />
              </FormControl>
            </FormItem>
          </div>

          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description*</FormLabel>
                <FormControl>
                  <JobDescriptionEditor field={field as any} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="benefits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Benefits*</FormLabel>
                <FormControl>
                  <BenefitsSelector field={field as any} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Company Name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Location*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Company Location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Worldwide</SelectLabel>
                        <SelectItem value="worldwide">
                          <span>🌍</span>{" "}
                          <span className="pl-2">Worldwide / Remote</span>
                        </SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Location</SelectLabel>
                        {indianCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            <span className="pl-2">{city}</span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="companyWebsite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Website*</FormLabel>
                  <FormControl>
                    <Input placeholder="Company Website..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyLinkedinAccount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company LinkedIn*</FormLabel>
                  <FormControl>
                    <Input placeholder="Company LinkedIn..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="companyAbout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Description*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Say something about Company..."
                    {...field}
                    className="min-h-[120px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyLogo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Logo*</FormLabel>
                <FormControl>
                  {field.value ? (
                    <div className="w-fit relative">
                      <Image
                        src={field.value}
                        alt="company Logo"
                        width={100}
                        height={100}
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
                      endpoint={"imageUploader"}
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
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Job Listing Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            disabled={true}
            // control={form.control}
            name="listingDuration"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <JobListingSelector field={field as any} disabled={true}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={pending}
      >
        {pending ? "Submitting.." : "Edit New Job"}
      </Button>
    </form>
  </Form>
  )
}
