import React from 'react'
import { ControllerRenderProps } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { jobListingPrices } from '@/app/utils/jobListingPrices';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';

interface iAppProps {
  field: ControllerRenderProps;
  disabled?: boolean
}
export default function JobListingSelector({ field, disabled }: iAppProps ) {
  return (
    <RadioGroup
    disabled={disabled}
      value={field.value?.toString()}
      onValueChange={(value) => field.onChange(parseInt(value))}
    >
      <div className="flex flex-col gap-4">
        {jobListingPrices.map((jobPricing) => (
          <div key={jobPricing.days} className="relative">
            <RadioGroupItem
              value={jobPricing.days.toString()}
              id={jobPricing.days.toString()}
              className="sr-only"
            />
            <Label
              htmlFor={jobPricing.days.toString()}
              className={`flex flex-col ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Card
                className={cn(
                  field.value === jobPricing.days
                    ? "border-primary bg-primary/10"
                    : "hover:bg-secondary/50",
                  "p-4 border-2 transition-all w-full"
                )}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">
                      {jobPricing.days} Days
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {jobPricing.description}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-xl">₹ {jobPricing.price}</p>
                    <p className="text-sm text-muted-foreground">
                      {((jobPricing.price as number) / jobPricing.days).toFixed(
                        1
                      )}
                      /day
                    </p>
                  </div>
                </div>
              </Card>
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
}
