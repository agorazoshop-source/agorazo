"use client";

import { useEffect } from "react";
import { trackLead } from "@/lib/facebook-pixel";

/**
 * Component to track contact form submissions with Facebook Pixel
 */
export default function ContactFormTracker() {
  useEffect(() => {
    // Track contact page visit
    trackLead("contact_page");
  }, []);

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          // Add form submission tracking
          document.addEventListener('DOMContentLoaded', function() {
            const form = document.querySelector('form');
            if (form) {
              form.addEventListener('submit', function() {
                if (typeof window !== 'undefined' && window.fbq) {
                  window.fbq('track', 'Lead', {
                    content_name: 'contact_form_submission',
                    content_type: 'lead'
                  });
                }
              });
            }
          });
        `,
      }}
    />
  );
}
