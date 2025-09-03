import React from 'react'

type Props = {
    params: Promise<{conversationId:string}>
}

const page = async ({params}: Props) => {
    const {conversationId} = await params
  return (
    <div>Conversation Id : {conversationId}</div>
  )
}

export default page