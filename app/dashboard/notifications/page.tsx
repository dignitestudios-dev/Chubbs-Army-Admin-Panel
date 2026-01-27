"use client";

import React, { useState } from "react";
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

interface SendNotificationFormValues {
  title: string;
  description: string;
  role: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(() => [
    {
      id: 1,
      title: "Maintenance Notice",
      message: "Platform maintenance at 02:00 UTC",
      audience: "USER",
      sentAt: "2026-01-10 02:00",
      status: "Sent",
    },
    {
      id: 2,
      title: "New Feature",
      message: "Launching seller analytics",
      audience: "SERVICE_PROVIDER",
      status: "Draft",
    },
  ]);

  const [loading, setLoading] = useState(false);

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
          const id = (notifications[notifications.length - 1]?.id ?? 0) + 1;
          const newNotif: Notification = {
            id,
            title: values.title,
            message: values.description,
            audience: values.role as "USER" | "SERVICE_PROVIDER" | "EVENT_ORGANIZER",
            sentAt: new Date().toISOString(),
            status: "Sent",
          };
          setNotifications((s) => [newNotif, ...s]);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        ErrorToast(err.response?.data?.message ?? "Failed to send notification");
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

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold">Push Notifications</h1>
        <div className="flex items-center gap-4">
          <Badge>Communications</Badge>
        </div>
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
                onValueChange={(value) => handleChange({ target: { name: "role", value } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">USER</SelectItem>
                  <SelectItem value="SERVICE_PROVIDER">SERVICE_PROVIDER</SelectItem>
                  <SelectItem value="EVENT_ORGANIZER">EVENT_ORGANIZER</SelectItem>
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

      <section>
        <h2 className="text-lg font-semibold">Notifications List</h2>
        <NotificationsTable
          notifications={notifications}
          onResend={resend}
          onDelete={remove}
        />
      </section>
    </div>
  );
}
