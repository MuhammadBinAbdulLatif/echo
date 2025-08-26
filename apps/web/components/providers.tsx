"use client"

import * as React from "react"
import { ConvexProvider, ConvexReactClient } from "convex/react"  
import {ConvexProviderWithClerk} from 'convex/react-clerk'
import { useAuth } from "@clerk/nextjs"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || '')
export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <ConvexProvider client={convex}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>{children}</ConvexProviderWithClerk>
      </ConvexProvider>
  )
}
