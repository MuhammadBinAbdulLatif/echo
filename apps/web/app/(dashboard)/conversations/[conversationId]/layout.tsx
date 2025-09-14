import React from "react";
import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import ContactPanel from "@/components/dashboard/conversations/contact-panel";
type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <ResizablePanelGroup className="h-full flex-1" direction="horizontal">
      <ResizablePanel className="h-full" defaultSize={60}>
        <div className="flex h-full flex-1 flex-col">{children}</div>
      </ResizablePanel>
      <ResizableHandle className="hidden lg:block" />
      <ResizablePanel
        defaultSize={40}
        maxSize={40}
        minSize={20}
        className="hidden lg:block"
      >
        <ContactPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default layout;
