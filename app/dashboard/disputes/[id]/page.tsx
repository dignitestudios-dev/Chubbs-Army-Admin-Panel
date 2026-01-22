"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type Evidence = { id: number; type: string; note?: string };

export default function DisputeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [dispute] = useState(() => ({
    id,
    disputeType: "Event Refund",
    summary: "Requested refund after event cancelled",
    initiatedBy: "userA@example.com",
    parties: ["userA@example.com", "OrganizerX"],
    amount: 50.0,
    status: "Under Review",
    createdAt: "2026-01-08",
    assignedTo: "Mod A",
  }));

  const [evidence] = useState<Evidence[]>(() => [
    { id: 1, type: "Message thread", note: "Conversation showing request" },
  ]);

  const [adminNote, setAdminNote] = useState("");

  const requestInfo = () =>
    alert("Requesting more info from parties — implement API");
  const approveRefund = () => alert("Refund approved — implement API");
  const rejectClaim = () => alert("Claim rejected — implement API");
  const transferOwnership = () =>
    alert("Transfer ownership action — implement API");
  const escalateLegal = () => alert("Escalate to legal — implement workflow");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dispute #{dispute.id}</h1>
          <p className="text-sm text-muted-foreground">
            {dispute.disputeType} • {dispute.summary}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge>{dispute.status}</Badge>
          <Button onClick={() => router.push("/dashboard/disputes")}>
            Back
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <section className="rounded-md border p-4">
            <h3 className="font-semibold">Dispute Summary</h3>
            <div className="mt-2 text-sm">{dispute.summary}</div>
            <div className="mt-3">
              <h4 className="font-medium">What happened</h4>
              <p className="text-sm text-muted-foreground mt-1">
                User requested refund after event cancellation; seller disputes
                validity.
              </p>
            </div>

            <div className="mt-3">
              <h4 className="font-medium">Evidence</h4>
              <ul className="mt-2 list-disc pl-5 text-sm">
                {evidence.map((e) => (
                  <li key={e.id}>
                    {e.type} — {e.note}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3">
              <h4 className="font-medium">Messages</h4>
              <div className="mt-2 text-sm text-muted-foreground">
                Conversation and message history placeholder.
              </div>
            </div>

            <div className="mt-3">
              <h4 className="font-medium">Files</h4>
              <div className="mt-2 text-sm text-muted-foreground">
                Uploaded files placeholder.
              </div>
            </div>

            <div className="mt-3">
              <h4 className="font-medium">Transaction records</h4>
              <div className="mt-2 text-sm text-muted-foreground">
                Transaction details placeholder (amount: ${dispute.amount})
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" onClick={requestInfo}>
                Request More Info
              </Button>
              <Button variant="destructive" onClick={approveRefund}>
                Approve Refund
              </Button>
              <Button variant="ghost" onClick={rejectClaim}>
                Reject Claim
              </Button>
              <Button onClick={transferOwnership}>Transfer Ownership</Button>
              <Button variant="destructive" onClick={escalateLegal}>
                Escalate to Legal
              </Button>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-md border p-4">
            <h3 className="font-semibold">Parties Involved</h3>
            <div className="mt-2 text-sm">{dispute.parties.join(", ")}</div>
            <div className="mt-2 text-sm">
              Assigned: {dispute.assignedTo || "Unassigned"}
            </div>
            <div className="mt-2 text-sm">Created: {dispute.createdAt}</div>
          </section>

          <section className="rounded-md border p-4">
            <h3 className="font-semibold">Admin Actions / Notes</h3>
            <div className="mt-2">
              <Input
                placeholder="Add an internal note"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
              <div className="mt-2 flex gap-2">
                <Button
                  onClick={() => {
                    alert("Note saved - implement API");
                  }}
                >
                  Save Note
                </Button>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
