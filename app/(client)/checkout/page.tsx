"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CreditCard, Wallet, Tag, X } from "lucide-react";
import AddressSelector from "@/components/address/AddressSelector";
import { UserAddress } from "@/types";
import useStore, { CartItem } from "@/store";
import PriceFormatter from "@/components/PriceFormatter";
import CheckoutSkeleton from "@/components/skeletons/CheckoutSkeleton";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import { generateOrderData } from "@/lib/utils/orderUtils";
import RazorpayPayment from "@/components/RazorpayPayment";

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

type PaymentMethod = "cod" | "prepaid" | "razorpay";

interface AppliedCoupon {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  value: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const groupedItems = useStore((state) =>
    state.getGroupedItems()
  ) as CartItem[];
  const isEmpty = useStore((state) => state.items.length === 0);
  const subtotal = useStore((state) => state.getTotalPrice());
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");
  const resetCart = useStore((state) => state.resetCart);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null
  );
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  useEffect(() => {
    // Redirect to cart if cart is empty, but not if payment was successful
    if (isLoaded && isEmpty && !isPaymentSuccess) {
      router.push("/cart");
    }
  }, [isLoaded, isEmpty, router, isPaymentSuccess]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsCouponLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponCode,
          cartAmount: subtotal,
          items: groupedItems.map((item) => ({
            ...item,
            product: {
              ...item.product,
              category: item.product.categories?.[0] || {
                _ref: "",
                _type: "reference",
              },
            },
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon(data);
      toast.success("Coupon applied successfully!");
      setCouponCode("");
    } catch (error) {
      setError("Failed to apply coupon");
      setAppliedCoupon(null);
    } finally {
      setIsCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setError(null);
  };

  const createOrderForPayment = async () => {
    if (!user) {
      setError("User not authenticated");
      return null;
    }

    try {
      const orderPayload = generateOrderData({
        user,
        selectedAddress,
        groupedItems,
        subtotal,
        appliedCoupon,
        paymentMethod: "razorpay",
      });

      const orderResponse = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const orderResult = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderResult.error || "Failed to create order");
      }

      if (!orderResult.success || !orderResult.orderId) {
        throw new Error("Invalid order response");
      }

      return orderResult.orderId;
    } catch (error: any) {
      setError(error.message || "Failed to create order");
      return null;
    }
  };

  const handleRazorpaySuccess = async (paymentId: string) => {
    try {
      // Set payment success state before clearing cart to prevent cart redirection
      setIsPaymentSuccess(true);
      // Clear cart and redirect to success page
      resetCart();
      toast.success("Payment successful! Order confirmed.");
      router.push(
        `/success?order_id=${createdOrderId}&payment_method=razorpay&payment_id=${paymentId}`
      );
    } catch (error: any) {
      setError(
        "Payment successful but there was an error processing your order. Please contact support."
      );
    }
  };

  const handleRazorpayError = (error: string) => {
    setError(error);
    setIsProcessing(false);
  };

  const handleCheckout = async () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // For zero amount orders, handle directly
      if (finalAmount === 0) {
        const orderId = await createOrderForPayment();
        if (orderId) {
          // Update order status to success for zero amount
          const updateResponse = await fetch(`/api/orders/update/${orderId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentStatus: "paid",
              orderStatus: "confirmed",
            }),
          });

          if (updateResponse.ok) {
            setIsPaymentSuccess(true);
            resetCart();
            toast.success("Order confirmed successfully!");
            router.push(`/success?order_id=${orderId}&payment_method=razorpay`);
          } else {
            throw new Error("Failed to update order status");
          }
        }
        return;
      }

      // For non-zero amount, create order and set it for Razorpay payment
      const orderId = await createOrderForPayment();
      if (orderId) {
        // console.log("✅ Order created, setting createdOrderId:", orderId);
        setCreatedOrderId(orderId);
        setIsProcessing(false); // Reset processing state so RazorpayPayment can be clicked
        // console.log(
        //   "🔄 Processing state reset, RazorpayPayment should be clickable now"
        // );
        // The RazorpayPayment component will handle the payment
      }
    } catch (error: any) {
      setError(
        error.message ||
          "An error occurred while processing your order. Please try again."
      );
      setIsProcessing(false);
    }
  };

  // Commented out PhonePe integration - keeping for reference
  /*
  const handleCheckoutPhonePe = async () => {
    // if (!selectedAddress) {
    //   setError("Please select a delivery address");
    //   return;
    // }

    if (!user) {
      router.push("/sign-in");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create order first
      const orderPayload = generateOrderData({
        user,
        selectedAddress,
        groupedItems,
        subtotal,
        appliedCoupon,
        paymentMethod: 'phonepe'
      });

      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const orderResult = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderResult.error || 'Failed to create order');
      }

      if (!orderResult.success || !orderResult.orderId) {
        throw new Error('Invalid order response');
      }

      // Store orderId in localStorage before initiating payment
      localStorage.setItem('pending_order_id', orderResult.orderId);

      // For zero amount orders, skip payment and mark as successful
      if (finalAmount === 0) {
        try {
          // Update order status to success
          const updateResponse = await fetch(`/api/orders/update/${orderResult.orderId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentStatus: 'success',
              orderStatus: 'confirmed'
            }),
          });

          const updateResult = await updateResponse.json();

          if (!updateResponse.ok) {
            throw new Error(updateResult.error || 'Failed to update order status');
          }

          resetCart();
          if (updateResult.emailStatus === 'success') {
            toast.success('Order confirmation email sent successfully!', {
              duration: 5000,
              position: 'top-right',
            });
          }
          router.push(`/success?order_id=${orderResult.orderId}&payment_method=online`);
          return;
        } catch (error: any) {
          console.error('Error updating order:', error);
          throw new Error('Failed to update order status: ' + (error.message || 'Unknown error'));
        }
      }

      // Initiate PhonePe payment for non-zero amount
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalAmount,
          orderId: orderResult.orderId
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResponse.ok) {
        // Remove stored order ID if payment initiation fails
        localStorage.removeItem('pending_order_id');
        throw new Error(paymentResult.error || 'Payment initiation failed');
      }

      if (paymentResult.redirectUrl) {
        window.location.href = paymentResult.redirectUrl;
      } else {
        throw new Error('No redirect URL received');
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      setError(error.message || "An error occurred while processing your order. Please try again.");
      setIsProcessing(false);
    }
  };
  */

  if (!isLoaded || isEmpty) {
    return (
      <Container>
        <CheckoutSkeleton />
      </Container>
    );
  }

  const finalAmount = subtotal - (appliedCoupon?.discount || 0);

  return (
    <Container>
      <div className="py-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-2xl font-semibold">Checkout</h1>
          <div className="h-6 w-px bg-gray-200" />
          <p className="text-gray-500">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Address selection */}
          <div className="lg:col-span-2">
            {/* <div className="bg-white rounded-lg shadow-sm p-6">
              <AddressSelector 
                onSelectAddress={handleSelectAddress}
                selectedAddress={selectedAddress}
                showAddButton={true}
                isCheckout={true}
              />
            </div> */}

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border ${
                    paymentMethod === "razorpay"
                      ? "border-shop_dark_green bg-shop_dark_green/5"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard
                      className={
                        paymentMethod === "razorpay"
                          ? "text-shop_dark_green"
                          : "text-gray-500"
                      }
                    />
                    <div className="text-left">
                      <p className="font-medium">Pay Online (Razorpay)</p>
                      <p className="text-sm text-gray-500">
                        Pay securely with credit/debit card, UPI, net banking
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-6 h-6 border-2 rounded-full border-gray-300">
                    {paymentMethod === "razorpay" && (
                      <div className="w-3 h-3 bg-shop_dark_green rounded-full" />
                    )}
                  </div>
                </button>

                {/* Cash on Delivery option hidden */}
                {/* <button
                  onClick={() => setPaymentMethod('cod')}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border ${
                    paymentMethod === 'cod' 
                      ? 'border-shop_dark_green bg-shop_dark_green/5' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className={paymentMethod === 'cod' ? 'text-shop_dark_green' : 'text-gray-500'} />
                    <div className="text-left">
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when you receive your order</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-6 h-6 border-2 rounded-full border-gray-300">
                    {paymentMethod === 'cod' && (
                      <div className="w-3 h-3 bg-shop_dark_green rounded-full" />
                    )}
                  </div>
                </button> */}
              </div>
            </div>
          </div>

          {/* Right column - Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>

              <div className="space-y-4 mb-6">
                {groupedItems.map((item: CartItem, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                      {item.product.images?.[0] && (
                        <Image
                          src={urlFor(item.product.images[0]).url()}
                          alt={item.product.name || "Product image"}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{item.product.name}</h4>
                        </div>
                        <PriceFormatter
                          amount={item.product.price || 0}
                          className="font-medium"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="border-t border-b py-4 mb-4">
                {!appliedCoupon ? (
                  <div className="space-y-2">
                    <p className="font-medium flex items-center gap-2">
                      <Tag size={16} />
                      Apply Coupon
                    </p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={isCouponLoading || !couponCode.trim()}
                      >
                        {isCouponLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 p-2 rounded-md">
                    <div>
                      <p className="font-medium text-green-700 flex items-center gap-2">
                        <Tag size={16} />
                        {appliedCoupon.code}
                      </p>
                      <p className="text-sm text-green-600">
                        {appliedCoupon.type === "percentage"
                          ? `${appliedCoupon.value}% off`
                          : `₹${appliedCoupon.value} off`}
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <PriceFormatter amount={subtotal} />
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>
                      -<PriceFormatter amount={appliedCoupon.discount} />
                    </span>
                  </div>
                )}

                {/* <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">Free</span>
                </div> */}

                <div className="flex justify-between font-semibold text-lg border-t pt-3">
                  <span>Total</span>
                  <PriceFormatter amount={finalAmount} className="text-lg" />
                </div>
              </div>

              {paymentMethod === "razorpay" && createdOrderId ? (
                <RazorpayPayment
                  amount={finalAmount}
                  orderId={createdOrderId}
                  onSuccess={handleRazorpaySuccess}
                  onError={handleRazorpayError}
                  disabled={isProcessing}
                  className="w-full mt-6"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Preparing Razorpay...
                    </>
                  ) : (
                    "Opening Razorpay..."
                  )}
                </RazorpayPayment>
              ) : (
                <Button
                  className="w-full mt-6"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isProcessing /* || !selectedAddress */}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : paymentMethod === "cod" ? (
                    "Place Order"
                  ) : (
                    "Proceed to Payment"
                  )}
                </Button>
              )}

              {/* {!selectedAddress && (
                <p className="text-sm text-gray-500 mt-3 text-center">
                  Please select a delivery address to continue
                </p>
              )} */}

              <p className="text-xs text-gray-500 mt-4 text-center">
                By proceeding, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
