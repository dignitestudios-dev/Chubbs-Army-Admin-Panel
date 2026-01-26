export {};
import { LucideIcon } from "lucide-react";
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
    icon: LucideIcon;
    style: string;
    route: string;
    growth?: number;
  }

  interface StatsData {
    compliance?: {
      reportedContentCount: number;
    };

    event?: {
      pendingEvents: number;
    };

    content?: {
      totalPosts: number;
    };

    ecosystem?: {
      activeVendors: number;
      activeServices: number;
      marketplace: number;
    };

    graphs?: {
      events?: EventGraphPoint[];
      users?: GraphPoint[];
    };
  }

  // interface StatsData {
  //   content: {
  //     totalPosts: number;
  //   };
  //   ecosystem: {
  //     activeVendors: number;
  //     activeServices: number;
  //     marketplace: number;
  //   };
  // }

  interface EventGraphPoint {
    label: string;
    attended: number;
    created: number;
  }

  interface Graphs {
    events?: EventGraphPoint[];
    users?: GraphPoint[];
  }
  interface StatsData {
    graphs?: Graphs;
  }
  type RangeType = "Weekly" | "Monthly" | "Yearly";

  interface ChartBarMultipleProps {
    statsData: StatsData | null;
    fromDate?: string;
    toDate?: string;
    range?: string;
  }

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

  interface Challenge {
    id: number | string;
    title: string;
    description: string;
    image: string;
    duration: string;
    petsCount: number;
    createdAt?: string; // optional (ISO date)
    updatedAt?: string; // optional (ISO date)
  }

  interface CreateChallengeFormValues {
    name: string;
    description: string;
    endDate: string;
    image: File | null;
  }
}
