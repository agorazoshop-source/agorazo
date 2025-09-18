"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

interface RazorpayPaymentProps {
  amount: number;
  orderId: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function RazorpayPayment({
  amount,
  orderId,
  onSuccess,
  onError,
  disabled = false,
  className = "",
  children,
}: RazorpayPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    // Check if Razorpay script is already loaded
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      setIsScriptLoaded(true);
    }
  }, []);

  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
  };

  // Auto-trigger payment when component is ready
  useEffect(() => {
    if (isScriptLoaded && !isLoading && !disabled && amount && orderId) {
      console.log("🚀 Auto-triggering Razorpay payment...");
      // Small delay to ensure script is fully loaded
      setTimeout(() => {
        handlePayment();
      }, 100);
    }
  }, [isScriptLoaded, isLoading, disabled, amount, orderId]);

  const handlePayment = async () => {
    console.log("🚀 Starting payment process...");
    console.log("📊 Payment details:", { amount, orderId, user: !!user });

    if (!isScriptLoaded) {
      console.log("❌ Script not loaded");
      onError("Payment system is not ready. Please try again.");
      return;
    }

    if (!user) {
      console.log("❌ User not authenticated");
      onError("Please sign in to continue with payment.");
      return;
    }

    setIsLoading(true);
    console.log("⏳ Loading state set to true");

    try {
      console.log("🔄 Creating Razorpay order...");
      // Create Razorpay order
      const orderResponse = await fetch("/api/payments/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: "INR",
          orderId: orderId,
        }),
      });

      console.log("📡 Order response status:", orderResponse.status);
      const orderData = await orderResponse.json();
      console.log("📦 Order data:", orderData);

      if (!orderResponse.ok) {
        console.log("❌ Order creation failed:", orderData);
        throw new Error(orderData.message || "Failed to create payment order");
      }

      console.log(
        "🔑 Razorpay key:",
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? "Present" : "Missing"
      );
      console.log("💰 Amount:", orderData.amount);
      console.log("🆔 Order ID:", orderData.orderId);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Agorazo",
        description: "Payment for your order",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/verifyOrder", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: orderData.orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderId,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              toast.success("Payment successful!");
              onSuccess(response.razorpay_payment_id);
            } else {
              throw new Error(
                verifyData.error || "Payment verification failed"
              );
            }
          } catch (error: any) {
            console.error("Payment verification error:", error);
            onError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.fullName || user.firstName || "Customer",
          email: user.primaryEmailAddress?.emailAddress || "",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      console.log("🎯 Creating Razorpay instance...");
      console.log("⚙️ Options:", options);

      const razorpay = new (window as any).Razorpay(options);
      console.log("✅ Razorpay instance created");

      razorpay.on("payment.failed", function (response: any) {
        console.error("❌ Payment failed:", response.error);
        onError(
          `Payment failed: ${response.error.description || "Unknown error"}`
        );
        setIsLoading(false);
      });

      console.log("🚀 Opening Razorpay modal...");
      razorpay.open();
      console.log("🎉 Razorpay modal opened");
    } catch (error: any) {
      console.error("Payment initiation error:", error);
      onError(error.message || "Payment failed. Please try again.");
      setIsLoading(false);
    }
  };

  console.log("🎨 RazorpayPayment render:", {
    isLoading,
    disabled,
    isScriptLoaded,
    amount,
    orderId,
  });

  return (
    <>
      <button
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          disabled || isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
        } ${className}`}
        onClick={handlePayment}
        disabled={disabled || isLoading || !isScriptLoaded}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          children || "Pay with Razorpay"
        )}
      </button>

      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={handleScriptLoad}
      />
    </>
  );
}
