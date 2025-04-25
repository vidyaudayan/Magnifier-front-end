import React from 'react';
import Navbar from './Navbar';

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-100 min-h-screen ">
      
      <div className="max-w-4xl mx-auto  bg-white shadow-lg rounded-lg p-6 md:p-10">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Web Magnifier: Terms and Conditions</h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Effective Date: [Insert Date] | Last Updated: [Insert Date]
        </p>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Eligibility</h2>
            <p className="text-gray-700 mb-2">1.1. You must be at least 18 years old to create an account and use Web Magnifier.</p>
            <p className="text-gray-700">1.2. By registering, you confirm that all the information provided is accurate and up-to-date.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. User Responsibilities</h2>
            <p className="text-gray-700 mb-2">2.1. Account Security: You are responsible for maintaining the confidentiality of your account credentials.</p>
            <p className="text-gray-700 mb-2">2.2. Content Standards:</p>
            <ul className="list-disc list-inside text-gray-700">
              <li>Hate speech or incitement of violence.</li>
              <li>Misinformation or fake news.</li>
              <li>Content that violates any applicable laws or regulations.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. Content Ownership and Usage</h2>
            <p className="text-gray-700 mb-2">3.1. User Content: You retain ownership of the content you post. By posting, you grant Web Magnifier a non-exclusive, royalty-free, worldwide license to use, display, and distribute your content.</p>
            <p className="text-gray-700">3.2. Platform Content: All platform content, including designs, logos, and features, is owned by Web Magnifier. You may not reproduce or distribute platform content without permission.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">4. Moderation and Enforcement</h2>
            <p className="text-gray-700 mb-2">4.1. Web Magnifier reserves the right to moderate and review user content to ensure compliance with these terms.</p>
            <p className="text-gray-700">4.2. Violations of these terms may result in warnings, content removal, account suspension, or permanent banning.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">5. Privacy</h2>
            <p className="text-gray-700">5.1. By using Web Magnifier, you consent to the collection, storage, and use of your data as outlined in our Privacy Policy.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">6. Liability and Disclaimers</h2>
            <p className="text-gray-700 mb-2">6.1. No Guarantee of Accuracy: Web Magnifier does not guarantee the accuracy or reliability of user-generated content.</p>
            <p className="text-gray-700">6.2. Limitation of Liability: Web Magnifier is not liable for any damages resulting from your use of the platform.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">7. Payment and Earnings</h2>
            <p className="text-gray-700 mb-2">7.1. Users participating in monetized discussions or content must adhere to platform-specific guidelines for payments and earnings.</p>
            <p className="text-gray-700">7.2. Web Magnifier reserves the right to modify payment structures or terms with prior notice.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">8. Termination</h2>
            <p className="text-gray-700 mb-2">8.1. You may terminate your account at any time by following the instructions in your account settings.</p>
            <p className="text-gray-700">8.2. Web Magnifier may terminate or suspend your account for violations of these terms or other legitimate reasons.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">9. Changes to Terms</h2>
            <p className="text-gray-700 mb-2">9.1. Web Magnifier reserves the right to update or modify these Terms and Conditions at any time.</p>
            <p className="text-gray-700">9.2. Continued use of the platform constitutes acceptance of the updated terms.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">10. Governing Law and Dispute Resolution</h2>
            <p className="text-gray-700 mb-2">10.1. These terms are governed by the laws of India.</p>
            <p className="text-gray-700">10.2. Disputes will be resolved through arbitration or appropriate legal forums.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">11. Contact Us</h2>
            <p className="text-gray-700">For any questions or concerns regarding these terms, please contact us at: <a href="mailto:contactus@magnifier-platform.com" className="text-blue-500 hover:underline">contactus@magnifier-platform.com</a>.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
