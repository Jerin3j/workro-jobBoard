"use client";
import React, { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { IndianCities } from "@/app/utils/IndianCities";
import { useRouter, useSearchParams } from "next/navigation";

export default function JobFilters() {
  const indianCities = Object.entries(IndianCities).flatMap(([key, values]) =>
    values.map((value) => `${key}, ${value}`)
  );

  const JobTypes = ["full-time", "part-time", "internship", "contract"];

  const router = useRouter();
  const searchParams = useSearchParams();

  const currentJobTypes = searchParams.get("jobTypes")?.split(",") || [];
  const currentLocation = searchParams.get("location") || "";

  const clearAllFilters = () => {
    router.push("/");
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleJobTypeChange = (jobType: string, checked: boolean) => {
    const current = new Set(currentJobTypes);

    if (checked) {
      current.add(jobType);
    } else {
      current.delete(jobType);
    }

    const newValue = Array.from(current).join(",");
    router.push(`?${createQueryString("jobTypes", newValue)}`);
  };

  const handleLocationChange = (location: string) => {
    router.push(`?${createQueryString("location", location)}`);
  };

  const handleJobTypeChangeSelect = (jobType: string) => {
    const current = new Set(currentJobTypes);
    current.add(jobType);
    const newValue = Array.from(current).join(",");

    router.push(`?${createQueryString("jobTypes", newValue)}`);
  };
  return (
    <Card className="w-full lg:col-span-1 lg:h-fit">
      {/* for large devices */}
      <CardHeader className="hidden lg:flex flex-row justify-between items-center">
        <CardTitle className="text-2xl font-semibold">Filters</CardTitle>
        <Button
          onClick={clearAllFilters}
          variant={"destructive"}
          size={"sm"}
          className="h-8"
        >
          <span>Clear All</span>
          <XIcon className="size-4" />
        </Button>
      </CardHeader>
      <Separator className="hidden lg:block" />

      <CardContent className="hidden lg:block space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Job Type</Label>
          <div className="grid grid-cols-2 gap-4">
            {JobTypes.map((job, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  onCheckedChange={(checked) => {
                    handleJobTypeChange(job, checked as boolean);
                  }}
                  id={job}
                  checked={currentJobTypes.includes(job)}
                />
                <Label htmlFor={job}>{job}</Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label className="text-lg font-semibold">Location</Label>
          <Select
            onValueChange={(value) => {
              handleLocationChange(value);
            }}
            value={currentLocation}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
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
        </div>
      </CardContent>

      {/* for small devices */}
      <CardContent className="flex items-center h-3 justify-between lg:hidden">
        <Select
          onValueChange={(job) => {
            handleJobTypeChangeSelect(job);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Job Type</SelectLabel>
              {JobTypes.map((job) => (
                <SelectItem key={job} value={job}>
                  <span className="pl-2">{job}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => {
            handleLocationChange(value);
          }}
          value={currentLocation}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Worldwide</SelectLabel>
              <SelectItem value="worldwide">
                <span>🌍</span> <span className="pl-2">Worldwide / Remote</span>
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
        <Button
          onClick={clearAllFilters}
          variant={"destructive"}
          size={"sm"}
          className="h-8"
        >
          {/* <span>Clear</span> */}
          <XIcon className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
