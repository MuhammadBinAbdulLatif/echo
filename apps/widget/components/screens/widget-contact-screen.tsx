import { Button } from "@workspace/ui/components/button";
import WidgetHeader from "../widget-header";
import { useAtomValue, useSetAtom } from "jotai";
import { screenAtom, widgetSettingsAtom } from "@/atoms/widget-atoms";
import { cn } from "@workspace/ui/lib/utils";
import { useState } from "react";
import { ArrowLeftIcon, CheckIcon, CopyIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";

export const WidgetContactScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const phoneNumber = widgetSettings?.vapiSettings.phoneNumber;
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    if (!phoneNumber) {
      return;
    }
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <>
      <WidgetHeader>
        <div className="flex items-center gap-x-2 text-xl">
          <Button
            variant={"transparent"}
            size={"icon"}
            onClick={() => setScreen("selection")}
          >
            <ArrowLeftIcon />
            <p>Inbox</p>
          </Button>
        </div>
      </WidgetHeader>
      <div className="flex h-full flex-col items-center justify-center gap-y-4">
        <div className="flex items-center justify-center rounded-full border bg-white p-3">
          <PhoneIcon className="size-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">Available 24 / 7</p>
        <p className="font-bold text-2xl ">{phoneNumber}</p>
      </div>
      <div className="border-t bg-background p-4">
        <div className="flex flex-col items-center gap-y-2">
          <Button
            className="w-full"
            onClick={handleCopy}
            size={"lg"}
            variant={"outline"}
          >
            {copied ? (
              <>
                <CheckIcon className="mr-2 size-4" />
              </>
            ) : (
              <>
                <CopyIcon className="mr-2 size-4" />
                Copy number
              </>
            )}
          </Button>
          <Button className="w-full" size={"lg"}>
            <Link
              href={`tel:${phoneNumber}`}
              className="flex gap-2 items-center justify-center"
            >
              <PhoneIcon />
              Call Now
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};
