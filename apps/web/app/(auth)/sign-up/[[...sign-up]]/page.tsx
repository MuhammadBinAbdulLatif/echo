import { SignUp } from '@clerk/nextjs'
import React from 'react'

function page() {
  return (
        <SignUp routing='hash' />
  )
}

export default page
