"use client";

import React, { useEffect, useState } from "react";
import NotificationsTable, {
  Notification,
} from "./components/notifications-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFormik } from "formik";
import { sendNotificationValues } from "@/init/appValues";
import { sendNotificationSchema } from "@/init/appSchema";
import axios from "../../../axios";
import { AxiosError } from "axios";
import { ErrorToast, SuccessToast } from "@/components/Toaster";
import { useDebounce } from "@/hooks/use-debounce";

interface SendNotificationFormValues {
  title: string;
  description: string;
  role: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(() => []);

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [audience, setAudience] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    resetForm,
  } = useFormik<SendNotificationFormValues>({
    initialValues: sendNotificationValues,
    validationSchema: sendNotificationSchema,
    validateOnChange: true,
    validateOnBlur: true,

    onSubmit: async (values: SendNotificationFormValues) => {
      try {
        setLoading(true);
        const response = await axios.post("/admin/send-notifications", {
          title: values.title,
          description: values.description,
          role: values.role as "USER" | "SERVICE_PROVIDER" | "EVENT_ORGANIZER",
        });

        if (response.status === 200 || response.status === 201) {
          SuccessToast("Notification sent successfully!");
          resetForm();
          // Optionally add to local state
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        ErrorToast(
          err.response?.data?.message ?? "Failed to send notification",
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const resend = (id: number) =>
    setNotifications((s) =>
      s.map((n) =>
        n.id === id
          ? { ...n, sentAt: new Date().toISOString(), status: "Sent" }
          : n,
      ),
    );
  const remove = (id: number) =>
    setNotifications((s) => s.filter((n) => n.id !== id));

  const fetchNotifications = async () => {
    setDataLoading(true);
    try {
      const params: any = { page, limit };
      if (debouncedSearch) params.search = debouncedSearch;
      // if (status && status !== "all") params.status = status;
      if (audience && audience !== "all") params.filter = audience;

      const response = await axios.get("/admin/notifications", { params });
      console.log("🚀 ~ fetchNotifications ~ response:", response);

      if (response.status === 200) {
        setNotifications(response.data.data);
        // setTotalPages(response.data.data.meta.totalPages);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      ErrorToast(
        err.response?.data?.message ?? "Failed to fetch notifications",
      );
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [debouncedSearch, status, audience, page, limit]);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold">Push Notifications</h1>
        {/* <div className="flex items-center gap-4">
          <Badge>Communications</Badge>
        </div> */}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Send Global Notification</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div className="space-y-1">
              <Input
                placeholder="Title"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.title && touched.title && (
                <p className="text-red-600 text-sm">{errors.title}</p>
              )}
            </div>
            <div className="space-y-1">
              <Input
                placeholder="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.description && touched.description && (
                <p className="text-red-600 text-sm">{errors.description}</p>
              )}
            </div>
            <div className="space-y-1">
              <Select
                value={values.role}
                onValueChange={(value) =>
                  handleChange({ target: { name: "role", value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">USER</SelectItem>
                  <SelectItem value="SERVICE_PROVIDER">
                    SERVICE_PROVIDER
                  </SelectItem>
                  <SelectItem value="EVENT_ORGANIZER">
                    EVENT_ORGANIZER
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.role && touched.role && (
                <p className="text-red-600 text-sm">{errors.role}</p>
              )}
            </div>
          </div>
          <div>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Notification"}
            </Button>
          </div>
        </form>
      </section>

      {dataLoading ? (
        <div>Loading notifications...</div>
      ) : (
        <section>
          <h2 className="text-lg font-semibold">Notifications List</h2>
          <NotificationsTable
            notifications={notifications}
            audience={audience}
            status={status || "all"}
            search={search}
            onAudienceChange={(v) => {
              setAudience(v);
              setPage(1);
            }}
            onStatusChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            onSearchChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            onResend={resend}
            onDelete={remove}
          />
        </section>
      )}
    </div>
  );
}
