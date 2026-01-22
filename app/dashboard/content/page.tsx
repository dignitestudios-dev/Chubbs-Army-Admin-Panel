"use client";

import { useState, useEffect } from "react";
import { DataTable } from "./components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, Plus, Check, X, UploadCloud } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ChallengeViewModal } from "./components/ChallengeViewModal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Challenge = {
  id: number;
  title: string;
  description: string;
  duration: string;
  image: File | null;
  petsCount: number;
};

const pet = {
  id: "123",
  name: "Buddy",
  species: "Dog",
  breed: "Labrador",
  age: 4,
  ownerName: "Jane Doe",
  ownerHandle: "jane_d",
};

export default function ContentPage() {
  const [selected, setSelected] = useState<"challenge" | "command ">(
    "challenge",
  );
  // const [badges, setBadges] = useState([
  //   { id: "b1", name: "Friendly", points: 10 },
  //   { id: "b2", name: "Explorer", points: 50 },
  // ]);

  const [viewModal, setViewModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null,
  );
  const [editModal, setEditModal] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 1,
      title: "30-Day Fitness Challenge",
      description: "Daily activity challenge for pets to stay healthy.",
      duration: "30 Days",
      image: null,
      petsCount: 124,
    },
  ]);

  const [submissions, setSubmissions] = useState([
    {
      id: "s1",
      challengeId: "c1",
      petId: pet.id,
      submittedBy: pet.ownerName,
      status: "pending",
    },
  ]);

  function addChallenge(
    title: string,
    description: string,
    duration: string,
    image: File | null,
  ) {
    const newChallenge: Challenge = {
      id: Date.now(),
      title,
      description,
      duration,
      image,
      petsCount: 0,
    };
    setChallenges((prevChallenges) => [...prevChallenges, newChallenge]);
  }

  function editChallenge(id: number) {
    const challenge = challenges.find((c) => c.id === id);
    if (challenge) {
      setSelectedChallenge(challenge);
      setEditModal(true);
      console.log("Edit challenge:", challenge);
    }
  }

  function updateChallenge(
    id: number,
    title: string,
    description: string,
    duration: string,
    image: File | null,
  ) {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, title, description, duration, image } : c,
      ),
    );
    setEditModal(false);
    setSelectedChallenge(null);
  }

  function deleteChallenge(id: number) {
    setChallenges((prevChallenges) =>
      prevChallenges.filter((challenge) => challenge.id !== id),
    );
  }

  const openViewModal = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setViewModal(true);
  };

  // function addBadge(name: string, points: number) {
  //   setBadges((b) => [...b, { id: `b${Date.now()}`, name, points }]);
  // }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-muted-foreground text-[22px] font-bold">
        Content Management
      </h1>
      <Tabs value={selected} onValueChange={(v) => setSelected(v as any)}>
        <TabsList>
          <TabsTrigger value="challenge">Challenges</TabsTrigger>
          <TabsTrigger value="command">Command Update</TabsTrigger>
          {/* <TabsTrigger value="refunds">Refunds & Disputes</TabsTrigger> */}
        </TabsList>
      </Tabs>
      {/* <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Rank & Badge Control</h2>
            <div className="text-sm text-muted-foreground">
              Manage ranks, badges & thresholds
            </div>
          </div>
          <div className="space-y-3">
            <AddBadgeForm onAdd={(name, points) => addBadge(name, points)} />
            <div className="space-y-2">
              <h3 className="font-medium">Badges</h3>
              <div className="grid grid-cols-2 gap-4">
                {badges.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between border rounded p-2"
                  >
                    <div>
                      <div className="font-medium">{b.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Points: {b.points}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}
      {selected === "challenge" ? (
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Upload Challenges</h2>
              <div className="text-sm text-muted-foreground">
                Create and manage challenges
              </div>
            </div>
            <div className="space-y-3">
              {/* <AddBadgeForm onAdd={(name, points) => addBadge(name, points)} /> */}
              <AddChallengeForm
                onAdd={(title, description, duration, image) =>
                  addChallenge(title, description, duration, image)
                }
                initial={null}
              />
              <div>
                <h3 className="font-medium mb-2">Challenges</h3>

                {challenges.map((c) => (
                  <div
                    key={c.id}
                    className="border rounded-md p-3 mb-2 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{c.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {c.duration} • {c.petsCount} pets involved
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openViewModal(c)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editChallenge(c.id)}
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
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Upload Command Update</h2>
              <div className="text-sm text-muted-foreground">
                Create and manage command updates
              </div>
            </div>
            <div className="space-y-3">
              {/* <AddBadgeForm onAdd={(name, points) => addBadge(name, points)} /> */}
              <AddChallengeForm
                onAdd={(title, description, duration, image) =>
                  addChallenge(title, description, duration, image)
                }
                initial={null}
              />
              <div>
                <h3 className="font-medium mb-2">Command Updates</h3>

                {challenges.map((c) => (
                  <div
                    key={c.id}
                    className="border rounded-md p-3 mb-2 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{c.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {c.duration} • {c.petsCount} pets involved
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openViewModal(c)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editChallenge(c.id)}
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
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {viewModal && (
        <ChallengeViewModal
          open={viewModal}
          onClose={() => setViewModal(false)}
          challenge={selectedChallenge}
        />
      )}

      {editModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-popover text-popover-foreground p-6 rounded-md w-full max-w-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Edit Challenge</h3>
              <Button
                variant="ghost"
                onClick={() => {
                  setEditModal(false);
                  setSelectedChallenge(null);
                }}
              >
                Close
              </Button>
            </div>
            <AddChallengeForm
              initial={selectedChallenge}
              onEdit={(title, description, duration, image) =>
                selectedChallenge &&
                updateChallenge(
                  selectedChallenge.id,
                  title,
                  description,
                  duration,
                  image,
                )
              }
            />
          </div>
        </div>
      )}
    </div>
  );

  function AddChallengeForm({
    onAdd,
    initial,
    onEdit,
  }: {
    onAdd?: (
      title: string,
      description: string,
      duration: string,
      image: File | null,
    ) => void;
    onEdit?: (
      title: string,
      description: string,
      duration: string,
      image: File | null,
    ) => void;
    initial?: Challenge | null;
  }) {
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
      if (initial) {
        setTitle(initial.title ?? "");
        setDuration(initial.duration ?? "");
        setDescription(initial.description ?? "");
        setImage(initial.image ?? null);
        setPreview(initial.image ? URL.createObjectURL(initial.image) : null);
      } else {
        setTitle("");
        setDuration("");
        setDescription("");
        setImage(null);
        setPreview(null);
      }
    }, [initial]);

    const handleSubmit = () => {
      if (!title || !duration || !description) return;
      if (initial && onEdit) {
        onEdit(title, description, duration, image);
      } else if (onAdd) {
        onAdd(title, description, duration, image);
      }
      setTitle("");
      setDuration("");
      setDescription("");
      setImage(null);
      setPreview(null);
    };

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Challenge Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Duration (e.g. 30 Days)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Challenge Image</label>

          <div className="relative">
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setImage(file);
                setPreview(URL.createObjectURL(file));
              }}
            />

            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted transition">
              <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Click to upload image</p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-full object-cover rounded-md border"
            />
          )}
        </div>

        <Input
          placeholder="Challenge Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button onClick={handleSubmit}>
          <Plus className="size-4 mr-1" />
          {initial ? "Update Challenge" : "Create Challenge"}
        </Button>
      </div>
    );
  }

  // function AddBadgeForm({
  //   onAdd,
  // }: {
  //   onAdd: (name: string, points: number) => void;
  // }) {
  //   const [name, setName] = useState("");
  //   const [points, setPoints] = useState(0);
  //   return (
  //     <div className="flex items-center gap-2">
  //       <Input
  //         placeholder="Badge name"
  //         value={name}
  //         onChange={(e) => setName(e.target.value)}
  //       />
  //       <Input
  //         type="number"
  //         placeholder="Points"
  //         value={points}
  //         onChange={(e) => setPoints(Number(e.target.value))}
  //       />
  //       <Button
  //         onClick={() => {
  //           if (name) {
  //             onAdd(name, points);
  //             setName("");
  //             setPoints(0);
  //           }
  //         }}
  //       >
  //         <Award className="size-4" /> Add
  //       </Button>
  //     </div>
  //   );
  // }
}
