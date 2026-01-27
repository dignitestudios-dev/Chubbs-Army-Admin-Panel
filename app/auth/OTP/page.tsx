"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ErrorToast, SuccessToast } from "@/components/Toaster";
import axios from "@/axios";
import { getErrorMessage } from "@/init/appValues";

const OTPVerification = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("forgotEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      // sirf 0-9 digit allow
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // auto-focus next input
      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.some((digit) => digit === "")) {
      ErrorToast("Please enter complete OTP.");
      return;
    }
    const otpValue = parseInt(otp.join(""), 10);
    setLoading(true);
    try {
      const response = await axios.post("/auth/verify-forgot-password", {
        otp: otpValue.toString(),
        email: email,
        type: "EMAIL",
      });
      if (response.status === 200) {
        SuccessToast("OTP verified successfully");
        router.push("/auth/changepassword");
      }
    } catch (error) {
      ErrorToast(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>
      <p className="mb-6">
        Please enter the 4-digit OTP sent to your email/phone
      </p>

      <form onSubmit={handleSubmit} className=" mb-6">
        <div className="flex gap-6 justify-center items-center mb-6">
          {otp.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              className="w-16 text-center text-xl"
            />
          ))}
        </div>
        <div>
          <Button disabled={loading} type="submit" className="w-full">
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OTPVerification;
