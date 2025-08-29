import React from 'react'
import { OrganizationList } from '@clerk/nextjs'
function OrgSelectView() {
  return (
    <OrganizationList
    afterCreateOrganizationUrl={'/app'}
    afterSelectOrganizationUrl={'/app'}
    hidePersonal
    skipInvitationScreen />
  )
}

export default OrgSelectView
