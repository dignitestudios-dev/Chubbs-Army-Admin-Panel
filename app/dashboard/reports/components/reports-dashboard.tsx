"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TopSummary from "./top-summary";
import axios from "@/axios";
import { AxiosError } from "axios";
import { ErrorToast } from "@/components/Toaster";
import UserAnalytics from "./user-analytics";
import ContentAnalytics from "./content-analytics";
import MarketplaceAnalytics from "./marketplace-analytics";
import EventAnalytics from "./event-analytics";
import ReportingAnalytics from "./reporting-analytics";

// Types
type GrowthData = {
  date: string;
  users: number;
};

type Revenue = {
  marketplace: number;
  subscriptions: number;
  ads: number;
};

type UserAnalytics = {
  totalUsers: number;
  growthTrends: GrowthData[];
};

type ContentAnalytics = {
  totalPosts: number;
  totalVideos: number;
  contentDistribution: {
    photos: number;
    videos: number;
  };
};

type MarketplaceAnalytics = {
  totalVendors: number;
  totalProducts: number;
  orders: {
    pending: number;
    completed: number;
    cancelled: number;
  };
  revenue: {
    byProduct: number;
    byService: number;
    marketplace: number;
    subscriptions: number;
  };
  vendorRatings: {
    vendorName: string;
    rating: number;
  }[];
};

type EventAnalytics = {
  totalEvents: {
    upcoming: number;
    past: number;
  };
  rsvpVsAttendance: {
    rsvps: number;
    attendees: number;
  };
  eventRevenue: number;
};

type ReportingAnalytics = {
  reportedUsers: number;
  reportedContent: number;
  blockedUsers: number;
};

// Mock data
const growth: GrowthData[] = [
  { date: "2026-01-01", users: 120 },
  { date: "2026-01-02", users: 150 },
  { date: "2026-01-03", users: 170 },
  { date: "2026-01-15", users: 220 },
  { date: "2026-01-30", users: 285 },
];

function toCSV(rows: any[], columns: string[]) {
  const header = columns.join(",");
  const lines = rows.map((r) =>
    columns.map((c) => JSON.stringify(r[c] ?? "")).join(","),
  );
  return [header, ...lines].join("\n");
}

export default function ReportsDashboard() {
  const [activeTab, setActiveTab] = useState<string>("user");

  const revenue: Revenue = {
    marketplace: 12450.5,
    subscriptions: 3490.0,
    ads: 870.0,
  };

  const userAnalytics: UserAnalytics = {
    totalUsers: 285,
    growthTrends: growth,
  };

  const contentAnalytics: ContentAnalytics = {
    totalPosts: 1240,
    totalVideos: 385,
    contentDistribution: {
      photos: 855,
      videos: 385,
    },
  };

  const marketplaceAnalytics: MarketplaceAnalytics = {
    totalVendors: 45,
    totalProducts: 320,
    orders: {
      pending: 28,
      completed: 412,
      cancelled: 15,
    },
    revenue: {
      byProduct: 8200.5,
      byService: 4250.0,
      marketplace: 12450.5,
      subscriptions: 3490.0,
    },
    vendorRatings: [
      { vendorName: "Pet Paradise", rating: 4.8 },
      { vendorName: "Doggy Delights", rating: 4.6 },
      { vendorName: "Feline Friends", rating: 4.9 },
    ],
  };

  const eventAnalytics: EventAnalytics = {
    totalEvents: {
      upcoming: 12,
      past: 35,
    },
    rsvpVsAttendance: {
      rsvps: 450,
      attendees: 387,
    },
    eventRevenue: 5680.0,
  };

  const reportingAnalytics: ReportingAnalytics = {
    reportedUsers: 23,
    reportedContent: 67,
    blockedUsers: 8,
  };

  const exportCSV = (
    rows: any[],
    columns: string[],
    filename = "report.csv",
  ) => {
    const csv = toCSV(rows, columns);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // FOR top stats data fetching

  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [range, setRange] = useState<string>("");

  const toISOStart = (date: string) =>
    new Date(`${date}T00:00:00.000Z`).toISOString();

  const toISOEnd = (date: string) =>
    new Date(`${date}T23:59:59.999Z`).toISOString();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        let params = {};
        if (fromDate && toDate) {
          params = {
            fromDate: toISOStart(fromDate),
            toDate: toISOEnd(toDate),
          };
        } else if (range) {
          params = { range };
        }

        const response = await axios.get("/admin/metrics", { params });

        if (response.status === 200) {
          setStatsData(response.data.data);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        ErrorToast(err.response?.data?.message ?? "Failed to fetch stats data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [fromDate, toDate, range]);

  return (
    <div className="space-y-6 p-6">
      {/* Top Summary Cards */}
      <div>
        <TopSummary statsData={statsData} />
      </div>

      {/* Date Range and Export Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <Input type="date" className="w-auto" />
        <Input type="date" className="w-auto" />
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Preset" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last7">Last 7 days</SelectItem>
            <SelectItem value="last30">Last 30 days</SelectItem>
            <SelectItem value="thisMonth">This month</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => exportCSV(growth, ["date", "users"], "growth.csv")}
        >
          Export CSV
        </Button>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="user">User Analytics</TabsTrigger>
          <TabsTrigger value="content">Content Analytics</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace Analytics</TabsTrigger>
          <TabsTrigger value="event">Event Analytics</TabsTrigger>
          <TabsTrigger value="reporting">Reporting Analytics</TabsTrigger>
        </TabsList>

        {/* User Analytics Tab */}
        <TabsContent value="user" className="space-y-4">
          <UserAnalytics statsData={statsData} />
        </TabsContent>

        {/* Content Analytics Tab */}
        <TabsContent value="content" className="space-y-4">
          <ContentAnalytics contentAnalytics={contentAnalytics} />
        </TabsContent>

        {/* Marketplace Analytics Tab */}
        <TabsContent value="marketplace" className="space-y-4">
          <MarketplaceAnalytics marketplaceAnalytics={marketplaceAnalytics} />
        </TabsContent>

        {/* Event Analytics Tab */}
        <TabsContent value="event" className="space-y-4">
          <EventAnalytics eventAnalytics={eventAnalytics} />
        </TabsContent>

        {/* Reporting Analytics Tab */}
        <TabsContent value="reporting" className="space-y-4">
          <ReportingAnalytics reportingAnalytics={reportingAnalytics} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
