"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { ErrorToast, SuccessToast } from "@/components/Toaster";
import { AxiosError } from "axios";
import axios from "@/axios";
import { useFormik } from "formik";
import { resetPasswordSchema } from "@/init/appSchema";
import { resetValue } from "@/init/appValues";

const ChangePassword = () => {
  const router = useRouter();
  const email = localStorage.getItem("forgotEmail") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: resetValue,
      validationSchema: resetPasswordSchema,
      validateOnChange: true,
      validateOnBlur: true,

      onSubmit: async (values) => {
        const payload = {
          email: email,
          newPassword: values.password,
        };

        try {
          setLoading(true);

          const response = await axios.post<SignInResponse>(
            "auth/reset-password",
            payload,
          );

          if (response.status === 200) {
            SuccessToast("Password changed successfully");

            // dispatch(login());
            router.push("/auth/login");
          }
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;

          ErrorToast(err.response?.data?.message ?? "Login failed");
        } finally {
          setLoading(false);
        }
      },
    });

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Set New Password
        </h2>
        <p className="text-gray-600">
          Enter your new password for {email || "your account"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && touched.password && (
            <p className="text-red-600 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="cPassword"
              name="cPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={values.cPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Validation Error */}
        {errors.cPassword && touched.cPassword && (
          <p className="text-red-600 text-sm">{errors.cPassword}</p>
        )}

        <Button disabled={loading} type="submit" className="w-full">
          {loading ? "Changing..." : "Change Password"}
        </Button>
      </form>
    </div>
  );
};

export default ChangePassword;
