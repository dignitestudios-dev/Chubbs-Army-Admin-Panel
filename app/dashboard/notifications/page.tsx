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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(() => [
    {
      id: 1,
      title: "Maintenance Notice",
      message: "Platform maintenance at 02:00 UTC",
      audience: "Global",
      sentAt: "2026-01-10 02:00",
      status: "Sent",
    },
    {
      id: 2,
      title: "New Feature",
      message: "Launching seller analytics",
      audience: "Vendors",
      status: "Draft",
    },
  ]);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<Notification["audience"]>("Global");

  const sendNotification = () => {
    const id = (notifications[notifications.length - 1]?.id ?? 0) + 1;
    const newNotif: Notification = {
      id,
      title,
      message,
      audience,
      sentAt: new Date().toISOString(),
      status: "Sent",
    };
    setNotifications((s) => [newNotif, ...s]);
    setTitle("");
    setMessage("");
  };

  const resend = (id: number) =>
    setNotifications((s) =>
      s.map((n) =>
        n.id === id
          ? { ...n, sentAt: new Date().toISOString(), status: "Sent" }
          : n
      )
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Select value={audience} onValueChange={(v) => setAudience(v as any)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Global">Global</SelectItem>
              <SelectItem value="All Users">All Users</SelectItem>
              <SelectItem value="Vendors">Vendors</SelectItem>
              <SelectItem value="Admins">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button onClick={sendNotification} disabled={!title || !message}>
            Send Notification
          </Button>
        </div>
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
