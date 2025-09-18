"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, Package } from "lucide-react";
import useStore from "@/store";
import { useUser, SignInButton } from "@clerk/nextjs";

const MobileBottomNav = () => {
  const pathname = usePathname();
  const { items } = useStore();
  const { user } = useUser();

  const cartCount = user && items?.length ? items.length : 0;

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
      requiresAuth: false,
    },
    {
      name: "Products",
      href: "/products",
      icon: ShoppingBag,
      isActive:
        pathname.startsWith("/products") || pathname.startsWith("/product"),
      requiresAuth: false,
    },
    {
      name: "Cart",
      href: "/cart",
      icon: ShoppingCart,
      isActive: pathname === "/cart",
      badge: cartCount > 0 ? cartCount : null,
      requiresAuth: true,
    },
    {
      name: "Orders",
      href: "/orders",
      icon: Package,
      isActive: pathname === "/orders",
      requiresAuth: true,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          // If item requires auth and user is not logged in, show sign-in modal
          if (item.requiresAuth && !user) {
            return (
              <SignInButton key={item.name} mode="modal">
                <button
                  className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 transition-colors duration-200 ${
                    item.isActive
                      ? "text-shop_light_green"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-6 h-6" />
                    {item.badge && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium mt-1 truncate">
                    {item.name}
                  </span>
                </button>
              </SignInButton>
            );
          }

          // Regular navigation for public routes or authenticated users
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 transition-colors duration-200 ${
                item.isActive
                  ? "text-shop_light_green"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium mt-1 truncate">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
