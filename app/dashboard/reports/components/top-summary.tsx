"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  CreditCard,
  UserCheck,
  Dog,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  User,
  ListOrdered,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import axios from "@/axios";
import { AxiosError } from "axios";
import { ErrorToast } from "@/components/Toaster";

const TopSummary = ({ statsData }) => {
  const performanceMetrics: StatMetric[] = useMemo(() => {
    if (!statsData) return [];
    return [
      {
        title: "Total Users",
        current: `${statsData.users.total}`,
        icon: UserCheck,
      },
      {
        title: "Total Pets",
        current: statsData?.ecosystem?.totalPets,
        icon: Dog,
      },
      {
        title: "Total Content",
        current: statsData.content.totalPosts + statsData.content.totalVideos,
        icon: CreditCard,
      },
      {
        title: "Total Vendors",
        current: statsData?.users?.roles?.SERVICE_PROVIDER,
        icon: User,
      },
      {
        title: "Events Organizers",
        current: statsData?.users?.roles?.EVENT_ORGANIZER,
        icon: User,
      },
      {
        title: "Total Orders",
        current: statsData?.marketplace?.totalOrders,
        icon: ListOrdered,
      },
      {
        title: "Total Events",
        current: statsData?.events?.total,
        icon: Calendar,
      },
      {
        title: "Total Revenue",
        current: statsData?.marketplace?.revenue?.toFixed(2),
        icon: DollarSign,
      },
    ];
  }, [statsData]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {performanceMetrics.map((metric, index) => (
        <Card key={index} className="border">
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <metric.icon className="text-muted-foreground size-6" />
              {metric?.growth && (
                <Badge
                  variant="outline"
                  className={cn(
                    metric.growth >= 0
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700",
                  )}
                >
                  {metric.growth >= 0 ? (
                    <>
                      <TrendingUp className="me-1 size-3" />
                      {metric.growth >= 0 ? "+" : ""}
                      {metric.growth}%
                    </>
                  ) : (
                    <>
                      <TrendingDown className="me-1 size-3" />
                      {metric.growth}%
                    </>
                  )}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium">
                {metric.title}
              </p>
              <div className="text-2xl font-bold">{metric.current}</div>
              {metric?.previous && (
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <span>from {metric.previous}</span>
                  <ArrowUpRight className="size-3" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TopSummary;
