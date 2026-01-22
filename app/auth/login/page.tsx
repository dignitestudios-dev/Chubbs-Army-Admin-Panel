"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { login } from "@/lib/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";
import { signInValues } from "@/init/appValues";
import { signInSchema } from "@/init/appSchema";
import axios from "../../../axios";
import { AxiosError } from "axios";
import { ErrorToast } from "@/components/Toaster";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik<SignInFormValues>({
      initialValues: signInValues,
      validationSchema: signInSchema,
      validateOnChange: true,
      validateOnBlur: true,

      onSubmit: async (values: SignInFormValues) => {
        const payload = {
          email: values.email,
          password: values.password,
          role: "ADMIN" as const,
          deviceName: "Web",
          deviceType: "POSTMAN",
        };

        try {
          setLoading(true);

          const response = await axios.post<SignInResponse>(
            "/auth/login",
            payload,
          );

          if (response.status === 200) {
            const data = response.data.data;

            dispatch(login(data));
            // router.push("/dashboard");
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your account</p>
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

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {errors.password && touched.password && (
          <p className="text-red-600 text-sm">{errors.password}</p>
        )}

        <div className="mt-6 text-end">
          <Link href="/auth/forgot">
            <span className="text-sm text-primary hover:underline">
              Forgot your password?
            </span>
          </Link>
        </div>

        <Button type="submit" className="w-full">
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
