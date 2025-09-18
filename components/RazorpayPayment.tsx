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
      // Small delay to ensure script is fully loaded
      setTimeout(() => {
        handlePayment();
      }, 100);
    }
  }, [isScriptLoaded, isLoading, disabled, amount, orderId]);

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      onError("Payment system is not ready. Please try again.");
      return;
    }

    if (!user) {
      onError("Please sign in to continue with payment.");
      return;
    }

    setIsLoading(true);

    try {
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

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || "Failed to create payment order");
      }

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

      const razorpay = new (window as any).Razorpay(options);

      razorpay.on("payment.failed", function (response: any) {
        onError(
          `Payment failed: ${response.error.description || "Unknown error"}`
        );
        setIsLoading(false);
      });

      razorpay.open();
    } catch (error: any) {
      onError(error.message || "Payment failed. Please try again.");
      setIsLoading(false);
    }
  };

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
