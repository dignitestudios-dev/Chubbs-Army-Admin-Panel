import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "@/axios";
import { AxiosError } from "axios";
import { ErrorToast } from "@/components/Toaster";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EventAnalytics = ({ eventAnalytics }) => {
  const [loading, setLoading] = useState(false);
  const [statsData, setStatsData] = useState(null);

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [range, setRange] = useState<string>("");
  const [organizerSearch, setOrganizerSearch] = useState<string>("");

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

        const response = await axios.get("/admin/analytics/events", { params });

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
    <Card>
      <CardHeader>
        <CardTitle>Event Analytics Overview</CardTitle>
        <CardDescription>
          Monitor event performance and attendance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2 sm:grid-cols-4 sm:gap-4">
          {/* <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="search" className="text-sm font-medium">
              Search
            </Label>
            <input
              id="search"
              type="text"
              placeholder="Search by organizer"
              // onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md 
                 focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div> */}
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
          {/* <div className="space-y-2">
            <Label htmlFor="role-filter" className="text-sm font-medium">
              Vendor Status
            </Label>
            <Select onValueChange={(value) => setOrganizerSearch(value)}>
              <SelectTrigger className="cursor-pointer w-full" id="role-filter">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="InActive">InActive</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-lg">Total Events</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Upcoming */}
            <div className="p-4 rounded-lg border bg-gradient-to-br from-sky-50 to-blue-50">
              <div className="text-sm text-gray-600">Upcoming</div>
              <div className="text-3xl font-bold text-sky-600">
                {statsData?.events?.upcoming}
              </div>
            </div>

            {/* Past */}
            <div className="p-4 rounded-lg border bg-gradient-to-br from-slate-50 to-gray-50">
              <div className="text-sm text-gray-600">Past</div>
              <div className="text-3xl font-bold text-slate-600">
                {statsData?.events?.past}
              </div>
            </div>

            {/* Total (Highlighted) */}
            <div className="p-4 rounded-lg border bg-gradient-to-br from-violet-50 to-indigo-50">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-3xl font-bold text-indigo-600">
                {statsData?.events?.total}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-lg">RSVP vs Attendance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border">
              <div className="text-sm text-gray-600">Total RSVPs</div>
              <div className="text-2xl font-bold text-indigo-600">
                {statsData?.engagement?.rsvps}
              </div>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="text-sm text-gray-600">Actual Attendees</div>
              <div className="text-2xl font-bold text-purple-600">
                {statsData?.engagement?.attendees}
              </div>
            </div>
          </div>
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-700">
              Attendance Rate:{" "}
              <span className="font-semibold text-blue-600">
                {statsData?.engagement?.attendanceRate}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-lg">Event Revenue</h4>
          <div className="p-6 rounded-lg border bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="text-sm text-gray-600 mb-1">Total Ticket Sales</div>
            <div className="text-4xl font-bold text-green-600">
              ${statsData?.revenue?.ticketSales.toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventAnalytics;
