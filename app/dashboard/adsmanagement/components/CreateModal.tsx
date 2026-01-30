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
    .max(10, "Maximum 10 images allowed")
    .required("Images are required"),
  startDate: Yup.date()
    .min(new Date(), "Start date cannot be in the past")
    .required("Start date is required"),
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
    const currentImages = values.images;

    // Check if adding new files would exceed limit
    if (currentImages.length + files.length > 10) {
      ErrorToast("Maximum 10 images allowed");
      return;
    }

    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);

    // Update formik values
    setFieldValue("images", [...currentImages, ...files]);
  };

  const removeImage = (index: number) => {
    const newImages = values.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    // Revoke the object URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);

    setFieldValue("images", newImages);
    setImagePreviews(newPreviews);
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
            {/* Image Upload Section */}
            <div className="space-y-3">
              <Label htmlFor="images" className="text-base font-semibold">
                Ad Images{" "}
                <span className="text-sm text-gray-500 font-normal">
                  (Max 10 images)
                </span>
              </Label>

              {/* Image Grid Display */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border-2 border-dashed border-gray-200">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-200"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* <div className="absolute  duration-200" /> */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-semibold text-gray-700">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              {values.images.length < 10 && (
                <div className="relative">
                  <Input
                    id="images"
                    type="file"
                    name="images"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    multiple
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
                        <ImagePlus className="h-6 w-6 " />
                      </div>
                      <p className="mb-1 text-sm font-semibold text-gray-700">
                        <span>Click to upload</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG or WEBP (MAX. 10 images)
                      </p>
                      {values.images.length > 0 && (
                        <p className="text-xs text-indigo-600 font-semibold mt-2">
                          {values.images.length} / 10 images uploaded
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              )}

              {errors.images && touched.images && (
                <p className="text-red-600 text-sm font-medium">
                  {typeof errors.images === "string"
                    ? errors.images
                    : "Please upload at least one image"}
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
                    days
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
