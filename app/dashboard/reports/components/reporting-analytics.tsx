import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ReportingAnalytics = ({ reportingAnalytics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reporting Analytics Overview</CardTitle>
        <CardDescription>
          Monitor reported users, content, and blocked accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg border bg-gradient-to-br from-red-50 to-rose-50">
            <div className="text-sm text-gray-600 mb-1">Reported Users</div>
            <div className="text-sm text-gray-500 text-xs mb-2">
              Total reported accounts
            </div>
            <div className="text-3xl font-bold text-red-600">
              {reportingAnalytics.reportedUsers}
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="text-sm text-gray-600 mb-1">Reported Content</div>
            <div className="text-sm text-gray-500 text-xs mb-2">
              Total flagged posts
            </div>
            <div className="text-3xl font-bold text-orange-600">
              {reportingAnalytics.reportedContent}
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-gradient-to-br from-gray-50 to-slate-50">
            <div className="text-sm text-gray-600 mb-1">Blocked Users</div>
            <div className="text-sm text-gray-500 text-xs mb-2">
              Count of blocked accounts
            </div>
            <div className="text-3xl font-bold text-gray-600">
              {reportingAnalytics.blockedUsers}
            </div>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">
            Moderation Summary
          </h4>
          <div className="space-y-1 text-sm text-yellow-700">
            <p>
              • {reportingAnalytics.reportedUsers} user accounts have been
              reported
            </p>
            <p>
              • {reportingAnalytics.reportedContent} posts have been flagged for
              review
            </p>
            <p>
              • {reportingAnalytics.blockedUsers} accounts have been blocked
            </p>
            <p className="mt-2 font-medium">
              Block Rate:{" "}
              {(
                (reportingAnalytics.blockedUsers /
                  reportingAnalytics.reportedUsers) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportingAnalytics;
