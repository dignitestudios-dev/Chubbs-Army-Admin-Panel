"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "@/axios";
import { AxiosError } from "axios";
import { X, ImagePlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ErrorToast, SuccessToast } from "@/components/Toaster";

interface CreateAdFormValues {
  images: File[];
  startDate: string;
  endDate: string;
  title: string;
  description: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const createAdSchema = Yup.object().shape({
  images: Yup.array()
    .min(1, "At least one image is required")
    .max(1, "Only 1 image is allowed")
    .required("Images are required"),
  startDate: Yup.date()
    .required("Start date is required")
    .test("not-in-past", "Start date cannot be in the past", function (value) {
      if (!value) return false;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0);

      return selectedDate >= today;
    }),
  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End date must be after start date")
    .required("End date is required"),
});

const createAdValues: CreateAdFormValues = {
  images: [],
  startDate: "",
  endDate: "",
  title: "",
  description: "",
};

export function CreateAdModal({ open, onClose, onSuccess }: Props) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
    resetForm,
  } = useFormik<CreateAdFormValues>({
    initialValues: createAdValues,
    validationSchema: createAdSchema,
    validateOnChange: true,
    validateOnBlur: true,

    onSubmit: async (values: CreateAdFormValues) => {
      const formData = new FormData();

      // Append all images
      values.images.forEach((image, index) => {
        formData.append(`media`, image);
      });

      formData.append("startDate", values.startDate);
      formData.append("endDate", values.endDate);
      formData.append(`title`, values.title);
      formData.append(`description`, values.description);
      formData.append(`mediaType`, "Image");

      try {
        setUploading(true);

        const response = await axios.post("admin/createAdvertise", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          SuccessToast("Ad created successfully!");
          onSuccess();
          handleClose();
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        ErrorToast(err.response?.data?.message ?? "Failed to create ad");
      } finally {
        setUploading(false);
      }
    },
  });

  const handleClose = () => {
    resetForm();
    setImagePreviews([]);
    onClose();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files || []);

    // Only take the first file since only 1 image is allowed
    const file = files[0];
    if (!file) return;

    // Revoke previous preview URL if exists
    if (imagePreviews.length > 0) {
      URL.revokeObjectURL(imagePreviews[0]);
    }

    const newPreview = URL.createObjectURL(file);
    setImagePreviews([newPreview]);
    setFieldValue("images", [file]);

    // Reset input so same file can be re-selected after removal
    event.currentTarget.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setFieldValue("images", []);
    setImagePreviews([]);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New Ad
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                name="title"
                placeholder="Enter ad title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.title && touched.title && (
                <p className="text-red-600 text-sm">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter Description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.description && touched.description && (
                <p className="text-red-600 text-sm">{errors.description}</p>
              )}
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              <Label htmlFor="images" className="text-base font-semibold">
                Ad Image{" "}
                <span className="text-sm text-gray-500 font-normal">
                  (Only 1 image allowed)
                </span>
              </Label>

              {/* Image Preview */}
              {imagePreviews.length > 0 && (
                <div className="relative w-40 h-40 rounded-lg overflow-hidden shadow-md group">
                  <img
                    src={imagePreviews[0]}
                    alt="Ad Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(0)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Upload Card — only shown when no image is uploaded */}
              {values.images.length === 0 && (
                <div className="relative">
                  <Input
                    id="images"
                    type="file"
                    name="images"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleImageUpload}
                    onBlur={handleBlur}
                    className="hidden"
                  />
                  <label
                    htmlFor="images"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gradient-to-br from-gray-50 to-indigo-50 hover:from-indigo-50 hover:to-blue-50 transition-all duration-200 group"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="w-12 h-12 mb-3 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                        <ImagePlus className="h-6 w-6" />
                      </div>
                      <p className="mb-1 text-sm font-semibold text-gray-700">
                        <span>Click to upload</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG or WEBP (MAX. 1 image)
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {errors.images && touched.images && (
                <p className="text-red-600 text-sm font-medium">
                  {typeof errors.images === "string"
                    ? errors.images
                    : "Please upload an image"}
                </p>
              )}
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-base font-semibold">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={values.startDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min={new Date().toISOString().slice(0, 10)}
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
                {errors.startDate && touched.startDate && (
                  <p className="text-red-600 text-sm font-medium">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-base font-semibold">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={values.endDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min={
                    values.startDate || new Date().toISOString().slice(0, 10)
                  }
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
                {errors.endDate && touched.endDate && (
                  <p className="text-red-600 text-sm font-medium">
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            {/* Duration Display */}
            {values.startDate && values.endDate && (
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Ad Duration:
                  </span>
                  <span className="text-sm font-bold text-indigo-600">
                    {Math.ceil(
                      (new Date(values.endDate).getTime() -
                        new Date(values.startDate).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    day(s)
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={uploading || values.images.length === 0}
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : (
                  "Create Ad"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 