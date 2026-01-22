"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

type Feature = { id: string; name: string; enabled: boolean; rollout: number };

export default function FeatureToggles() {
  const [features, setFeatures] = useState<Feature[]>([
    { id: "new_feed", name: "New Feed Layout", enabled: false, rollout: 0 },
    { id: "reactions", name: "Reactions (emoji)", enabled: true, rollout: 100 },
    {
      id: "seller_analytics",
      name: "Seller Analytics",
      enabled: false,
      rollout: 0,
    },
  ]);

  const toggle = (id: string) =>
    setFeatures((s) =>
      s.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  const setRollout = (id: string, value: number) =>
    setFeatures((s) =>
      s.map((f) => (f.id === id ? { ...f, rollout: value } : f))
    );

  const save = () => {
    // Replace with API call
    alert("Feature toggles saved: " + JSON.stringify(features, null, 2));
  };

  return (
    <div className="space-y-4">
      {/* {features.map((f) => (
        <div
          key={f.id}
          className="rounded-md border p-4 flex items-center justify-between"
        >
          <div>
            <div className="font-medium">{f.name}</div>
            <div className="text-sm text-muted-foreground">
              Rollout: {f.rollout}%
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Input
                type="range"
                min={0}
                max={100}
                value={f.rollout}
                onChange={(e) => setRollout(f.id, Number(e.target.value))}
                className="w-48"
              />
            </div>
            <Switch checked={f.enabled} onCheckedChange={() => toggle(f.id)} />
          </div>
        </div>
      ))} */}

      <div>
        <Button onClick={save}>Save Feature Toggles</Button>
      </div>
    </div>
  );
}
