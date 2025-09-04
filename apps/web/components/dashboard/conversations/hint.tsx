import React from 'react'
import { Tooltip, TooltipContent,TooltipProvider,TooltipTrigger } from '@workspace/ui/components/tooltip'
type Props = {
    children: React.ReactNode;
    text: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start'| 'center' | 'end'
}

const Hint = ({children,text,align='center',side='top'}: Props) => {
  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent>
                <p>{text}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}

export default Hint