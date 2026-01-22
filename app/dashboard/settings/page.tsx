"use client";

import React from "react";
import PlatformRules from "./components/platform-rules";
import FeatureToggles from "./components/feature-toggles";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold">
          System Settings & Configuration
        </h1>
        <div className="flex items-center gap-4">
          <Badge>System</Badge>
        </div>
      </div>

      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Platform Rules</h2>
          <p className="text-sm text-muted-foreground">
            Manage community guidelines, content visibility and reporting
            thresholds.
          </p>
          <div className="mt-4">
            <PlatformRules />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Feature Toggles</h2>
          <p className="text-sm text-muted-foreground">
            Enable or disable features and control rollout percentages for
            phased rollouts.
          </p>
          <div className="mt-4">
            <FeatureToggles />
          </div>
        </div>
      </section>
    </div>
  );
}
