"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

/**
 * Global table skeleton loader component
 *
 * Usage:
 * ```tsx
 * import { TableSkeleton } from "@/components/ui/table-skeleton";
 *
 * // Basic usage
 * <TableSkeleton />
 *
 * // Custom configuration
 * <TableSkeleton rows={10} columns={5} showHeader={true} />
 *
 * // In your table component with loading state
 * {loading ? (
 *   <TableSkeleton rows={pageSize} columns={4} />
 * ) : (
 *   <Table>...</Table>
 * )}
 * ```
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
  showHeader = true,
  className = "",
}: TableSkeletonProps) {
  return (
    <div className={`rounded-md border ${className}`}>
      <Table>
        {showHeader && (
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton className="h-4 w-full max-w-32" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
