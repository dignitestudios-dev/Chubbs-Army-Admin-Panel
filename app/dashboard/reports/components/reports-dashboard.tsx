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

export default function ReportsDashboard() {
  const [activeTab, setActiveTab] = useState<string>("user");

  const contentAnalytics: ContentAnalytics = {
    totalPosts: 1240,
    totalVideos: 385,
    contentDistribution: {
      photos: 855,
      videos: 385,
    },
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

    if (activeTab === "user") {
      fetchStats();
    }
  }, [fromDate, toDate, range, activeTab]);

  const clearFilter = () => {
    setFromDate("");
    setToDate("");
    setRange("");
  };

  return (
    <div className="space-y-6 ">
      {/* Top Summary Cards */}
      {/* Date Range and Export Controls */}
      {activeTab === "user" && (
        <div className="grid grid-cols-5 items-center gap-2 ">
          <Input
            type="date"
            value={fromDate}
            max={today}
            onChange={(e) => {
              const value = e.target.value;
              setFromDate(value);

              // reset toDate if it becomes invalid
              if (toDate && value && toDate < value) {
                setToDate("");
              }

              if (value) setRange("");
            }}
          />

          <Input
            type="date"
            min={fromDate || undefined}
            max={today}
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              if (e.target.value) setRange("");
            }}
          />
          <Button variant="outline" onClick={clearFilter}>
            Clear Filter
          </Button>
        </div>
      )}

      <div>
        <TopSummary statsData={statsData} />
      </div>

      {/* <Select>
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
        </Button> */}

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
          <MarketplaceAnalytics />
        </TabsContent>

        {/* Event Analytics Tab */}
        <TabsContent value="event" className="space-y-4">
          <EventAnalytics />
        </TabsContent>

        {/* Reporting Analytics Tab */}
        <TabsContent value="reporting" className="space-y-4">
          <ReportingAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
