"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ErrorToast } from "@/components/Toaster";
import axios from "@/axios";
import { getErrorMessage } from "@/init/appValues";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const router = useRouter();

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
    router.push("/auth/changepassword");
    if (otp.some((digit) => digit === "")) {
      ErrorToast("Please enter complete OTP.");
      return;
    }
    const otpValue = parseInt(otp.join(""), 10);

    try {
      const response = await axios.post("/auth/verifyOTP", {
        otp: otpValue,
        type: "EMAIL",
        isDeleteAccountPurpose: false,
      });
      if (response.status === 200) {
        const data = response?.data?.data;
      }
    } catch (error) {
      ErrorToast(getErrorMessage(error));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>
      <p className="mb-6">
        Please enter the 4-digit OTP sent to your email/phone
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex gap-6 mb-6 justify-center items-center"
      >
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
      </form>

      <Button type="button" onClick={handleSubmit} className="w-full">
        Verify OTP
      </Button>
    </div>
  );
};

export default OTPVerification;
