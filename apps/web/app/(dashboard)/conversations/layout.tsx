import { ConversationLayout } from "@/components/dashboard/conversations/conversations-layout";

import React from 'react'

type Props = {
    children: React.ReactNode
}

const layout = ({children}: Props) => {
  return (
    <ConversationLayout>{children}</ConversationLayout>
  )
}

export default layout