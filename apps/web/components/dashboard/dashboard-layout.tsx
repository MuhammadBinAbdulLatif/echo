
import React from 'react'
import OrganizationGuard from '../auth/organization-guard'
import {SidebarProvider} from '@workspace/ui/components/sidebar'
import DashboardSidebar from './dashboard-sidebar'
import { Provider } from 'jotai'
type Props = {
    children: React.ReactNode
}

const DashboardLayout = async ({children}: Props) => {
  return (
      <OrganizationGuard>
        <Provider>
        <SidebarProvider>
          <DashboardSidebar />
      <main className='flex flex-1 flex-col'>
          {children}
      </main>
      
      </SidebarProvider>
      </Provider>
      </OrganizationGuard>
  )
}

export default DashboardLayout