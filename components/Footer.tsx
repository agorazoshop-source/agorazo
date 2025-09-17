import React from "react";
import Container from "./Container";
import FooterTop from "./FooterTop";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import { SubText, SubTitle } from "./ui/text";
import { quickLinksData, siteConfig } from "@/constants/data";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Phone, Mail, MessageCircle } from "lucide-react";
import WhatsAppLink from "./WhatsAppLink";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <Container>
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="text-2xl font-bold text-white">
              {siteConfig.name}
            </div>
            <SocialMedia
              className="text-gray-400"
              iconClassName="border-gray-600 hover:border-shop_light_green hover:text-shop_light_green bg-gray-800 hover:bg-shop_light_green"
              tooltipClassName="bg-gray-800 text-white"
            />
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">WhatsApp us 24/7</p>
              <WhatsAppLink
                phoneNumber={siteConfig.contact.phone}
                message="Hi! I need assistance with your services."
                className="flex items-center gap-3 hover:opacity-80"
              >
                <MessageCircle className="w-5 h-5 text-green-500" />
                <span className="text-xl font-semibold">{siteConfig.contact.phone}</span>
              </WhatsAppLink>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>{siteConfig.contact.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-300">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinksData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={item?.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Links */}
            {/* <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-300">Other Links</h3>
              <ul className="space-y-3">
                <li><Link href="/offers" className="text-gray-400 hover:text-white transition-colors duration-200">Offers</Link></li>
                <li><Link href="/account" className="text-gray-400 hover:text-white transition-colors duration-200">Membership</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">Support</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors duration-200">Landing Pages</Link></li>
              </ul>
            </div> */}

          {/* Newsletter Section */}
          {/* <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-300">Newsletter</h3>
            <p className="text-gray-400 text-sm">
              Subscribe to our newsletter to receive updates and exclusive offers
            </p>
            <form className="space-y-3">
              <Input 
                placeholder="Enter your email" 
                type="email" 
                required 
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-shop_light_green"
              />
              <Button className="w-full bg-shop_light_green hover:bg-shop_dark_green">
                Subscribe
              </Button>
            </form>
          </div> */}
        </div>

        {/* Bottom Footer */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              {siteConfig.legal?.copyright || `© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.`}
            </div>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
