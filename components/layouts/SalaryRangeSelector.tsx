import React, { useState } from 'react'
import { Slider } from '../ui/slider'
import { Control, useController } from 'react-hook-form'
import { formatCurrency } from '@/app/utils/formatCurrency';

interface SalaryRangeProps {
    control: Control
    minSalary: number,
    maxSalary: number;
    step: number;
    currency: string;
}

export const SalaryRangeSelector = ({control, maxSalary, minSalary} : SalaryRangeProps) => {

    const { field: fromFiled} = useController({
        name: 'salaryFrom',
        control,
    })

    const { field: toFiled} = useController({
        name: 'salaryTo',
        control,
    })

    const  [range, setRange] = useState<[number, number]>([
        fromFiled.value || minSalary,
        toFiled.value || maxSalary / 2
    ])

    const handleChangeRange = (value: number[]) => {
         const newRange : [number, number] = [value[0], value[1]];
         setRange(newRange);
         fromFiled.onChange(newRange[0]);
         toFiled.onChange(newRange[1]);
    }

    return (
    <div className='w-full space-y-4'>
        <Slider onValueChange={handleChangeRange} min={minSalary} max={maxSalary} step={1} value={range} />
    <div className="flex justify-between">
        <span>{formatCurrency(range[0])}</span>
        <span>{formatCurrency(range[1])}</span>
    </div>
    </div>
  )
}
