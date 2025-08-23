import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ChevronDown, Heart, Layers2, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/app/utils/auth";

interface UserProps {
  email: string;
  name: string;
  image: string;
  userType: string;
}

export const UserDropdown = ({ email, image, name, userType }: UserProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={image} alt="Profile Pic" />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <ChevronDown size={16} strokeWidth={2} className="ml-2 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{name}</span>
          <span className="text-xs lowercase text-muted-foreground">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={"/saved-jobs"}>
              <Heart size={16} strokeWidth={2} className="opacity-60" />
              <span>Saved Jobs</span>
            </Link>
          </DropdownMenuItem>
          {userType === "COMPANY" ? (
            <DropdownMenuItem asChild>
              <Link href={"/my-jobs"}>
                <Layers2 size={16} strokeWidth={2} className="opacity-60" />
                <span>My Jobs Listings</span>
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <Link href={"/applied-jobs"}>
                <Layers2 size={16} strokeWidth={2} className="opacity-60" />
                <span>Applied Jobs</span>
              </Link>
            </DropdownMenuItem>
          )}
          {userType === "COMPANY" && (
            <DropdownMenuItem asChild>
              <Link href={"/applications"}>
                <Layers2 size={16} strokeWidth={2} className="opacity-60" />
                <span>Applications</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
              window.location.reload();
            }}
          >
            <button className="flex gap-1 items-center w-full text-red-600 hover:text-red-800">
              <LogOut size={16} strokeWidth={2} className="opacity-60" />
              <span>Logout</span>
            </button>
          </form>
        </DropdownMenuItem>
        <p></p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
