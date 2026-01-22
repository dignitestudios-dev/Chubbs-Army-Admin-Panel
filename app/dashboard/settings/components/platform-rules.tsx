"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function PlatformRules() {
  const [guidelines, setGuidelines] = useState(
    `Be respectful. No harassment, spam, or illegal content.`
  );
  const [visibility, setVisibility] = useState<string>("moderated");
  const [reportThreshold, setReportThreshold] = useState<number>(3);

  const save = () => {
    // Replace with API call
    alert(
      "Platform rules saved\n\nGuidelines:\n" +
        guidelines +
        "\nVisibility: " +
        visibility +
        "\nReport threshold: " +
        reportThreshold
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border p-4">
        <h3 className="font-semibold">Community Guidelines</h3>
        <textarea
          className="w-full mt-2 p-2 border rounded resize-y"
          value={guidelines}
          rows={6}
          onChange={(e) => setGuidelines(e.target.value)}
        />
        <p className="text-sm text-muted-foreground mt-2">
          Tips: keep guidelines concise and example-driven.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-md border p-4">
          <h4 className="font-medium">Content Visibility Rules</h4>
          <p className="text-sm text-muted-foreground mt-2">
            Choose how newly posted content is treated.
          </p>
          <div className="mt-3">
            <Select value={visibility} onValueChange={(v) => setVisibility(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  Public (visible immediately)
                </SelectItem>
                <SelectItem value="moderated">
                  Moderated (requires approval)
                </SelectItem>
                <SelectItem value="private">
                  Private (hidden until approved)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border p-4">
          <h4 className="font-medium">Reporting Threshold</h4>
          <p className="text-sm text-muted-foreground mt-2">
            Number of reports before automated action is suggested.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Input
              type="number"
              value={reportThreshold}
              onChange={(e) => setReportThreshold(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-sm">reports</span>
          </div>
        </div>

        <div className="rounded-md border p-4">
          <h4 className="font-medium">Preview / Notes</h4>
          <p className="text-sm text-muted-foreground mt-2">
            Preview how rules will apply in the moderation queue and content
            streams.
          </p>
        </div>
      </div>

      <div>
        <Button onClick={save}>Save Platform Rules</Button>
      </div>
    </div>
  );
}
