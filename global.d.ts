export {};
import { QuickAction } from "./app/dashboard/dashboardcomponent/QuickAction";

declare global {
  interface SignInFormValues {
    email: string;
    password: string;
  }

  interface SignInResponse {
    data: {
      data: {
        token?: string;
        user?: unknown;
      };
      message?: string;
    };
  }

  interface StatMetric {
    title: string;
    current: string | number;
    previous?: string | number;
    growth?: number;
    icon: LucideIcon;
  }

  interface QuickAction {
    title: string;
    current: string | number;
    action?: string;
    icon: any;
    style: string;
    route: string;
    growth?: number;
  }

  interface StatsData {
    content: {
      totalPosts: number;
    };
    ecosystem: {
      activeVendors: number;
      activeServices: number;
      marketplace: number;
    };
  }

  interface GraphPoint {
    label: string;
    value: number;
  }

  interface StatsData {
    graphs?: {
      users?: GraphPoint[];
    };
  }
  type RangeType = "Weekly" | "Monthly" | "Yearly";

  interface MediaItem {
    id: string;
    url: string;
    type: "image" | "video";
  }

  interface Content {
    mediaType: "Image" | "Video";
    caption: string;
    thumbnail?: string;
    media: MediaItem[];
  }
}
