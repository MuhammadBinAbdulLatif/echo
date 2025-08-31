'use client'
import React from 'react'
// import WidgetFooter from './widget-footer'
// import WidgetHeader from './widget-header'
import WidgetOnboardScreen from './screens/widget-onboard-screen'
interface Props {
    organizationId: string
}
function Widget({ organizationId }: Props) {
  return (
    //TODO: Confirm wether or not min-h and min-w is needed
    <main className='flex h-full min-h-screen min-w-screen w-full flex-col overflow-hidden rounded-xl border bg-muted text-xl'>
       <WidgetOnboardScreen />
      {/* <WidgetFooter /> */}
    </main>
  )
}

export default Widget
