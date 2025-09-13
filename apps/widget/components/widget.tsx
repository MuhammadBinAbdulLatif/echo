"use client";
import React from "react";
// import WidgetFooter from './widget-footer'
// import WidgetHeader from './widget-header'
import WidgetOnboardScreen from "./screens/widget-onboard-screen";
import { screenAtom } from "@/atoms/widget-atoms";
import { useAtomValue } from "jotai";
import WidgetErrorScreen from "./screens/widget-error-screen";
import WidgetLoadingScreen from "./screens/widget-loading";
import WidgetSelectionScreen from "./screens/widget-selection-screen";
import WidgetChatScreen from "./screens/widget-chat-screen";
import WidgetInboxScreen from "./screens/widget-inbox-screen";
import { WidgetVoiceScreen } from "./screens/widget-voice-screen";
import { WidgetContactScreen } from "./screens/widget-contact-screen";
interface Props {
  organizationId: string;
}
type ScreenKey =
  | "error"
  | "loading"
  | "auth"
  | "voice"
  | "inbox"
  | "selection"
  | "chat"
  | "contact";

function Widget({ organizationId }: Props) {
  const screen = useAtomValue(screenAtom) as ScreenKey;
  const screenComponents: Record<ScreenKey, React.ReactElement> = {
    loading: <WidgetLoadingScreen organizationId={organizationId} />,
    error: <WidgetErrorScreen />,
    auth: <WidgetOnboardScreen />,
    voice: <WidgetVoiceScreen />,
    inbox: <WidgetInboxScreen />,
    selection: <WidgetSelectionScreen />,
    chat: <WidgetChatScreen />,
    contact: <WidgetContactScreen />,
  };

  return (
    <main className="flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted text-xl">
      {screenComponents[screen]}
      {/* <WidgetFooter /> */}
    </main>
  );
}

export default Widget;
