'use server'
import React from 'react'
import { auth } from '@clerk/nextjs/server';
import CreateOrganization from './create-organizaiton'
type Props = {
    children: React.ReactNode
}

const OrganizationGuard = async ({children}: Props) => {
    const {orgId} = await auth()
    if(!orgId){
        return (
            <CreateOrganization />
        )
    }
  return (
    <>{children}</>
  )
}

export default OrganizationGuard