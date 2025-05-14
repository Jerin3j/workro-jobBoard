import Link from 'next/link'
import React from 'react'
import { Card, CardHeader } from '../ui/card'
import { MapPin } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '../ui/badge'
import { formatCurrency } from '@/app/utils/formatCurrency'
import FormatRelativeTime from '@/app/utils/FormatRelativeTime'

type iAppProps = {
    job: {
        id: string;
        createdAt: Date;
        Company: {
            name: string;
            location: string;
            about: string;
            logo: string;
        };
        jobTitle: string;
        employmentType: string;
        location: string;
        salaryFrom: number;
        salaryTo: number;
    }
}

export default function JobCard({job}: iAppProps) {
  return (
   <Link href={`/job/${job.id}`}>
    <Card className='hover:border-primary hover:shadow-lg transition-all duration-300'>
        <CardHeader>
            <div className="flex gap-4">
                <Image src={job.Company.logo} alt={job.Company.name} width={48} height={48} className='size-12 rounded-lg'/>
                <div>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold">{job.jobTitle}</h1>
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm text-muted-foreground">{job.Company.name}</p>
                        <span className="hidden md:inline  font-bold text-muted-foreground">•</span>
                        <Badge className='rounded-full' variant={"secondary"}>
                            {job.employmentType}
                        </Badge>
                        <span className="hidden md:inline text-muted-foreground">•</span>
                        <Badge className='rounded-xl hidden md:block' variant={"outline"}>
                          📍{job.location}
                        </Badge>
                        <span className="hidden md:inline text-muted-foreground">•</span>
                        <p className="c">
                            {formatCurrency(job.salaryFrom)} -{" "}
                            {formatCurrency(job.salaryTo)}
                        </p>
                    </div>
                </div>
                <div className="md:ml-auto text-right">
                    <div className='hidden md:flex items-center gap-2 justify-end h-fit'>
                        <MapPin className='size-2 md:size-4'/>
                        <h1 className="text-xs md:text-md truncate md:line-clamp-1">{job.location}</h1>
                    </div>

                    <p className="hidde md:flex text-xs md:text-sm text-muted-foreground md:text-right">{FormatRelativeTime(job.createdAt)}</p>
                </div>
            </div>

            <p className="text-base text-muted-foreground line-clamp-2 mt-2 lg:!mt-5">
                {job.Company.about}
            </p>
        </CardHeader>
    </Card>
   </Link>
  )
}