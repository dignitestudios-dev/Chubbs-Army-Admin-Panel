import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const EventAnalytics = ({ eventAnalytics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Analytics Overview</CardTitle>
        <CardDescription>
          Monitor event performance and attendance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-3 text-lg">Total Events</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-gradient-to-br from-sky-50 to-blue-50">
              <div className="text-sm text-gray-600">Upcoming</div>
              <div className="text-3xl font-bold text-sky-600">
                {eventAnalytics.totalEvents.upcoming}
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-gradient-to-br from-slate-50 to-gray-50">
              <div className="text-sm text-gray-600">Past</div>
              <div className="text-3xl font-bold text-slate-600">
                {eventAnalytics.totalEvents.past}
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
                {eventAnalytics.rsvpVsAttendance.rsvps}
              </div>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="text-sm text-gray-600">Actual Attendees</div>
              <div className="text-2xl font-bold text-purple-600">
                {eventAnalytics.rsvpVsAttendance.attendees}
              </div>
            </div>
          </div>
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-700">
              Attendance Rate:{" "}
              <span className="font-semibold text-blue-600">
                {(
                  (eventAnalytics.rsvpVsAttendance.attendees /
                    eventAnalytics.rsvpVsAttendance.rsvps) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-lg">Event Revenue</h4>
          <div className="p-6 rounded-lg border bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="text-sm text-gray-600 mb-1">Total Ticket Sales</div>
            <div className="text-4xl font-bold text-green-600">
              ${eventAnalytics.eventRevenue.toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventAnalytics;
