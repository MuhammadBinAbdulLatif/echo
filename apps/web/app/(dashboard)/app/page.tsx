'use client'
import React from 'react'
import {useQuery} from 'convex/react'
import { Button } from "@workspace/ui/components/button"
import {api} from "@workspace/backend/convex/_generated/api"
function page() {
  const users = useQuery(api.users.getManyUsers)
  return (
    <div>
        <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <div className='flex flex-col gap-y-4 text-center max-w-sm'>{JSON.stringify(users, null, 2)}</div>
        <Button size="sm">Button</Button>
      </div>
    </div>
    </div>
  )
}

export default page
