import { usePathname } from "next/navigation";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import {
  Building,
  FileText,
  Heart,
  Home,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";

const AppSidebar = ({ userType }: AppSidebarProps) => {
  const pathname = usePathname();
  const { toggleSidebar, open } = useSidebar();

  const navLinks =
    userType === "manager"
      ? [
          {
            icon: Building,
            label: "Properties",
            href: "/manager/properties",
          },
          {
            icon: FileText,
            label: "Applications",
            href: "/manager/applications",
          },
          {
            icon: Settings,
            label: "Settings",
            href: "/manager/settings",
          },
        ]
      : [
          {
            icon: Heart,
            label: "Favorites",
            href: "/tenant/favorites",
          },
          {
            icon: FileText,
            label: "Applications",
            href: "/tenant/applications",
          },
          {
            icon: Home,
            label: "Residences",
            href: "/tenant/residences",
          },
          {
            icon: Settings,
            label: "Settings",
            href: "/tenant/settings",
          },
        ];

  return (
    <Sidebar
      collapsible="icon"
      style={{
        top: `${NAVBAR_HEIGHT}px`,
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
      className="fixed left-0 bg-white shadow-lg"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className={cn(
                "flex min-h-[56px] w-full items-center pt-3 mb-3",
                open ? "justify-between px-6" : "justify-center"
              )}
            >
              {open ? (
                <>
                  <h1 className="text-xl font-bold text-gray-800">
                    {userType === "manager" ? "Manager View" : "Renter View"}
                  </h1>
                  <button
                    onClick={() => toggleSidebar()}
                    className="hover:bg-gray-100 p-2 rounded-md"
                  >
                    <X className="size-6 text-gray-600" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => toggleSidebar()}
                    className="hover:bg-gray-100 p-2 rounded-md"
                  >
                    <Menu className="size-6 text-gray-600" />
                  </button>
                </>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex items-center">
        <SidebarMenu className="flex justify-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "flex items-center px-7 py-7",
                    isActive
                      ? "bg-gray-100"
                      : "text-gray-600 hover:bg-gray-100",
                    open ? "text-blue-600" : "ml-[5px]"
                  )}
                >
                  <Link href={link.href} className="w-full" scroll={false}>
                    <div className="flex items-center gap-3">
                      <link.icon
                        className={cn(
                          "size-5",
                          isActive ? "text-blue-600" : "text-gray-600"
                        )}
                      />
                      <span
                        className={cn(
                          "font-medium",
                          isActive ? "text-blue-600" : "text-gray-600"
                        )}
                      >
                        {link.label}
                      </span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
