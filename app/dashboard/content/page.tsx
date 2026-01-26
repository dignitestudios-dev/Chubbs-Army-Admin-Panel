"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ChallengeViewModal } from "./components/ChallengeViewModal";
import { CreateChallengeModal } from "./components/CreateChallengeModal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "@/axios";
import { AxiosError } from "axios";
import { ErrorToast } from "@/components/Toaster";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EditChallengeModal } from "./components/EditChallengeModal";

type Challenge = {
  id: string;
  name: string;
  description: string;
  duration: string;
  image: File | null;
  petsCount: number;
  status: string;
  createdAt: string;
  endDate: string;
  imageUrl: string;
};

export default function ContentPage() {
  const [selected, setSelected] = useState<"Challenge" | "command_update">(
    "Challenge",
  );

  const [viewModal, setViewModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null,
  );
  const [editOpen, setEditOpen] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const params: unknown = { page, limit, type: selected };
        const response = await axios.get(`/challenges/getAllChallenges`, {
          params,
        });

        setChallenges(response?.data?.data?.data);
        setTotalPages(response?.data?.data?.meta?.totalPages ?? 1);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        ErrorToast(err.response?.data?.message ?? "Failed to fetch challenges");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [update, selected, page, limit]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      handlePageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      handlePageChange(page + 1);
    }
  };

  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const onEdit = (id: string) => {
    const challenge = challenges.find((c) => c.id === id);
    if (!challenge) return;

    setSelectedChallenge(challenge);
    setEditOpen(true);
  };

  function deleteChallenge(id: string) {
    setChallenges((prevChallenges) =>
      prevChallenges.filter((challenge) => challenge.id !== id),
    );
  }

  const openViewModal = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setViewModal(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-muted-foreground text-[22px] font-bold">
        Content Management
      </h1>

      {loading ? (
        <div>Loading challenges...</div>
      ) : (
        <>
          <Tabs
            value={selected}
            onValueChange={(v) => {
              if (v === "Challenge" || v === "command_update") {
                setSelected(v);
              }
            }}
          >
            <TabsList>
              <TabsTrigger value="Challenge">Challenges</TabsTrigger>
              <TabsTrigger value="command_update">Command Update</TabsTrigger>
            </TabsList>
          </Tabs>

          {selected === "Challenge" ? (
            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">Upload Challenges</h2>
                  <div className="text-sm text-muted-foreground">
                    Create and manage challenges
                  </div>
                </div>
                <Button onClick={() => setCreateModal(true)}>
                  <Plus className="size-4 mr-2" />
                  Create Challenge
                </Button>
                <div className="mt-6 space-y-4 overflow-hidden h-[400px]">
                  <h3 className="font-medium mb-2">Challenges</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {challenges?.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-lg border bg-white shadow-sm overflow-hidden flex flex-col"
                      >
                        {/* Image */}
                        <div className="h-40 overflow-hidden">
                          <img
                            src={c.imageUrl}
                            alt={c.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-lg line-clamp-1">
                              {c.name}
                            </h3>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                c.status === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {c.status}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {c.description}
                          </p>

                          {/* Dates */}
                          <div className="text-xs text-muted-foreground space-y-1 mb-4">
                            <div>
                              <span className="font-medium">Start:</span>{" "}
                              {new Date(c.createdAt).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">End:</span>{" "}
                              {new Date(c.endDate).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-auto flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onEdit(c.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteChallenge(c.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <CreateChallengeModal
                  open={createModal}
                  onClose={() => setCreateModal(false)}
                  challenges={challenges}
                  selectedTab={selected}
                  onSuccess={() => setUpdate((prev) => !prev)}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">
                    Upload Command Update
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    Create and manage command updates
                  </div>
                </div>

                <Button onClick={() => setCreateModal(true)}>
                  <Plus className="size-4 mr-2" />
                  Create Command Update
                </Button>
                <div className="mt-6 space-y-4 overflow-hidden h-[400px]">
                  <h3 className="font-medium mb-2">Challenges</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {challenges?.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-lg border bg-white shadow-sm overflow-hidden flex flex-col"
                      >
                        {/* Image */}
                        <div className="h-40 overflow-hidden">
                          <img
                            src={c.imageUrl}
                            alt={c.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-lg line-clamp-1">
                              {c.name}
                            </h3>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                c.status === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {c.status}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {c.description}
                          </p>

                          {/* Dates */}
                          <div className="text-xs text-muted-foreground space-y-1 mb-4">
                            <div>
                              <span className="font-medium">Start:</span>{" "}
                              {new Date(c.createdAt).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">End:</span>{" "}
                              {new Date(c.endDate).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-auto flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onEdit(c.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteChallenge(c.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <CreateChallengeModal
                  open={createModal}
                  onClose={() => setCreateModal(false)}
                  challenges={challenges}
                  selectedTab={selected}
                  onSuccess={() => setUpdate((prev) => !prev)}
                />
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="page-size" className="text-sm font-medium">
                Show
              </Label>
              <Select
                value={limit.toString()}
                // onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-20 cursor-pointer" id="page-size">
                  <SelectValue placeholder={limit.toString()} />
                </SelectTrigger>
                <SelectContent side="top">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="40">40</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="hidden sm:flex items-center space-x-2">
                <p className="text-sm font-medium">Page</p>
                <strong className="text-sm">
                  {page} of {totalPages}
                </strong>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={page <= 1}
                  className="cursor-pointer"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                  className="cursor-pointer"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>

          {editOpen && (
            <EditChallengeModal
              open={editOpen}
              challenge={selectedChallenge}
              onClose={() => {
                setEditOpen(false);
                setSelectedChallenge(null);
              }}
              onSuccess={() => setUpdate((prev) => !prev)}
            />
          )}

          {/* {viewModal && (
            <ChallengeViewModal
              open={viewModal}
              onClose={() => setViewModal(false)}
              challenge={selectedChallenge}
            />
          )} */}
        </>
      )}
    </div>
  );
}
