"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useMemo } from "react";

export const description = "A multiple bar chart";

const chartConfig = {
  desktop: {
    label: " Created",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Attended",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartBarMultiple({ statsData }: ChartBarMultipleProps) {
  const chartData = useMemo(() => {
    if (!statsData?.graphs?.users) return [];

    return statsData.graphs.events.map((item) => ({
      month: item.label, // X-axis
      mobile: item.attended, // Y-axis
      desktop: item.created,
    }));
  }, [statsData]);
  console.log("🚀 ~ ChartBarMultiple ~ chartData:", chartData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Events Created vs Attended</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  );
}
