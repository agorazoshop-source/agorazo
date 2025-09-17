import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import SignIn from "./SignIn";
import MobileMenu from "./MobileMenu";
import WhatsAppLink from "./WhatsAppLink";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Logs, Phone, User } from "lucide-react";
import { getMyOrders } from "@/sanity/queries";
import { siteConfig } from "@/constants/data";

const Header = async () => {
  const user = await currentUser();
  const { userId } = await auth();
  let orders = null;
  if (userId) {
    orders = await getMyOrders(userId);
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {/* Main header */}
      <div className="py-4">
        <Container>
          <div className="flex items-center gap-4">
            {/* Logo section */}
            <div className="flex items-center gap-2">
              <MobileMenu />
              <Logo />
            </div>

            {/* Search bar - takes most of the space */}
            <div className="flex-1 hidden md:flex items-center gap-4">
              <SearchBar />
              {/* Rectangle box after search bar */}
              <WhatsAppLink 
                phoneNumber={siteConfig.contact.phone}
                message="Hi! I need help with my order."
                className="bg-shop_light_green text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-green-600 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="w-4 h-4" />
                  <span>Need help? Call us:</span>
                </div>
                <div className="text-center font-semibold">
                  {siteConfig.contact.phone}
                </div>
              </WhatsAppLink>
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                <CartIcon />
                <FavoriteButton />

                {user && (
                  <>
                    <Link
                      href={"/account"}
                      className="group relative hover:text-shop_light_green hoverEffect"
                      title="My Account"
                    >
                      <User />
                    </Link>
                    <Link
                      href={"/orders"}
                      className="group relative hover:text-shop_light_green hoverEffect"
                      title="My Orders"
                    >
                      <Logs />
                      <span className="absolute -top-1 -right-1 bg-shop_btn_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                        {orders?.length ? orders?.length : 0}
                      </span>
                    </Link>
                  </>
                )}

                <ClerkLoaded>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                  {!user && <SignIn />}
                </ClerkLoaded>
              </div>

              {/* Mobile icons */}
              <div className="md:hidden flex items-center gap-3">
                <CartIcon />
                {user && (
                  <Link
                    href={"/account"}
                    className="group relative hover:text-shop_light_green hoverEffect"
                    title="My Account"
                  >
                    <User />
                  </Link>
                )}
                <ClerkLoaded>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                  {!user && <SignIn />}
                </ClerkLoaded>
              </div>
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="md:hidden mt-4">
            <SearchBar />
          </div>

          {/* Navigation menu */}
          <div className="hidden md:block mt-4">
            <HeaderMenu />
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Header;
