import Image from "next/image";
import Logo  from "@/public/workro-logo.png";
import Link from "next/link";
import {LoginForm} from "@/components/forms/LoginForm";

export default function login () {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
        <div className="flex w-full max-w-sm flex-col gap-6">
            <Link href={'/'} className="flex items-center gap-2 self-center"> 
            <Image src={Logo} alt="" className="size-10" />
            <h1 className="text-2xl font-bold">Workro
                <span className="text-primary">!</span>
            </h1>
            </Link>
            <LoginForm/>
        </div>
    </div>
  )
}
