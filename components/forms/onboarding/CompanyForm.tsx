import React, { useState } from 'react'
import { z } from 'zod';
import Image from 'next/image';
import { useForm } from 'react-hook-form'
import { XIcon } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { companyScema } from '@/app/utils/zodSchemas';
import { createCompany } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UploadDropzone } from '@/components/layout/UploadWrapper';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IndianCities } from '@/app/utils/IndianCities';

export const CompanyForm = () => {
  const [pending, setPending] = useState(false);

    //array of objs into flat array
    const indianCities = Object.entries(IndianCities).flatMap(([key, values])=> values.map((value)=> `${key}, ${value}`))
  

  const form = useForm({
    resolver: zodResolver(companyScema),
    defaultValues: {
      name: "",
      location: "",
      about: "",
      logo: "",
      website: "",
      LinkedinAccount: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof companyScema>) => {
    try {
      setPending(true);
      await createCompany(data);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Location*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location"></SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>worldwide</SelectLabel>
                      <SelectItem value="worldwide">
                        <span>🌍</span> <span>Worldwide / Remote</span>
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
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website*</FormLabel>
                <FormControl>
                  <Input placeholder="https://yourwebsite.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="LinkedinAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input placeholder="linkedin.com/in/ " {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About*</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="tell us about your company..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo"
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
