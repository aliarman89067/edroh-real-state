"use client";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { Bell, MessageCircle, Plus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";

const Navbar = () => {
  const { data: authData } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const isDashboardPage =
    pathname.includes("/manager") || pathname.includes("tenant");

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };
  return (
    <div
      style={{ height: `${NAVBAR_HEIGHT}px` }}
      className="fixed top-0 left-0 w-full z-50 shadow-xl"
    >
      <div className="flex justify-between items-center w-full h-full py-3 px-8 bg-primary-700 text-white">
        <div className="flex items-center gap-4 md:gap-6">
          {isDashboardPage && (
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          )}
          <Link
            href="/"
            className="cursor-pointer hover:text-primary-300"
            scroll={false}
          >
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Rentiful Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="text-xl font-bold">
                RENT{" "}
                <span className="text-secondary-500 font-light hover:text-primary-300">
                  IFUL
                </span>
              </div>
            </div>
          </Link>
          {isDashboardPage && authData && (
            <Button
              variant="secondary"
              onClick={() =>
                router.push(
                  authData?.userRole?.toLowerCase() === "manager"
                    ? "/manager/newproperty"
                    : "/tenant/search"
                )
              }
              className="md:ml-4 bg-primary-50 text-primary-700 hover:bg-secondary-500 hover:text-primary-50"
            >
              {authData?.userRole?.toLowerCase() === "manager" ? (
                <>
                  <Plus className="h-4 2-4" />
                  <span className="hidden md:block ml-2">Add New Property</span>
                </>
              ) : (
                <>
                  <Search className="size-4" />
                  <span className="hidden md:block ml-2">
                    Search Properties
                  </span>
                </>
              )}
            </Button>
          )}
        </div>
        {!isDashboardPage && (
          <p className="hidden md:block text-primary-200">
            Discover your perfect rental appartment with our advanced search
          </p>
        )}
        <div className="flex items-center gap-5">
          {authData ? (
            <>
              <div className="relative hidden md:block">
                <MessageCircle className="w-6 h-6 cursor-pointer text-primary-200 hover:text-primary-400" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-700 rounded-full"></span>
              </div>
              <div className="relative hidden md:block">
                <Bell className="w-6 h-6 cursor-pointer text-primary-200 hover:text-primary-400" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-700 rounded-full"></span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
                  <Avatar>
                    <AvatarImage src={authData?.userInfo?.image} />
                    <AvatarFallback className="bg-primary-600">
                      {authData?.userRole?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-primary-200 hidden md:block">
                    {authData?.userInfo?.name}
                  </p>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-primary-700">
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(
                        authData?.userRole?.toLowerCase() === "manager"
                          ? "/manager/properties"
                          : "/tenant/favorites",
                        { scroll: false }
                      )
                    }
                    className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-50 font-bold"
                  >
                    Go to Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-primary-200" />
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(
                        authData?.userRole?.toLowerCase() === "manager"
                          ? "/manager/settings"
                          : "/tenant/settings",
                        { scroll: false }
                      )
                    }
                    className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-50 font-bold"
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-50 font-bold"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="text-white border-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="signup">
                <Button
                  variant="secondary"
                  className="text-white bg-secondary-600 hover:bg-white hover:text-primary-700 rounded-lg"
                >
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
