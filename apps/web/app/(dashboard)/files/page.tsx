import FilesView from "@/components/dashboard/files/files-view";
import React from "react";
import { Protect } from "@clerk/nextjs";
import PremiumFeatureOverly from "@/components/dashboard/premium-feature-overlay";
function page() {
  return (
    <Protect
      condition={(has) => has({ plan: "pro" })}
      fallback={
        <PremiumFeatureOverly>
          <FilesView />
        </PremiumFeatureOverly>
      }
    >
      <FilesView />
    </Protect>
  );
}

export default page;
