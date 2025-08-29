'use client'
import React from 'react'
import { useOrganization } from '@clerk/nextjs'
import CreateOrganization from './create-organizaiton'
type Props = {
    children: React.ReactNode
}

const OrganizationGuard = ({children}: Props) => {
    const {organization} = useOrganization()
    if(!organization){
        return (
            <CreateOrganization />
        )
    }
  return (
    <>{children}</>
  )
}

export default OrganizationGuard