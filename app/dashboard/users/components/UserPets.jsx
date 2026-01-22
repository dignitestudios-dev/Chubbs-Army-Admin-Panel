"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

function initials(name) {
  if (!name) return "P";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function UserPets({ pets = [] }) {
  const router = useRouter();
  if (!pets || pets.length === 0) return null;

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Linked Pet Profiles</h2>
          <p className="text-sm text-muted-foreground">{pets.length} pets</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {pets.map((pet, i) => (
            <div
              onClick={() => router.push(`/dashboard/pet/${pet.id}`)}
              key={pet.id || i}
              className="cursor-pointer flex items-center space-x-4 rounded-lg border bg-card p-4 shadow-sm"
            >
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-muted-foreground flex items-center justify-center text-sm font-medium text-muted-foreground">
                  {pet.petName ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pet.profileUrl}
                      alt={pet.petName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg text-primary">
                      {initials(pet.petName)}
                    </span>
                  )}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium truncate">
                    {pet.petName || "—"}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {pet.breed || "Unknown"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {pet.breed ? `${pet.breed}` : "Breed unknown"}
                  {pet.age ? ` • ${pet.age} yr${pet.age > 1 ? "s" : ""}` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
