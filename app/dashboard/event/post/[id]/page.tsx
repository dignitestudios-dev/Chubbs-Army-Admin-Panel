import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeedbackItem {
  id: number;
  user: string;
  rating: number;
  comment: string;
  flagged?: boolean;
}

interface PostEventDetail {
  id: number;
  title: string;
  ratingAvg: number;
  feedback: FeedbackItem[];
  reports: number;
}

const mockData: PostEventDetail = {
  id: 1,
  title: "Tech Conference 2025",
  ratingAvg: 4.2,
  reports: 2,
  feedback: [
    {
      id: 1,
      user: "John D.",
      rating: 5,
      comment: "Great event, very well organized!",
    },
    {
      id: 2,
      user: "Anonymous",
      rating: 2,
      comment: "Inappropriate content during presentation",
      flagged: true,
    },
  ],
};

export default async function PostEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = mockData; // replace with fetch(id)

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">{event.title}</h1>

      {/* Ratings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ratings Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <span className="text-4xl font-bold">
            {event.ratingAvg.toFixed(1)}
          </span>
          <Badge variant="secondary">{event.feedback.length} Reviews</Badge>
          {event.reports > 0 && (
            <Badge variant="destructive">{event.reports} Reports</Badge>
          )}
        </CardContent>
      </Card>

      {/* Feedback Review */}
      <Card>
        <CardHeader>
          <CardTitle>User Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {event.feedback.map((f) => (
            <div key={f.id} className="rounded-md border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{f.user}</span>
                <Badge variant={f.flagged ? "destructive" : "secondary"}>
                  {f.rating}★
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">{f.comment}</p>

              <div className="flex gap-2">
                {f.flagged && (
                  <Button size="sm" variant="destructive">
                    Remove Feedback
                  </Button>
                )}
                <Button size="sm" variant="ghost">
                  Dismiss
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Content Moderation */}
      <Card>
        <CardHeader>
          <CardTitle>Content Moderation</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button variant="destructive">Remove Event Content</Button>
          <Button variant="outline">Contact Organizer</Button>
        </CardContent>
      </Card>
    </div>
  );
}
