import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

export const IntegrationDialog = ({
  onOpenChange,
  open,
  snippet,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  snippet: string;
}) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to add to clipboard");
    }
  };
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Integrate with your website</DialogTitle>
          <DialogDescription>
            Follow these steps to add teh chatbox to your website
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="rounded-md bg-accent p-2 text-sm">
              1. Copy the following code
            </div>
            <div className="group relative">
              <pre className="max-h-[300px] overflow-x-auto overflow-y-auto whitespace-pre-wrap break-all rounded-md bg-foreground p-2 font-mono text-secondary text-sm">
                {snippet}
              </pre>
              <Button
                className="absolute top-4 right-6 size-6 opacity-0 transition-opacity group-hover:opacity-10"
                size={"icon"}
                variant={"secondary"}
                onClick={handleCopy}
              >
                <CopyIcon className="size-3" />
              </Button>
            </div>
            <div className="space-y-2">
              <div className="rounded-md bg-accent p-2 text-sm">
                2. Add the code in your page
              </div>
              <p className="text-muted-foreground text-sm">
                Paste the chatbox code about in your page. You can add in the
                HTML head section{" "}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
