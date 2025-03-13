import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Arcjet from '@/public/arcjet.jpg'
import Inngest from '@/public/inngest-locale.png'
import Image from 'next/image'
import { CreateJobForm } from '@/components/forms/CreateJobForm'
import { prisma } from '@/app/utils/db'
import { redirect } from 'next/navigation'
import requireUser from '@/app/utils/requireUser'

const companies = [ 
    {id: 0, name: 'Arcjet', logo: Arcjet},
    {id: 1, name: 'Inngest', logo: Inngest},
    {id: 2, name: 'Arcjet', logo: Arcjet},
    {id: 3, name: 'Inngest', logo: Inngest}, 
    {id: 4, name: 'Arcjet', logo: Arcjet},
    {id: 5, name: 'Inngest', logo: Inngest},
]

const testimonials = [
    {
      quote: "This platform has completely transformed the way we hire talent. The process is seamless and efficient.",
      author: "John Doe",
      company: "TechCorp"
    },
    {
      quote: "We've found some of our best employees through this job board. Highly recommended!",
      author: "Sarah Johnson",
      company: "InnovateX"
    },
    {
      quote: "An intuitive and easy-to-use platform that has helped us connect with amazing professionals.",
      author: "Michael Lee",
      company: "NextGen Solutions"
    },
    {
      quote: "The job posting experience was smooth, and we received quality applications quickly.",
      author: "Emily Carter",
      company: "StartupHub"
    },
    {
      quote: "A game-changer in the hiring process. This platform makes recruitment fast and hassle-free.",
      author: "David Brown",
      company: "Enterprise Inc."
    }
  ];

  const stats = [
    {
      id: 1,
      value: "10K+",
      label: "Jobs Posted"
    },
    {
      id: 2,
      value: "5K+",
      label: "Companies Hiring"
    },
    {
      id: 3,
      value: "50K+",
      label: "Active Users"
    },
    {
      id: 4,
      value: "98%",
      label: "User Satisfaction"
    },
    {
      id: 5,
      value: "200+",
      label: "Industries Covered"
    }
  ];

  const getCompany = async(userId: string) => {
    const data = await prisma.company.findUnique({
      where: {
        userId: userId,
      },
      select: {
        name: true,
        location: true,
        about: true,
        logo: true,
        LinkedinAccount: true,
        website: true,
      },
    })

    if(!data) {
      return redirect("/")
    }
    
    return data;
  }

export default async function PostJobPage (){
  const user = await requireUser();
  const data = await getCompany(user.id as string);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
       <CreateJobForm companyAbout={data.about} companyLinkedinAccount={data.LinkedinAccount} companyLocation={data.location} companyName={data.name} companyLogo={data.logo} companyWebsite={data.website} />
       
        <div className="col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className='text-xl'>Trusted by Industry Leaders</CardTitle>
                    <CardDescription>
                        Join thousands of companies hiring top talent
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                    {/* company logos */}
                    <div className="grid grid-cols-3 gap-4">
                        {companies.map((company)=> (
                            <div key={company.id}>
                                <Image src={company.logo}  alt={company.name} width={80} height={80} className='rounded-lg opacity-75 hover:opacity-100'/>
                            </div>
                        ))}
                    </div>
                    {/* testimonials */}
                    <div className='space-y-4'>
                        {testimonials.map((testimonial, index)=> (
                            <blockquote key={index} className='border-l-2 border-primary pl-4'>
                                <p className='text-sm text-muted-foreground italic'>"{testimonial.quote}"</p>
                                <footer className='mt-2 text-sm font-medium'> - {testimonial.author}, {testimonial.company}</footer>
                            </blockquote>
                        ))}
                    </div>
                    {/* stats */}
                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat)=> (
                            <div key={stat.id} className='rounded-lg bg-muted p-4'>
                                <h4 className="text-2xl font-bold">{stat.value}</h4>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
