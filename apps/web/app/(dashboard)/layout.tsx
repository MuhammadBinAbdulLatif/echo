import AuthGuard from "@/components/auth/auth-guard";
import OrganizationGuard from "@/components/auth/organization-guard";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default layout;
