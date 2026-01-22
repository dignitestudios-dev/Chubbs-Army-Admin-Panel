"use client";

import React, { useState } from "react";
import SubscriptionTable from "./components/subscription-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState(() => [
    {
      id: 1,
      user: "Alice",
      plan: "Pro",
      startDate: "2025-05-01",
      status: "active" as const,
    },
    {
      id: 2,
      user: "Bob",
      plan: "Basic",
      startDate: "2024-11-12",
      status: "past_due" as const,
    },
  ]);

  const [plans, setPlans] = useState(() => [
    {
      id: 1,
      name: "Basic",
      price: 0,
      interval: "monthly" as const,
      active: true,
    },
    {
      id: 2,
      name: "Pro",
      price: 9.99,
      interval: "monthly" as const,
      active: true,
    },
    {
      id: 3,
      name: "Enterprise",
      price: 99.0,
      interval: "monthly" as const,
      active: false,
    },
  ]);

  const cancelSubscription = (id: number) =>
    setSubscriptions((s) =>
      s.map((x) => (x.id === id ? { ...x, status: "cancelled" } : x))
    );
  const upgradeSubscription = (id: number, planId: number) =>
    alert(`Upgrade ${id} to plan ${planId} — implement flow`);

  const addPlan = (plan: any) => setPlans((s) => [...s, plan]);
  const editPlan = (planId: number) =>
    alert(`Edit plan ${planId} — open editor`);
  const togglePlan = (planId: number) =>
    setPlans((s) =>
      s.map((p) => (p.id === planId ? { ...p, active: !p.active } : p))
    );

  const [selected, setSelected] = useState<"active" | "plans" | "manage">(
    "active"
  );

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold">Subscription Management</h1>
        <div className="flex items-center gap-4">
          <Badge>Admin</Badge>
          <Button
            onClick={() =>
              alert("Export subscriptions CSV - implement backend")
            }
          >
            Export
          </Button>
        </div>
      </div>

      <div>
        <Tabs value={selected} onValueChange={(v) => setSelected(v as any)}>
          <TabsList>
            <TabsTrigger value="active">Active Subscriptions</TabsTrigger>
            <TabsTrigger value="plans">Manage Plans</TabsTrigger>
            <TabsTrigger value="manage">Cancellations & Upgrades</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <section className="space-y-3">
        {selected === "active" && (
          <>
            <h2 className="text-lg font-semibold">
              Active Premium Subscriptions
            </h2>
            <SubscriptionTable
              section="active"
              subscriptions={subscriptions}
              onCancel={cancelSubscription}
              onUpgrade={upgradeSubscription}
            />
          </>
        )}

        {selected === "plans" && (
          <>
            <h2 className="text-lg font-semibold">Manage Subscription Plans</h2>
            <SubscriptionTable
              section="plans"
              plans={plans}
              onAddPlan={addPlan}
              onEditPlan={editPlan}
              onTogglePlan={togglePlan}
            />
          </>
        )}

        {selected === "manage" && (
          <>
            <h2 className="text-lg font-semibold">
              Handle Cancellations & Upgrades
            </h2>
            <SubscriptionTable
              section="manage"
              subscriptions={subscriptions}
              onCancel={cancelSubscription}
              onUpgrade={upgradeSubscription}
            />
          </>
        )}
      </section>
    </div>
  );
}
