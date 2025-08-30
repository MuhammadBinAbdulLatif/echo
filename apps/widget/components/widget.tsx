'use client'
import React from 'react'
import WidgetFooter from './widget-footer'
import WidgetHeader from './widget-header'
interface Props {
    organizationId: string
}
function Widget({ organizationId }: Props) {
  return (
    //TODO: Confirm wether or not min-h and min-w is needed
    <main className='flex h-full min-h-screen min-w-screen w-full flex-col overflow-hidden rounded-xl border bg-muted text-xl'>
        <WidgetHeader>
            <div className='flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold'>
                <p className='text-3xl'>
                    Hi there 🤚
                </p>
                <p className='text-lg'>
                    How can we help you today?
                </p>
            </div>
        </WidgetHeader>
       <div className='flex flex-1 '>
         Widget View {organizationId}
       </div>
      <WidgetFooter />
    </main>
  )
}

export default Widget
