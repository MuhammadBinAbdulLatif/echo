import { SignIn } from '@clerk/nextjs'
import React from 'react'

function page() {
  return (
    <SignIn routing='hash' />
  )
}

export default page
