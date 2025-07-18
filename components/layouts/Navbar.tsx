import Image from "next/image";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";
import { ThemeToggle } from "./ButtonToggle";
import { auth } from "@/app/utils/auth";
import { UserDropdown } from "./UserDropdown";

export const Navbar = async () => {
  const session = await auth();
  // const theme = localStorage.getItem('workro-theme')\

  return (
    <nav className="flex items-center justify-between py-5">
      <Link href={"/"} className="flex items-center">
        <Image src={"/workro-logo.png"} width={40} height={40} alt="" />
        <h1 className="text-2xl font-bold">
          Workro
          <span className="text-primary">!</span>
        </h1>
        {/* <Image src={'/logo1.png'} width={150} height={100} className='w-34 cursor-pointer mr-14' alt=''  /> */}
      </Link>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {session?.user?.userType === "COMPANY" && (
          <Link
            href={"/post-job"}
            className={buttonVariants({ size: "sm", className: "lg:size-lg" })}
          >
            Post Job
          </Link>
        )}
        {session?.user ? (
          <UserDropdown
            name={session.user.name!}
            email={session.user.email!}
            image={session.user.image!}
            userType={session.user.userType!}
          />
        ) : (
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline" })}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};
