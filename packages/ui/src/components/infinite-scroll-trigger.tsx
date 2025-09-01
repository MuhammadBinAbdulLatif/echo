import React from "react";
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"

type Props = {
  canLoadMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  loadMoreText?: string;
  noMoreText?: string;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
};

const InfiniteScrollTrigger = ({
  canLoadMore,
  isLoadingMore,
  onLoadMore,
  className,
  loadMoreText,
  noMoreText,
  ref,
}: Props) => {
  let text = loadMoreText;
  if (isLoadingMore) {
    text = "Loading...";
  } else if (!canLoadMore) {
    text = noMoreText;
  }

  return (
    <div className={cn("flex w-full justify-center py-2", className)} ref={ref}>
      <Button
        onClick={onLoadMore}
        disabled={isLoadingMore || !canLoadMore}
        size={"sm"}
        variant={"ghost"}
      >
        {text}
      </Button>
    </div>
  );
};

export default InfiniteScrollTrigger;
