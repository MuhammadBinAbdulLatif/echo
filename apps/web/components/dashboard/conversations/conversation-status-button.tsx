'use client'
import { Doc } from '@workspace/backend/convex/_generated/dataModel'
import React from 'react'
import Hint from './hint'
import { Button } from '@workspace/ui/components/button'
import { ArrowRight, ArrowUpIcon, CheckIcon } from 'lucide-react'

type Props = {
    status: Doc<'conversations'> ['status'],
    onClick: ()=> void,
    disabled: boolean
}

const ConversationStatusButton = ({onClick,status, disabled}: Props) => {
    console.log(status)
    if(status === 'resolved'){
        return (
            <Hint text='Mark as unresolved'>
                <Button onClick={onClick} disabled={disabled} size={'sm'} variant={'tertiary'}>
                    <CheckIcon />
                    Resolved
                </Button>
            </Hint>
        )
    }
     else if(status === 'escalated'){
        console.log('entered this')
        return (
            <Hint text='Mark as resolved' >
                <Button onClick={onClick} size={'sm'} disabled={disabled}  variant={'warning'}>
                    <ArrowUpIcon />
                    Escalated
                </Button>
            </Hint>
        )
    }

     return (
        <Hint text='Mark as escalated'>
                <Button onClick={onClick} size={'sm'} disabled={disabled} variant={'destructive'}>
                    <ArrowRight />
                    Unresolved
                </Button>
            </Hint>
     )

}

export default ConversationStatusButton