import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
import React, { useMemo } from "react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Active Users",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

// Simple line chart component
// const LineChart = ({ data }: { data: GrowthData[] }) => {
//   const max = Math.max(...data.map((d) => d.users));
//   const min = Math.min(...data.map((d) => d.users));
//   const range = max - min || 1;

//   return (
//     <div className="w-full h-48 relative border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
//       <svg className="w-full h-full" viewBox="0 0 500 200">
//         <polyline
//           fill="none"
//           stroke="#4f46e5"
//           strokeWidth="3"
//           points={data
//             .map((d, i) => {
//               const x = (i / (data.length - 1)) * 480 + 10;
//               const y = 190 - ((d.users - min) / range) * 170;
//               return `${x},${y}`;
//             })
//             .join(" ")}
//         />
//         {data.map((d, i) => {
//           const x = (i / (data.length - 1)) * 480 + 10;
//           const y = 190 - ((d.users - min) / range) * 170;
//           return <circle key={i} cx={x} cy={y} r="4" fill="#4f46e5" />;
//         })}
//       </svg>
//       <div className="absolute bottom-2 left-4 text-xs text-gray-600">
//         {data[0]?.date}
//       </div>
//       <div className="absolute bottom-2 right-4 text-xs text-gray-600">
//         {data[data.length - 1]?.date}
//       </div>
//     </div>
//   );
// };

const UserAnalytics = ({ statsData }: ChartBarMultipleProps) => {
  
  const chartData = useMemo(() => {
    if (!statsData?.graphs?.users) return [];

    return statsData.graphs.users.map((item) => ({
      month: item.label, // X-axis
      mobile: item.value, // Y-axis
    }));
  }, [statsData]);
  const exportUserAnalyticsCSV = (statsData: any) => {
    if (!statsData) return;

    const rows: string[][] = [];

    // Header
    rows.push(["Section", "Metric", "Value"]);

    // Users
    rows.push(["Users", "Total Users", statsData.users.total]);
    rows.push(["Users", "Daily Growth", statsData.users.growth.daily]);
    rows.push(["Users", "Monthly Growth", statsData.users.growth.monthly]);
    rows.push(["Users", "DAU", statsData.users.active.dau]);
    rows.push(["Users", "MAU", statsData.users.active.mau]);

    // Roles
    Object.entries(statsData.users.roles).forEach(([role, value]) => {
      rows.push(["User Roles", role, String(value)]);
    });

    // Content
    rows.push(["Content", "Total Posts", statsData.content.totalPosts]);
    rows.push(["Content", "Total Videos", statsData.content.totalVideos]);

    // Marketplace
    rows.push(["Marketplace", "Revenue", statsData.marketplace.revenue]);
    rows.push([
      "Marketplace",
      "Total Orders",
      statsData.marketplace.totalOrders,
    ]);

    // Ecosystem
    rows.push([
      "Ecosystem",
      "Active Vendors",
      statsData.ecosystem.activeVendors,
    ]);
    rows.push([
      "Ecosystem",
      "Active Organizers",
      statsData.ecosystem.activeOrganizers,
    ]);
    rows.push(["Ecosystem", "Total Pets", statsData.ecosystem.totalPets]);

    // Events
    rows.push(["Events", "Pending Events", statsData.events.pending]);
    rows.push(["Events", "Total Events", statsData.events.total]);

    // Compliance
    rows.push([
      "Compliance",
      "Reported Content Count",
      statsData.compliance.reportedContentCount,
    ]);

    // Graph – User Growth
    statsData.graphs.users.forEach((item: any) => {
      rows.push(["User Growth", item.label, item.value]);
    });

    // Convert to CSV string
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((row) => row.join(",")).join("\n");

    // Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "user_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader className="grid grid-cols-2 justify-between">
        <div>
          <CardTitle>User Analytics Overview</CardTitle>
          <CardDescription>
            Track user growth and engagement metrics
          </CardDescription>
        </div>
        <div className="flex justify-end">
          <Button
            className="cursor-pointer"
            onClick={() => exportUserAnalyticsCSV(statsData)}
          >
            Export CSV
          </Button>{" "}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg border">
            <div className="text-sm text-gray-600 mb-1">Total Users Count</div>
            <div className="text-3xl font-bold ">{statsData?.users?.total}</div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-lg">User Growth Trends</h4>
          {/* <LineChart data={userAnalytics.growthTrends} /> */}
          <Card>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />

                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />

                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />

                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.4}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userAnalytics.growthTrends.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.users}</TableCell>
                  <TableCell>
                    {index > 0 ? (
                      <Badge
                        variant={
                          item.users >
                          userAnalytics.growthTrends[index - 1].users
                            ? "default"
                            : "secondary"
                        }
                      >
                        +
                        {item.users -
                          userAnalytics.growthTrends[index - 1].users}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default UserAnalytics;
