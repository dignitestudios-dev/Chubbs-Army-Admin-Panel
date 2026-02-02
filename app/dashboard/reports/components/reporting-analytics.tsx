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
import { Button } from "@/components/ui/button";

const exportReportingAnalyticsCSV = (data: any) => {
  if (!data) return;

  const rows: string[][] = [];

  // Header
  rows.push(["Reporting Analytics Report"]);
  rows.push(["Generated on", new Date().toLocaleDateString()]);
  rows.push([]); // Empty row

  // Totals Section
  rows.push(["REPORTING TOTALS"]);
  rows.push(["Reported Pets", data?.totals?.reportedPets?.toString() || "0"]);
  rows.push([
    "Reported Content",
    data?.totals?.reportedContent?.toString() || "0",
  ]);
  rows.push(["Blocked Users", data?.totals?.blockedUsers?.toString() || "0"]);

  // Calculate block rate
  const blockRate = data?.totals?.reportedPets
    ? ((data.totals.blockedUsers / data.totals.reportedPets) * 100).toFixed(1)
    : "0.0";
  rows.push(["Block Rate", `${blockRate}%`]);
  rows.push([]); // Empty row

  // Breakdown Section
  rows.push(["REPORT BREAKDOWN BY TYPE"]);
  rows.push(["Report Type", "Count"]);
  rows.push(["Pet Reports", data?.breakdown?.petReports?.toString() || "0"]);
  rows.push(["Post Reports", data?.breakdown?.postReports?.toString() || "0"]);
  rows.push([
    "Post Comment Reports",
    data?.breakdown?.postCommentReports?.toString() || "0",
  ]);
  rows.push([
    "Event Reports",
    data?.breakdown?.eventReports?.toString() || "0",
  ]);
  rows.push([
    "Event Post Reports",
    data?.breakdown?.eventPostReports?.toString() || "0",
  ]);
  rows.push([
    "Event Post Comment Reports",
    data?.breakdown?.eventPostCommentReports?.toString() || "0",
  ]);
  rows.push([
    "Chat Room Reports",
    data?.breakdown?.chatRoomReports?.toString() || "0",
  ]);

  // Create CSV content
  const csvContent = rows
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `reporting-analytics-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

interface ReportingAnalyticsResponse {
  totals: {
    reportedPets: number;
    reportedContent: number;
    blockedUsers: number;
  };
  breakdown: {
    petReports: number;
    postReports: number;
    postCommentReports: number;
    eventReports: number;
    eventPostReports: number;
    eventPostCommentReports: number;
    chatRoomReports: number;
  };
}
type ReportType =
  | "PET"
  | "POST"
  | "POST_COMMENT"
  | "EVENT"
  | "EVENT_POST"
  | "EVENT_POST_COMMENT"
  | "CHAT_ROOM";

const ReportingAnalytics = () => {
  const [statsData, setStatsData] = useState<ReportingAnalyticsResponse | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [range, setRange] = useState<string>("");
  const [reportingStatus, setreportingStatus] = useState<string>("");
  const [reportingType, setReportingType] = useState<ReportType | "all">("all");

  const toISOStart = (date: string) =>
    new Date(`${date}T00:00:00.000Z`).toISOString();

  const toISOEnd = (date: string) =>
    new Date(`${date}T23:59:59.999Z`).toISOString();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        let params: any = {};

        if (fromDate && toDate) {
          params.fromDate = toISOStart(fromDate);
          params.toDate = toISOEnd(toDate);
        } else if (range) {
          params.range = range;
        }
        if (reportingStatus && reportingStatus !== "all") {
          params.status = reportingStatus;
        }
        if (reportingType && reportingType !== "all") {
          params.type = reportingType;
        }

        const response = await axios.get("/admin/analytics/reports", {
          params,
        });

        if (response.status === 200) {
          setStatsData(response.data.data);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        ErrorToast(
          err.response?.data?.message ?? "Failed to fetch reporting analytics",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [fromDate, toDate, range, reportingStatus]);

  const clearFilter = () => {
    setFromDate("");
    setToDate("");
    setRange("");
    setreportingStatus("");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Reporting Analytics Overview</CardTitle>
          <CardDescription>
            Monitor reported content, pets, and blocked users
          </CardDescription>
        </div>
        <Button
          onClick={() => exportReportingAnalyticsCSV(statsData)}
          className="cursor-pointer w-[300px]"
        >
          Export CSV
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-2 sm:grid-cols-4 sm:gap-4">
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
            <Select
              onValueChange={(value) =>
                setReportingType(value as ReportType | "all")
              }
            >
              <SelectTrigger
                className="cursor-pointer w-full"
                id="report-type-filter"
              >
                <SelectValue placeholder="Select Report Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="PET">Pet Reports</SelectItem>
                <SelectItem value="POST">Post Reports</SelectItem>
                <SelectItem value="POST_COMMENT">
                  Post Comment Reports
                </SelectItem>
                <SelectItem value="EVENT">Event Reports</SelectItem>
                <SelectItem value="EVENT_POST">Event Post Reports</SelectItem>
                <SelectItem value="EVENT_POST_COMMENT">
                  Event Post Comment Reports
                </SelectItem>
                <SelectItem value="CHAT_ROOM">Chat Room Reports</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          <div className="space-y-2">
            {/* <Label htmlFor="role-filter" className="text-sm font-medium">
              Status
            </Label> */}
            <Select
              onValueChange={(value) => setreportingStatus(value as string)}
            >
              <SelectTrigger
                className="cursor-pointer w-full"
                id="report-type-filter"
              >
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="RESOLVED">RESOLVED</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={clearFilter}>
            Clear Filter
          </Button>
        </div>
        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg border bg-gradient-to-br from-red-50 to-rose-50">
            <div className="text-sm text-gray-600 mb-1">Reported Pets</div>
            <div className="text-sm text-gray-500 text-xs mb-2">
              Total reported pets
            </div>
            <div className="text-3xl font-bold text-red-600">
              {statsData?.totals?.reportedPets ?? 0}
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="text-sm text-gray-600 mb-1">Reported Content</div>
            <div className="text-sm text-gray-500 text-xs mb-2">
              Total flagged content
            </div>
            <div className="text-3xl font-bold text-orange-600">
              {statsData?.totals?.reportedContent ?? 0}
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-gradient-to-br from-gray-50 to-slate-50">
            <div className="text-sm text-gray-600 mb-1">Blocked Users</div>
            <div className="text-sm text-gray-500 text-xs mb-2">
              Blocked accounts
            </div>
            <div className="text-3xl font-bold text-gray-600">
              {statsData?.totals?.blockedUsers ?? 0}
            </div>
          </div>
        </div>

        {/* MODERATION SUMMARY */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">
            Moderation Summary
          </h4>

          <div className="space-y-1 text-sm text-yellow-700">
            <p>• {statsData?.totals?.reportedPets ?? 0} pets reported</p>
            <p>
              • {statsData?.totals?.reportedContent ?? 0} content items flagged
            </p>
            <p>• {statsData?.totals?.blockedUsers ?? 0} users blocked</p>

            <p className="mt-2 font-medium">
              Block Rate:{" "}
              {statsData?.totals?.reportedPets
                ? (
                    (statsData.totals.blockedUsers /
                      statsData.totals.reportedPets) *
                    100
                  ).toFixed(1)
                : "0.0"}
              %
            </p>
          </div>
        </div>

        {/* BREAKDOWN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">Content Breakdown</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Post Reports: {statsData?.breakdown?.postReports ?? 0}</li>
              <li>
                Post Comment Reports:{" "}
                {statsData?.breakdown?.postCommentReports ?? 0}
              </li>
              <li>Pet Reports: {statsData?.breakdown?.petReports ?? 0}</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">Event & Chat Breakdown</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Event Reports: {statsData?.breakdown?.eventReports ?? 0}</li>
              <li>
                Event Post Reports:{" "}
                {statsData?.breakdown?.eventPostReports ?? 0}
              </li>
              <li>
                Event Comment Reports:{" "}
                {statsData?.breakdown?.eventPostCommentReports ?? 0}
              </li>
              <li>
                Chat Room Reports: {statsData?.breakdown?.chatRoomReports ?? 0}
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportingAnalytics;
