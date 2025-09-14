import CustomizationView from "@/components/dashboard/customization/customization-view";
import PremiumFeatureOverly from "@/components/dashboard/premium-feature-overlay";
import { Protect } from "@clerk/nextjs";
import React from "react";

function page() {
  return (
    <Protect
      condition={(has) => has({ plan: "pro" })}
      fallback={
        <PremiumFeatureOverly>
          <CustomizationView />
        </PremiumFeatureOverly>
      }
    >
      <CustomizationView />;
    </Protect>
  );
}

export default page;
