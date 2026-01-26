"use client";

import React, { useEffect, useState } from "react";
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
import axios from "../../../../axios";
import { AxiosError } from "axios";
import { ErrorToast, SuccessToast } from "@/components/Toaster";
import { createChallengeSchema } from "@/init/appSchema";

interface EditChallengeModalProps {
  open: boolean;
  onClose: () => void;
  challenge: Challenge | null;
  onSuccess: () => void;
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

export function EditChallengeModal({
  open,
  onClose,
  challenge,
  onSuccess,
}: EditChallengeModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: challenge?.name || "",
      description: challenge?.description || "",
      endDate: challenge?.endDate ? challenge.endDate.split("T")[0] : "",
      image: null as File | null,
    },
    validationSchema: createChallengeSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("endDate", new Date(values.endDate).toISOString());

      if (values.image) {
        formData.append("image", values.image);
      }

      try {
        setLoading(true);

        const res = await axios.put(
          `/admin/updateChallenge/${challenge.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );

        if (res.status === 200) {
          SuccessToast("Challenge updated successfully");
          onSuccess();
          onClose();
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        ErrorToast(err.response?.data?.message ?? "Update failed");
      } finally {
        setLoading(false);
      }
    },
  });

  if (!challenge) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Challenge</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && touched.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.description && touched.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <Input
              type="date"
              name="endDate"
              value={values.endDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <div className="space-y-2">
            <Label>Image (optional)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFieldValue("image", e.currentTarget.files?.[0])
              }
            />
          </div>

          <Button className="w-full" type="submit">
            {loading ? "Updating..." : "Update Challenge"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
