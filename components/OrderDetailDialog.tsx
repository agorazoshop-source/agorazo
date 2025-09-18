"use client";

import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";
import { HelpCircle } from "lucide-react";

interface OrderDetailsDialogProps {
  order: MY_ORDERS_QUERYResult[number] | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  const getOrderStatusDisplay = (order: MY_ORDERS_QUERYResult[number]) => {
    // For digital products, status is based on payment status
    if (order.paymentStatus === "paid") {
      return "Delivered";
    } else if (order.paymentStatus === "failed") {
      return "Cancelled";
    } else {
      return "Pending";
    }
  };

  const getStatusColor = (order: MY_ORDERS_QUERYResult[number]) => {
    // For digital products, color based on payment status
    if (order.paymentStatus === "paid") {
      return "text-green-600";
    } else if (order.paymentStatus === "failed") {
      return "text-red-600";
    } else {
      return "text-yellow-600";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Order Details - {order?.orderNumber}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Order Information</h3>
              <p>
                <span className="font-medium">Customer:</span>{" "}
                {order.customer?.name || "N/A"}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {order.customer?.email || "N/A"}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {order.createdAt &&
                  new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Payment & Order Status */}
            <div className="space-y-2">
              <h3 className="font-semibold">Status Information</h3>
              <p>
                <span className="font-medium">Payment Status:</span>{" "}
                <span
                  className={`capitalize font-medium ${
                    order.paymentStatus === "paid"
                      ? "text-green-600"
                      : order.paymentStatus === "pending"
                        ? "text-yellow-600"
                        : order.paymentStatus === "failed"
                          ? "text-red-600"
                          : "text-gray-600"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </p>
              <p>
                <span className="font-medium">Order Status:</span>{" "}
                <span
                  className={`capitalize font-medium ${getStatusColor(order)}`}
                >
                  {getOrderStatusDisplay(order)}
                </span>
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3">Order Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Product Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.product?.images && item.product.images[0] && (
                          <Image
                            src={urlFor(item.product.images[0]).url()}
                            alt={item.product.name || "Product"}
                            width={50}
                            height={50}
                            className="rounded-md object-cover"
                          />
                        )}
                        <Link
                          href={`/product/${item.product?.slug?.current || "#"}`}
                          className="hover:text-shop_dark_green hover:underline"
                        >
                          {item.product?.name || "Product"}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <PriceFormatter amount={item.price} />
                    </TableCell>
                    <TableCell>
                      {order.paymentStatus === "paid" ? (
                        <div className="space-y-2">
                          {item.product?.productLink ? (
                            <a
                              href={item.product.productLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm font-medium"
                            >
                              <span>🔗</span>
                              Product Link
                            </a>
                          ) : (
                            <span className="text-gray-500 text-sm">
                              Link not available
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm italic">
                          Complete payment to access link
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} className="text-right font-semibold">
                    Total Amount:
                  </TableCell>
                  <TableCell className="font-semibold">
                    <PriceFormatter amount={order.totalAmount} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Contact Support Button */}
          <div className="flex justify-center pt-4 border-t">
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <Link href="/contact">
                <HelpCircle className="h-5 w-5" />
                Have issues with order? Contact us
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
