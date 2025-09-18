"use client";

import React, { useState, useEffect } from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import PermanentSearchBar from "./PermanentSearchBar";
import HeaderIconWithText from "./HeaderIconWithText";
import CategoriesDropdown from "./CategoriesDropdown";
import SignIn from "./SignIn";
import MobileMenu from "./MobileMenu";
import WhatsAppLink from "./WhatsAppLink";
import { useUser } from "@clerk/nextjs";
import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Logs, User, ShoppingBag, Heart } from "lucide-react";
import { siteConfig } from "@/constants/data";
import useStore from "@/store";
import { usePathname } from "next/navigation";

const Header = () => {
  const { user } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const { items, favoriteProduct } = useStore();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = user && items?.length ? items.length : 0;
  const wishlistCount =
    user && favoriteProduct?.length ? favoriteProduct.length : 0;

  // Pages where first section should be hidden
  const hideFirstSection =
    pathname?.startsWith("/videos") ||
    pathname?.startsWith("/video/") ||
    pathname?.startsWith("/product/");

  return (
    <>
      {/* Main header - First row - Scrolls normally with page (Desktop only) */}
      {!hideFirstSection && (
        <div className="hidden md:block bg-white border-b border-gray-100 relative z-[80]">
          <div className={`py-2 lg:py-3 transition-all duration-300`}>
            <Container>
              <div className="flex items-center justify-between">
                {/* Left side - Logo */}
                <div className="block">
                  <Logo />
                </div>

                {/* Center - Search Bar */}
                <div className="flex-1 flex justify-center px-4">
                  <div className="w-full max-w-2xl">
                    <PermanentSearchBar />
                  </div>
                </div>

                {/* Right side - Icons */}
                <div className="flex items-center gap-4">
                  {user ? (
                    <>
                      <HeaderIconWithText
                        href="/wishlist"
                        icon={<Heart className="w-6 h-6" />}
                        text="Favorites"
                        count={wishlistCount}
                      />
                      <HeaderIconWithText
                        href="/cart"
                        icon={<ShoppingBag className="w-6 h-6" />}
                        text="My Cart"
                        count={cartCount}
                      />
                      <ClerkLoaded>
                        <SignedIn>
                          <UserButton />
                        </SignedIn>
                      </ClerkLoaded>
                    </>
                  ) : (
                    <>
                      <HeaderIconWithText
                        href="/wishlist"
                        icon={<Heart className="w-6 h-6" />}
                        text="Favorites"
                      />
                      <HeaderIconWithText
                        href="/cart"
                        icon={<ShoppingBag className="w-6 h-6" />}
                        text="My Cart"
                      />
                      <SignIn />
                    </>
                  )}
                </div>
              </div>
            </Container>
          </div>
        </div>
      )}

      {/* Mobile Header - Complete header for mobile (unchanged behavior) */}
      {!hideFirstSection && (
        <header className="md:hidden sticky top-0 z-[80] bg-white border-b border-gray-100">
          <div className={`py-2 lg:py-3 transition-all duration-300`}>
            <Container>
              {/* First row: Logo left, Menu and Sign-in right */}
              <div className="flex items-center justify-between mb-3">
                {/* Left side - Logo */}
                <div className="flex items-center">
                  <Logo />
                </div>

                {/* Right side - Menu and Sign-in */}
                <div className="flex items-center gap-3">
                  <MobileMenu />
                  <ClerkLoaded>
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                    {!user && <SignIn />}
                  </ClerkLoaded>
                </div>
              </div>

              {/* Second row: Full-width search bar */}
              <div className="w-full">
                <PermanentSearchBar />
              </div>
            </Container>
          </div>
        </header>
      )}

      {/* Header Menu - Second row - Sticky at top (Desktop only) */}
      <div
        className={`hidden md:block py-1 border-t border-gray-100 transition-all duration-300 sticky top-0 z-[80] bg-white ${isScrolled ? "shadow-sm" : ""}`}
      >
        <Container>
          <div className="hidden md:block">
            <div className="flex items-center justify-between gap-4">
              {/* Left side - Categories Dropdown */}
              <div className="flex-shrink-0">
                <CategoriesDropdown />
              </div>

              {/* Center - Header Menu */}
              <div className="flex-1 flex justify-center">
                <HeaderMenu />
              </div>

              {/* Right side - Contact Info */}
              <div className="flex-shrink-0">
                <a
                  href={`https://wa.me/${siteConfig.contact.phone.replace(/\D/g, "")}?text=Hi! I need help with my order.`}
                  className="bg-gray-50 rounded-lg px-4 py-2 flex items-center gap-3 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                >
                  {/* WhatsApp Icon */}
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                    <svg
                      className="w-4 h-4 text-green-600"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                    </svg>
                  </div>

                  {/* Contact Text */}
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-600 font-medium">
                      Need help? Contact us:
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {siteConfig.contact.phone}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
