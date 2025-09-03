import ConversatinIdView from '@/components/dashboard/conversations/conversation-id-view'
import { Id } from '@workspace/backend/convex/_generated/dataModel'
import React from 'react'

type Props = {
    params: Promise<{conversationId:string}>
}

const page = async ({params}: Props) => {
  
    const {conversationId} = await params
  return (
    <div><ConversatinIdView conversationId={conversationId as Id<'conversations'>} /></div>
  )
}

export default page