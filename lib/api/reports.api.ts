import { API } from "./axios";

export const getReportsByPostId = async (postId: string) => {
  try {
    const response = await API.get(`/admin/reports/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};