"use client";

import { ChartAreaStacked } from "@/components/charts-and-graphs/ChartAreaStacked";
import { ChartBarMultiple } from "@/components/charts-and-graphs/ChartBarMultiple";
import { StatCards } from "./dashboardcomponent/stat-cards";
import { DashboardSkeleton } from "./dashboardcomponent/DashboardSkeleton";
import { useEffect, useState } from "react";
import axios from "../../axios";
import { ErrorToast } from "@/components/Toaster";
import { AxiosError } from "axios";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { QuickAction } from "./dashboardcomponent/QuickAction";

const Dashboard = () => {
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
    <div className="flex flex-col space-y-4">
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="flex items-center gap-3">
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

            <Select
              value={range}
              onValueChange={(v) => {
                setRange(v);
                setFromDate("");
                setToDate("");
              }}
            >
              <SelectTrigger className="w-[880px]">
                <SelectValue placeholder="Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <h1 className="mb-0 text-muted-foreground font-medium">Stats</h1>
          <StatCards statsData={statsData} />
          <h1 className="mb-0 text-muted-foreground font-medium">
            Quick Action
          </h1>
          <QuickAction statsData={statsData} />
          <h1 className="mb-0 text-muted-foreground font-medium">Charts</h1>
          <div className="grid grid-cols-2 space-x-4 ">
            <ChartAreaStacked statsData={statsData} />
            <ChartBarMultiple statsData={statsData} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
