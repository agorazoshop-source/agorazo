"use client";

import React from "react";
import { Phone } from "lucide-react";
import WhatsAppLink from "./WhatsAppLink";
import { siteConfig } from "@/constants/data";

const WhatsAppContact = () => {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
      <Phone className="w-4 h-4 text-shop_light_green" />
      <div className="text-sm">
        <div className="text-gray-600">Need help? Call us:</div>
        <WhatsAppLink
          phoneNumber={siteConfig.contact.phone}
          message="Hi! I need help with my order."
          className="text-shop_light_green hover:text-shop_dark_green font-semibold"
        >
          {siteConfig.contact.phone}
        </WhatsAppLink>
      </div>
    </div>
  );
};

export default WhatsAppContact;
