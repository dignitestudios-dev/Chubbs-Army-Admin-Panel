"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col space-y-4">
      {/* Filters Skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-[880px]" />
      </div>

      {/* Stats Section */}
      <h1 className="mb-0 text-muted-foreground font-medium">Stats</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-2 p-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Action Section */}
      <h1 className="mb-0 text-muted-foreground font-medium">Quick Action</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-2 p-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                {index === 2 ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Skeleton className="h-8 w-12" />
                )}
                <Skeleton className="h-8 w-24 rounded-3xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <h1 className="mb-0 text-muted-foreground font-medium">Charts</h1>
      <div className="grid grid-cols-2 space-x-4">
        {/* Chart 1 Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>

        {/* Chart 2 Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
