'use client'
import Widget from "@/components/widget"
import { Button } from "@workspace/ui/components/button"
import { use } from "react"
interface Props {
  searchParams: Promise<{organizationId: string}>
}
export default function Page({ searchParams }: Props) {
  const { organizationId } = use(searchParams)
  return (
   <Widget organizationId={organizationId} />
  )
}
