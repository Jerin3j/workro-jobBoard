import Image from "next/image";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";
import { ThemeToggle } from "./ButtonToggle";
import { auth } from "@/app/utils/auth";
import { UserDropdown } from "./UserDropdown";

export const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="flex items-center justify-between py-5">
      <Link href={"/"} className="flex items-center">
        <Image src={"/logo.png"} width={40} height={40} alt="" />
        <h1 className="text-2xl font-bold">
          Workro
          <span className="text-primary">!</span>
        </h1>
      </Link>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link
          href={"/post-job"}
          className={buttonVariants({ size: "sm", className: "lg:size-lg" })}
        >
          Post Job
        </Link>
        {session?.user ? (
          <UserDropdown
            name={session.user.name!}
            email={session.user.email!}
            image={session.user.image!}
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
