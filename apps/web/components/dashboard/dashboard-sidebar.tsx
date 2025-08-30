"use client";
import React from "react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import {
  CreditCardIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LibraryBigIcon,
  Mic,
  PaletteIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";
const customerSupoortItems = [
  {
    title: "Conversations",
    url: "/conversations",
    icon: InboxIcon,
  },
  {
    title: "Knowledge Base",
    url: "/files",
    icon: LibraryBigIcon,
  },
];
const configurationItems = [
    {
        title: "Widget Customization",
        url: '/customization',
        icon: PaletteIcon
    },
     {
        title: "Integrations",
        url: '/integrations',
        icon: LayoutDashboardIcon
    },
     {
        title: "Voice Assistant",
        url: '/plugins/vapi',
        icon: Mic
    }
]
const accountItems = [
    {
        title: 'Plans & Billing',
        url: '/billing',
        icon: CreditCardIcon

    }
]
function DashboardSidebar() {
  const pathName = usePathname();
  const isActive = (url: string) => {
    if (url === "/") {
      return pathName === "/";
    }
    return pathName.startsWith(url);
  };
  return (
    <Sidebar className="group" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <OrganizationSwitcher hidePersonal skipInvitationScreen appearance={{
                elements: {
                    rootBox: 'w-full! h-8!',
                    avatarBox: "size-4! rounded-sm!",
                    organizationSwitcherTrigger: 'w-full! justify-start!  group-data-[collapsible=icon]:size-8!  group-data-[collapsible=icon]:p-2!',
                    organizationPreview: " group-data-[collapsible=icon]:justify-center! gap-2!",
                    organizationPreviewTextContainer: 'group-data-[collapsible=icon]:hidden! text-xs! font-medium! text-sidebar-foreground!',
                    organizationSwitcherTriggerIcon: 'group-data-[collapsible=icon]:hidden! ml-auto! text-sidebar-foreground '
                }
              }} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* Customer support */}
          <SidebarGroupLabel>Customer Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {customerSupoortItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                     className={cn(
                        isActive(item.url) && 'bg-gradient-to-b from-sidebar-primary to-[#0b63f3]! text-sidebar-primary-foreground! hover:to-[#0b63f3]/90!'
                     )}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
         <SidebarGroup>
          {/* Customer support */}
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configurationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                     className={cn(
                        isActive(item.url) && 'bg-gradient-to-b from-sidebar-primary to-[#0b63f3]! text-sidebar-primary-foreground! hover:to-[#0b63f3]/90!'
                     )}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          {/* Customer support */}
          <SidebarGroupLabel>Accounts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                     className={cn(
                        isActive(item.url) && 'bg-gradient-to-b from-sidebar-primary to-[#0b63f3]! text-sidebar-primary-foreground! hover:to-[#0b63f3]/90!'
                     )}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
             <UserButton showName appearance={{
                elements: {
                    rootBox: 'w-full! h-8!',
                    userButtonTrigger: 'w-full! p-2! hover:bg-sidebar-accent! hover:text-sidebar-accent-foreground! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!',
                   userButtonBox: 'w-full! flex-row-reverse! justify-end! gap-2! group-data-[collapsible=icon]:justify-center! text-sidebar-foreground!',
                   userButtonOuterIdentifier: 'pl-0!  group-data-[collapsible=icon]:hidden!',
                   avatarBox: 'group-data-[collapsible=icon]:size-4!' 
                }
              }} />
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default DashboardSidebar;
