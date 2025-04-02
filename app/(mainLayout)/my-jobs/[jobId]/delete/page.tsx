import { deleteJobPost } from '@/app/actions'
import requireUser from '@/app/utils/requireUser'
import { GeneralSubmitButton } from '@/components/layouts/SubmitButton'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Params = Promise<{jobId: string}>
export default async function page({params}: {params: Params}) {
  const {jobId} = await params;
  await requireUser();

  return (
    <div>
      <Card className='max-w-full mx-auto mt-28'>
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permentaly  delete your job listing and remove all your data from our servers.
          </CardDescription>
        </CardHeader>
        <CardFooter className='flex justify-between items-center'>
          <Link href={'/'} className={buttonVariants({variant: 'secondary'})}>
            <ArrowLeft/>
            Cancel
          </Link>
        <form action={async()=>{
          'use server'
          await deleteJobPost(jobId)
        }}>
          <GeneralSubmitButton width=' ' title='Delete Job' varient={'destructive'} icon={<TrashIcon/>}/>
        </form>
        </CardFooter>
      </Card>
    </div>
  )
}
