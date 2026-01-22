import ReportedContentTable from "../../components/reportedContentTable";

// lib/mockReportedContent.js
const reportedContent = [
  {
    id: "post_1",
    type: "image",
    thumbnail: "https://picsum.photos/200/300",
    owner: "john_doe",
    reportReason: "Inappropriate Content",
    reportedBy: "alice_smith",
    reportCount: 5,
    createdAt: "2024-01-12",
  },
  {
    id: "post_2",
    type: "video",
    thumbnail: "https://picsum.photos/200",
    owner: "mike_jones",
    reportReason: "Spam",
    reportedBy: "emma_w",
    reportCount: 12,
    createdAt: "2024-01-10",
  },
];

export default function ReportedContentPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Reported Content Queue</h1>
      <p className="text-sm text-gray-500">
        Review and moderate reported posts
      </p>

      <ReportedContentTable data={reportedContent} />
    </div>
  );
}
