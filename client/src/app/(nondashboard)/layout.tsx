"use client";

import Navbar from "@/components/Navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: authData, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsloading] = useState(true);
  useEffect(() => {
    if (authData) {
      const userRole = authData?.userRole?.toLowerCase();
      if (
        (userRole === "manager" && pathname.startsWith("/search")) ||
        (userRole === "manager" && pathname === "/")
      ) {
        router.push("/manager/properties", { scroll: false });
      }
    } else {
      setIsloading(false);
    }
  }, [authData, router, pathname]);
  if (authLoading || isLoading) return <>Loading...</>;
  return (
    <div className="h-full w-full">
      <Navbar />
      <main
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
        className={`h-full flex w-full flex-col`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
