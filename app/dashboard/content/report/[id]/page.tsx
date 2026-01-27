"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ReportedContentTable from "../../components/reportedContentTable";
import axios from "@/axios";

interface ContentData {
  id: string;
  owner: string;
  reportReason: string;
  reportedBy: string;
  // Add other fields if needed
}

export default function ReportedContentPage() {
  const [reportedContent, setReportedContent] = useState<ContentData[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`/admin/reports/${id}`);
        if (response.status === 200) {
          setReportedContent(response?.data?.data);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReports();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
