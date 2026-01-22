"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { forgotPasswordValue } from "@/init/appValues";
import { forgotPasswordSchema } from "@/init/appSchema";
import axios from "../../../axios";
import { AxiosError } from "axios";
import { ErrorToast, SuccessToast } from "@/components/Toaster";

const ForgetPassword = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: forgotPasswordValue,
      validationSchema: forgotPasswordSchema,
      validateOnChange: true,
      validateOnBlur: true,

      onSubmit: async (values) => {
        const payload = {
          email: values.email,
        };

        try {
          setLoading(true);
          const response = await axios.post<SignInResponse>(
            "/auth/forgot-password",
            payload,
          );

          if (response.status === 200) {
            const data = response.data.data;
            SuccessToast("OTP sent to your email");
            // dispatch(login());
            router.push("/auth/OTP");
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
          Forgot Password
        </h2>
        <p className="text-gray-600">Enter your email to receive a reset OTP</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.email && touched.email && (
            <p className="text-red-600 text-sm">{errors.email}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          {loading ? "Sending OTP..." : "Send OTP"}
        </Button>
      </form>
    </div>
  );
};

export default ForgetPassword;
