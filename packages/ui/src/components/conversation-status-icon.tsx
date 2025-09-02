import {  ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
interface ConversationStatusProps {
    status: 'unresolved' | 'escalated' | 'resolved',
    className?: string
}


const statusConfig = {
    resolved: {
        icon: CheckIcon,
        bgColor: 'bg-[#3Fb62f]'
    },
    unresolved: {
        icon: ArrowRightIcon,
        bgColor: 'bg-destructive'
    },
    escalated: {
        icon: ArrowUpIcon,
        bgColor: 'bg-yellow-500'
    }
} as const



function ConversationStatusIcon({status,className}:ConversationStatusProps) {
    const config = statusConfig[status]
  return (
    <div className={cn('flex items-center justify-center rounded-full size-5', config.bgColor, className)}>
      <config.icon className="size-3 stroke-3 text-white" />
    </div>
  )
}

export default ConversationStatusIcon
