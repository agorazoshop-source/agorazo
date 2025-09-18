import nodemailer from "nodemailer";

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface OrderEmailProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  items: Array<{
    product: {
      name: string;
      price: number;
      productLink?: string;
      slug?: string;
    };
    quantity: number;
    size?: string;
  }>;
  orderStatus?: string;
}

export const sendOrderConfirmationEmail = async ({
  orderId,
  customerName,
  customerEmail,
  totalAmount,
  items,
  orderStatus = "confirmed",
}: OrderEmailProps) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Email credentials not configured");
    return { success: false, error: "Email service not configured" };
  }

  try {
    console.log("Sending email to", customerEmail, "using Gmail SMTP");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: `Order Confirmation #${orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; background: #f8f9fa; padding: 20px; border-radius: 8px; }
              .order-info { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
              .order-items { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
              .item { margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background: white; display: flex; align-items: center; }
              .item-image { width: 60px; height: 60px; margin-right: 15px; border-radius: 5px; }
              .item-details { flex: 1; }
              .product-name { font-weight: bold; font-size: 16px; color: #333; margin-bottom: 5px; }
              .product-price { font-weight: bold; color: #28a745; font-size: 18px; }
              .product-link { 
                display: inline-block; 
                background: #28a745; 
                color: white; 
                padding: 8px 16px; 
                text-decoration: none; 
                border-radius: 4px; 
                margin-top: 10px; 
                font-size: 14px;
              }
              .product-link:hover { background: #218838; }
              .total-section { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
              .total-amount { font-size: 24px; font-weight: bold; color: #333; }
              .footer { text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="color: #28a745; margin: 0;">🎉 Order Confirmed!</h1>
                <h2>Thank you for your order, ${customerName}!</h2>
                <p style="font-size: 18px; margin: 10px 0;"><strong>Order #${orderId}</strong></p>
                <p style="color: #666;">Status: ${orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}</p>
              </div>
              
              <div class="order-info">
                <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">📋 Order Information</h2>
                <div style="line-height: 1.8;">
                  <strong>Customer:</strong> ${customerName}<br>
                  <strong>Email:</strong> ${customerEmail}<br>
                  <strong>Date:</strong> ${new Date().toLocaleDateString("en-GB")}
                </div>
              </div>
              
              <div class="order-items">
                <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">📦 Order Items</h2>
                ${items
                  .map(
                    (item) => `
                  <div class="item">
                    <div class="item-image" style="background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #666;">
                      📦
                    </div>
                    <div class="item-details">
                      <div class="product-name">${item.product.name}</div>
                      <div class="product-price">₹${item.product.price.toFixed(2)}</div>
                      ${item.product.productLink ? `<a href="${item.product.productLink}" target="_blank" class="product-link">🔗 Product Link</a>` : ""}
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
              
              <div class="total-section">
                <div style="font-size: 18px; margin-bottom: 10px;">Total Amount</div>
                <div class="total-amount">₹${totalAmount.toFixed(2)}</div>
              </div>
              
              <div class="footer">
                <p style="margin: 10px 0; font-weight: bold;">Thank you for shopping with us! 🛍️</p>
                <p style="margin: 10px 0;">Have issues with order? Contact us</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);

    return { success: true, data: { messageId: result.messageId } };
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return { success: false, error };
  }
};
