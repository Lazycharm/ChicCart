import React from 'react';
import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-black text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            Terms & Conditions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            Last updated: January 2024
          </motion.p>
        </div>
      </section>

      <section className="py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 lg:p-12"
        >
          <div className="prose prose-lg max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website.
            </p>

            <h2>2. Use of Website</h2>
            <p>
              You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use of the website. Prohibited activities include:
            </p>
            <ul>
              <li>Conducting any illegal activity</li>
              <li>Attempting to gain unauthorized access</li>
              <li>Transmitting harmful code or malware</li>
              <li>Collecting user information without consent</li>
            </ul>

            <h2>3. Products and Pricing</h2>
            <p>
              We strive to display accurate product information and pricing. However, we reserve the right to:
            </p>
            <ul>
              <li>Correct any errors in product descriptions or pricing</li>
              <li>Cancel orders affected by pricing errors</li>
              <li>Limit quantities available for purchase</li>
              <li>Modify or discontinue products without notice</li>
            </ul>

            <h2>4. Orders and Payment</h2>
            <p>
              When you place an order, you are making an offer to purchase. We may accept or decline this offer. Orders are not confirmed until payment is successfully processed and you receive a confirmation email.
            </p>

            <h2>5. Shipping and Delivery</h2>
            <p>
              Shipping times are estimates and not guaranteed. We are not responsible for delays caused by carriers, customs, or circumstances beyond our control. Risk of loss passes to you upon delivery.
            </p>

            <h2>6. Returns and Refunds</h2>
            <p>
              Please refer to our Return Policy for detailed information about returns, exchanges, and refunds.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              All content on this website, including text, images, logos, and graphics, is protected by copyright and other intellectual property rights. You may not reproduce, distribute, or use this content without our written permission.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of this website or purchase of products.
            </p>

            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this website. Your continued use of the website constitutes acceptance of the updated terms.
            </p>

            <h2>10. Contact Information</h2>
            <p>
              For questions about these Terms & Conditions, please contact us at legal@luxe.com.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}