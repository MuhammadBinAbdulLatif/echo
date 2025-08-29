import AuthGuard from '@/components/auth/auth-guard'
import OrganizationGuard from '@/components/auth/organization-guard'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const layout = ({children}: Props) => {
    
  return (
    <AuthGuard>
        <OrganizationGuard>
        {children}
        </OrganizationGuard>
    </AuthGuard>
  )
}

export default layout