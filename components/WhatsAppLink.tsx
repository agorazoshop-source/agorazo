import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface WhatsAppLinkProps {
  phoneNumber: string;
  message?: string;
  children: React.ReactNode;
  className?: string;
}

const WhatsAppLink: React.FC<WhatsAppLinkProps> = ({ 
  phoneNumber, 
  message = '', 
  children, 
  className 
}) => {
  // Remove any spaces, dashes, or other formatting from phone number
  const cleanPhoneNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${cleanPhoneNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

  return (
    <Link 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn("hover:opacity-80 transition-opacity", className)}
    >
      {children}
    </Link>
  );
};

export default WhatsAppLink;