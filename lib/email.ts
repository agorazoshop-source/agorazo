import nodemailer from 'nodemailer';

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
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
    };
    quantity: number;
  }>;
}

export const sendOrderConfirmationEmail = async ({
  orderId,
  customerName,
  customerEmail,
  totalAmount,
  items
}: OrderEmailProps) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email credentials not configured');
    return { success: false, error: 'Email service not configured' };
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
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .order-details { background: #f9f9f9; padding: 20px; border-radius: 5px; }
              .item { margin: 10px 0; padding: 10px; border-bottom: 1px solid #eee; }
              .total { font-size: 18px; margin-top: 20px; text-align: right; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thank you for your order, ${customerName}!</h1>
                <p>Your order #${orderId} has been confirmed.</p>
              </div>
              
              <div class="order-details">
                <h2>Order Details:</h2>
                ${items.map(item => `
                  <div class="item">
                    <strong>${item.product.name}</strong> x ${item.quantity}<br>
                    Price: ₹${item.product.price}<br>
                    ${item.product.productLink ? `<a href="${item.product.productLink}" target="_blank" style="color: #007bff; text-decoration: none;">View Product →</a>` : ''}
                  </div>
                `).join('')}
                
                <div class="total">
                  <strong>Total Amount: ₹${totalAmount}</strong>
                </div>
              </div>
              
              <p>We'll notify you when your order ships.</p>
              
              <p>Thank you for shopping with us!</p>
            </div>
          </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);

    return { success: true, data: { messageId: result.messageId } };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error };
  }
}