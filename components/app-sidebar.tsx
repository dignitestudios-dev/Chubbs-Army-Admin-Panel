"use client";

import * as React from "react";
import {
  LayoutDashboard,
  CheckSquare,
  HandCoins,
  Rat,
  Calendar,
  Users,
  ClipboardMinus,
  MessageSquareWarning,
  Megaphone,
  Store,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

const data = {
  user: {
    name: "Next js",
    email: "admin@example.com",
    avatar: "",
  },
  navGroups: [
    {
      label: "Dashboards",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "User Management",
          url: "/dashboard/users",
          icon: Users,
        },
        {
          title: "Content Management",
          url: "/dashboard/content",
          icon: CheckSquare,
        },
        {
          title: "Reported Content",
          url: "/dashboard/reported-content",
          icon: MessageSquareWarning,
        },
        {
          title: "Pet Management",
          url: "/dashboard/pet",
          icon: Rat,
        },
        {
          title: "Marketplace Management",
          url: "/dashboard/marketplace",
          icon: Store,
        },
        {
          title: "Event Management",
          url: "/dashboard/event",
          icon: Calendar,
        },
        {
          title: "Payment Management",
          url: "/dashboard/payment",
          icon: HandCoins,
        },
        // {
        //   title: "Subscription Management",
        //   url: "/dashboard/subscription",
        //   icon: LayoutDashboard,
        // },
        // {
        //   title: "Support Ticket System",
        //   url: "/dashboard/support",
        //   icon: LayoutDashboard,
        // },
        // {
        //   title: "Dispute Handling",
        //   url: "/dashboard/disputes",
        //   icon: LayoutDashboard,
        // },
        {
          title: "Push Notifications",
          url: "/dashboard/notifications",
          icon: Megaphone,
        },
        {
          title: "Analytics & Reports",
          url: "/dashboard/reports",
          icon: ClipboardMinus,
        },
        {
          title: "Ads Banner",
          url: "/dashboard/adsmanagement",
          icon: Megaphone,
        },
        // {
        //   title: "System Settings",
        //   url: "/dashboard/settings",
        //   icon: LayoutDashboard,
        // },
      ],
    },
    // {
    //   label: "Apps",
    //   items: [
    //     {
    //       title: "Mail",
    //       url: "/mail",
    //       icon: Mail,
    //     },
    //     {
    //       title: "Tasks",
    //       url: "/tasks",
    //       icon: CheckSquare,
    //     },
    //     {
    //       title: "Chat",
    //       url: "/chat",
    //       icon: MessageCircle,
    //     },
    //     {
    //       title: "Calendar",
    //       url: "/calendar",
    //       icon: Calendar,
    //     },
    //     {
    //       title: "Users",
    //       url: "/dashboard/users",
    //       icon: Users,
    //     },
    //   ],
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSelector((state: RootState) => state.auth.user);

  const userData = user
    ? {
        name: user.name,
        email: user.email,
        avatar: "",
      }
    : {
        name: "Guest",
        email: "",
        avatar: "",
      };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  {/* <Logo size={24} className="text-current" /> */}
                  <Image
                    src="/images/theLogo.png"
                    alt="logo"
                    width={24}
                    height={24}
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    Chubb&apos;s Army
                  </span>
                  <span className="truncate text-xs">Admin Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navGroups.map((group) => (
          <NavMain key={group.label} label={group.label} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
