'use client'
import React from 'react'
// import WidgetFooter from './widget-footer'
// import WidgetHeader from './widget-header'
import WidgetOnboardScreen from './screens/widget-onboard-screen'
import { screenAtom } from '@/atoms/widget-atoms';
import { useAtomValue } from 'jotai';
import WidgetErrorScreen from './screens/widget-error-screen';
import WidgetLoadingScreen from './screens/widget-loading';
interface Props {
    organizationId: string
}
type ScreenKey =
  | 'error'
  | 'loading'
  | 'auth'
  | 'voice'
  | 'inbox'
  | 'selection'
  | 'chat'
  | 'contact';

function Widget({ organizationId }: Props) {
  const screen = useAtomValue(screenAtom) as ScreenKey;
  const screenComponents: Record<ScreenKey, React.ReactElement> = {
    loading: <WidgetLoadingScreen organizationId={organizationId} />,
    error: <WidgetErrorScreen />,
    auth: <WidgetOnboardScreen />,
    voice: <p>TODO: Voice</p>,
    inbox: <p>TODO: Inbox</p>,
    selection: <p>TODO: Selection</p>,
    chat: <p>TODO: Chat</p>,
    contact: <p>TODO: Contact</p>,
  };

  return (
    //TODO: Confirm wether or not min-h and min-w is needed
    <main className='flex h-full min-h-screen min-w-screen w-full flex-col overflow-hidden rounded-xl border bg-muted text-xl'>
       {screenComponents[screen]}
      {/* <WidgetFooter /> */}
    </main>
  )
}

export default Widget
