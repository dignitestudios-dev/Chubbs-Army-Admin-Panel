"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

type Message = { id: number; from: string; text: string; date: string };

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = Number(params.id);

  // Mock ticket data; in a real app we would fetch by id
  const [ticket] = useState(() => ({
    id: ticketId,
    user: "alice@example.com",
    subject: "Charge error",
    category: "Payments",
    status: "Open",
    priority: "High",
    assignedTo: "Admin A",
    createdAt: "2026-01-10",
  }));

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 1,
      from: ticket.user,
      text: "I was charged twice.",
      date: "2026-01-10 10:02",
    },
    {
      id: 2,
      from: "Admin A",
      text: "Looking into it.",
      date: "2026-01-10 10:10",
    },
  ]);

  const [notes, setNotes] = useState<string[]>(() => [
    "Initial triage: payment gateway logs requested.",
  ]);
  const [newNote, setNewNote] = useState("");
  const [replyText, setReplyText] = useState("");
  const [status, setStatus] = useState(ticket.status);

  const addNote = () => {
    if (!newNote) return;
    setNotes((s) => [newNote, ...s]);
    setNewNote("");
  };

  const sendReply = () => {
    if (!replyText) return;
    setMessages((s) => [
      ...s,
      {
        id: s.length + 1,
        from: "Admin A",
        text: replyText,
        date: new Date().toISOString(),
      },
    ]);
    setReplyText("");
  };

  const changeStatus = (newStatus: typeof status) => setStatus(newStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ticket #{ticket.id}</h1>
          <p className="text-sm text-muted-foreground">
            {ticket.subject} — {ticket.category}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge>{ticket.priority}</Badge>
          <select
            value={status}
            onChange={(e) => changeStatus(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
          <Button onClick={() => router.push("/dashboard/support")}>
            Back
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <section className="rounded-md border p-4">
            <h3 className="font-semibold">User message history</h3>
            <div className="space-y-3 mt-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded ${
                    m.from === ticket.user ? "bg-gray-50" : "bg-white border"
                  }`}
                >
                  <div className="text-sm text-muted-foreground">
                    {m.from} • {m.date}
                  </div>
                  <div className="mt-1">{m.text}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Type your reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <Button onClick={sendReply}>Send</Button>
            </div>
          </section>

          <section className="rounded-md border p-4">
            <h3 className="font-semibold">Attachments</h3>
            <div className="mt-3 text-sm text-muted-foreground">
              No attachments uploaded.
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-md border p-4">
            <h3 className="font-semibold">Internal admin notes</h3>
            <div className="mt-3 space-y-2">
              {notes.map((n, i) => (
                <div key={i} className="text-sm bg-gray-50 p-2 rounded">
                  {n}
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                placeholder="Add internal note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <Button onClick={addNote}>Add</Button>
            </div>
          </section>

          <section className="rounded-md border p-4">
            <h3 className="font-semibold">Ticket details</h3>
            <div className="text-sm mt-2">Created: {formatDate(ticket.createdAt)}</div>
            <div className="text-sm">
              Assigned to: {ticket.assignedTo || "Unassigned"}
            </div>
            <div className="text-sm">Status: {status}</div>
          </section>
        </aside>
      </div>
    </div>
  );
}
