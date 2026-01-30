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
import { Button } from "@/components/ui/button";

// Simple pie chart component
const PieChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  // eslint-disable-next-line no-var
  var currentAngle = 0;
  console.log(data, "data==>");
  const colors = ["#8f8aed", "#fc83bf"];

  return (
    <div className="flex items-center justify-center gap-8">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {data.map((d, i) => {
          const percentage = d.value / total;
          const angle = percentage * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;

          currentAngle += angle;

          const startRad = (startAngle - 90) * (Math.PI / 180);
          const endRad = (endAngle - 90) * (Math.PI / 180);

          const x1 = 100 + 80 * Math.cos(startRad);
          const y1 = 100 + 80 * Math.sin(startRad);
          const x2 = 100 + 80 * Math.cos(endRad);
          const y2 = 100 + 80 * Math.sin(endRad);

          const largeArc = angle > 180 ? 1 : 0;

          return (
            <path
              key={i}
              d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={colors[i]}
            />
          );
        })}
      </svg>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: colors[i] }}
            />
            <span className="text-sm">
              {d.label}: {d.value} ({((d.value / total) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContentAnalytics = ({ contentAnalytics }) => {
  const [postsData, setPostsData] = useState(null);
  console.log("🚀 ~ ContentAnalytics ~ postsData:", postsData);
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

        const response = await axios.get("/admin/analytics/posts", { params });

        if (response.status === 200) {
          setPostsData(response.data.data);
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
  const exportContentAnalyticsCSV = (postsData: any) => {
    if (!postsData) return;

    const rows: string[][] = [];

    // Header
    rows.push(["Metric", "Value"]);

    // Totals
    rows.push(["Total Posts", postsData.total ?? 0]);
    rows.push(["Image Posts", postsData.breakdown?.Image ?? 0]);
    rows.push(["Video Posts", postsData.breakdown?.Video ?? 0]);

    // CSV string
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((row) => row.join(",")).join("\n");

    // Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "content_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Content Analytics Overview</CardTitle>
          <CardDescription>
            Monitor content creation and distribution
          </CardDescription>
        </div>

        <Button
          onClick={() => exportContentAnalyticsCSV(postsData)}
          className="cursor-pointer"
        >
          Export CSV
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="text-sm text-gray-600 mb-1">Total Posts Count</div>
            <div className="text-3xl font-bold text-blue-600">
              {postsData?.breakdown?.Image}
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-gradient-to-br from-violet-50 to-purple-50">
            <div className="text-sm text-gray-600 mb-1">Total Videos Count</div>
            <div className="text-3xl font-bold text-violet-600">
              {postsData?.breakdown?.Video}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-lg">
            Content Type Distribution
          </h4>
          <PieChart
            data={[
              {
                label: "Photos",
                value: postsData?.breakdown?.Image,
              },
              {
                label: "Videos",
                value: postsData?.breakdown?.Video,
              },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentAnalytics;
