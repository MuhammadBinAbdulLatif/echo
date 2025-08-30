
import React from 'react'
import OrganizationGuard from '../auth/organization-guard'
import {SidebarProvider} from '@workspace/ui/components/sidebar'
import DashboardSidebar from './dashboard-sidebar'
type Props = {
    children: React.ReactNode
}

const DashboardLayout = async ({children}: Props) => {
  return (
      <OrganizationGuard>
        <SidebarProvider>
          <DashboardSidebar />
      <main className='flex flex-1 flex-col'>
          {children}
      </main>
      </SidebarProvider>
      </OrganizationGuard>
  )
}

export default DashboardLayout