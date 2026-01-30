"use client";

import { useState, useEffect } from "react";
import { DataTable } from "./components/data-table";
import axios from "../../../axios";
import { ErrorToast } from "@/components/Toaster";
import { AxiosError } from "axios";

interface PetData {
  id: string;
  petName: string;
  breed: string;
  dob: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  _count: {
    reportedPets: number;
  };
}

interface PetFormValues {
  name: string;
  species: string;
  breed: string;
  age: string;
  ownerName: string;
  ownerEmail: string;
}

export default function PetManagementPage() {
  const [pets, setPets] = useState<PetData[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [rankStatus, setRankStatus] = useState<string>("all");

  const fetchPets = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (rankStatus && rankStatus !== "all") {
        params.rank = rankStatus;
      }
      const response = await axios.get("/admin/pets", { params });

      if (response.status === 200) {
        const payload: any = response.data?.data;
        // support multiple API shapes: { pets: [...] }, { data: [...] }, or direct array
        const items = payload?.pets ?? payload?.data ?? payload;
        setPets(items);
        setTotalPages(payload?.meta?.totalPages ?? 1);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      ErrorToast(err.response?.data?.message ?? "Failed to fetch pets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [search, page, limit, rankStatus]);

  const handleFilterChange = (type: string, value: string) => {
    if (type === "search") setSearch(value);
    setPage(1); // reset to first page on filter change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const generateAvatar = (name: string) => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleAddPet = (petData: PetFormValues) => {
    // For API, perhaps implement later
    console.log("Add pet:", petData);
  };

  const handleDeletePet = (id: string) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEditPet = (pet: PetData) => {
    console.log("Edit pet:", pet);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="@container/main px-4 lg:px-6 mt-4 lg:mt-4">
        <DataTable
          pets={pets}
          loading={loading}
          onDeletePet={handleDeletePet}
          onEditPet={handleEditPet}
          onAddPet={handleAddPet}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          totalPages={totalPages}
          currentPage={page}
          pageSize={limit}
          setRankStatus={setRankStatus}
        />
      </div>
    </div>
  );
}
