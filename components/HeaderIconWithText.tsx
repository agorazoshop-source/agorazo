"use client";

import Link from "next/link";
import React from "react";

interface HeaderIconWithTextProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  count?: number;
  className?: string;
}

const HeaderIconWithText: React.FC<HeaderIconWithTextProps> = ({
  href,
  icon,
  text,
  count,
  className = "",
}) => {
  return (
    <Link
      href={href}
      className={`group flex flex-col items-center gap-1 hover:text-shop_light_green transition-colors duration-200 ${className}`}
    >
      <div className="relative">
        {icon}
        {count !== undefined && count > 0 && (
          <span className="absolute -top-1 -right-1 bg-shop_dark_green text-white h-4 w-4 rounded-full text-xs font-semibold flex items-center justify-center">
            {count}
          </span>
        )}
      </div>
      <span className="text-xs font-medium text-gray-700 group-hover:text-shop_light_green">
        {text}
      </span>
    </Link>
  );
};

export default HeaderIconWithText;
