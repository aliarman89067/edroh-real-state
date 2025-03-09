"use client";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/AppSidebar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import React, { useEffect, useState } from "react";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: authData, isLoading: authLoading } = useGetAuthUserQuery();
  const userRole = authData?.userRole;
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsloading] = useState(true);
  useEffect(() => {
    if (authData) {
      const userRole = authData?.userRole?.toLowerCase();
      if (
        (userRole === "manager" && pathname.startsWith("/tenant")) ||
        (userRole === "tenant" && pathname.startsWith("/manager"))
      ) {
        router.push(
          userRole === "manager" ? "/manager/properties" : "/tenant/favorites",
          { scroll: false }
        );
      } else {
        setIsloading(false);
      }
    }
  }, [authData, router, pathname]);
  if (!authData?.userRole) return null;
  if (authLoading || isLoading) return <>Loading...</>;
  return (
    <SidebarProvider>
      <div>
        <Navbar />
        <div style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
          <main className="flex">
            <Sidebar userType={userRole} />
            <div className="flex-grow transition-all duration-300">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
