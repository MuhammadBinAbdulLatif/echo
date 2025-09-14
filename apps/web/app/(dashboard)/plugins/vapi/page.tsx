import { VapiView } from "@/components/dashboard/plugins/vapi/vapi-view";
import PremiumFeatureOverly from "@/components/dashboard/premium-feature-overlay";
import { Protect } from "@clerk/nextjs";
import React from "react";

function page() {
  return (
    <Protect
      condition={(has) => has({ plan: "pro" })}
      fallback={
        <PremiumFeatureOverly>
          <VapiView />
        </PremiumFeatureOverly>
      }
    >
      <VapiView />
    </Protect>
  );
}

export default page;
