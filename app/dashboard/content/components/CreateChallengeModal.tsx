"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFormik } from "formik";
import { createChallengeValues } from "@/init/appValues";
import { createChallengeSchema } from "@/init/appSchema";
import axios from "../../../../axios";
import { AxiosError } from "axios";
import { ErrorToast, SuccessToast } from "@/components/Toaster";

interface CreateChallengeFormValues {
  name: string;
  description: string;
  endDate: string;
  image: File | null;
}

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

interface Props {
  open: boolean;
  onClose: () => void;
  challenges: Challenge[];
  selectedTab: string;
  onSuccess: () => void;
}

export function CreateChallengeModal({
  open,
  onClose,
  onSuccess,
  selectedTab,
  challenges,
}: Props) {
  console.log("🚀 ~ CreateChallengeModal ~ selectedTab:", selectedTab);
  const [loading, setLoading] = useState(false);

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
  } = useFormik<CreateChallengeFormValues>({
    initialValues: createChallengeValues,
    validationSchema: createChallengeSchema,
    validateOnChange: true,
    validateOnBlur: true,

    onSubmit: async (values: CreateChallengeFormValues) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("endDate", new Date(values.endDate).toISOString());
      formData.append("type", selectedTab);
      if (values.image) {
        formData.append("image", values.image);
      }

      // If creating a command_update and there are existing challenges,
      // don't call the API and inform the user.
      if (
        selectedTab === "command_update" &&
        challenges &&
        challenges.length > 0
      ) {
        ErrorToast("Command update already created");
        return;
      }

      try {
        setLoading(true);

        const response = await axios.post("/admin/createChallenge", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          // Handle success
          SuccessToast("Challenge created successfully!");
          onSuccess();
          onClose();
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;

        ErrorToast(err.response?.data?.message ?? "Failed to create challenge");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Challenge</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create Challenge
              </h2>
              <p className="text-gray-600">Create a new challenge</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter challenge name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.name && touched.name && (
                  <p className="text-red-600 text-sm">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter challenge description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.description && touched.description && (
                  <p className="text-red-600 text-sm">{errors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={values.endDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
                {errors.endDate && touched.endDate && (
                  <p className="text-red-600 text-sm">{errors.endDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  name="image"
                  accept="image/jpeg,image/png"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    setFieldValue("image", file);
                  }}
                  onBlur={handleBlur}
                  required
                />
                {touched.image && typeof errors.image === "string" && (
                  <p className="text-red-600 text-sm">{errors.image}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                {loading ? "Creating..." : "Create Challenge"}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
