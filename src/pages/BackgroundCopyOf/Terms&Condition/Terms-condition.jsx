{/*import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "../../../componenets/Welcome/button";

const TermsAndConditions = () => {
  const effectiveDate = 'April 19, 2025';
  const lastUpdatedDate = 'April 19, 2025';
const navigate = useNavigate()
  return (
    <>
    <div className=''>
    <Button
                onClick={() => navigate("/")}
                variant="ghost"
                className="mb-6 m-4 text-white flex bg-blue-800 items-center gap-2 hover:bg-white hover:text-blue-900 border hover:border-slate-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
       <div className="max-w-md mx-auto flex mt-3">
             
              </div>
      <section className="max-w-4xl mx-auto mt-0 bg-white shadow-xl rounded-2xl p-6 md:p-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">Web Magnifier: Terms and Conditions</h1>
          <p className="text-sm text-gray-500 mt-2">
            Effective Date: {effectiveDate} | Last Updated: {lastUpdatedDate}
          </p>
        </header>

        <article className="space-y-8 text-gray-700 text-base leading-relaxed">
          <Section title="1. Eligibility">
            <p>You must be at least 18 years old to create an account and use Web Magnifier.</p>
            <p>By registering, you confirm that all the information provided is accurate and up-to-date.</p>
          </Section>

          <Section title="2. User Responsibilities">
            <p><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials.</p>
            <p><strong>Content Standards:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>Hate speech or incitement of violence</li>
              <li>Misinformation or fake news</li>
              <li>Content that violates any applicable laws or regulations</li>
            </ul>
          </Section>

          <Section title="3. Content Ownership and Usage">
            <p><strong>User Content:</strong> You retain ownership of the content you post. By posting, you grant Web Magnifier a non-exclusive, royalty-free, worldwide license to use, display, and distribute your content.</p>
            <p><strong>Platform Content:</strong> All platform content, including designs, logos, and features, is owned by Web Magnifier. You may not reproduce or distribute platform content without permission.</p>
          </Section>

          <Section title="4. Moderation and Enforcement">
            <p>Web Magnifier reserves the right to moderate and review user content to ensure compliance with these terms.</p>
            <p>Violations of these terms may result in warnings, content removal, account suspension, or permanent banning.</p>
          </Section>

          <Section title="5. Privacy">
            <p>By using Web Magnifier, you consent to the collection, storage, and use of your data as outlined in our Privacy Policy.</p>
          </Section>

          <Section title="6. Liability and Disclaimers">
            <p><strong>No Guarantee of Accuracy:</strong> Web Magnifier does not guarantee the accuracy or reliability of user-generated content.</p>
            <p><strong>Limitation of Liability:</strong> Web Magnifier is not liable for any damages resulting from your use of the platform.</p>
          </Section>

          <Section title="7. Payment and Earnings">
            <p>Users participating in monetized discussions or content must adhere to platform-specific guidelines for payments and earnings.</p>
            <p>Web Magnifier reserves the right to modify payment structures or terms with prior notice.</p>
          </Section>

          <Section title="8. Termination">
            <p>You may terminate your account at any time by following the instructions in your account settings.</p>
            <p>Web Magnifier may terminate or suspend your account for violations of these terms or other legitimate reasons.</p>
          </Section>

          <Section title="9. Changes to Terms">
            <p>Web Magnifier reserves the right to update or modify these Terms and Conditions at any time.</p>
            <p>Continued use of the platform constitutes acceptance of the updated terms.</p>
          </Section>

          <Section title="10. Governing Law and Dispute Resolution">
            <p>These terms are governed by the laws of India.</p>
            <p>Disputes will be resolved through arbitration or appropriate legal forums.</p>
          </Section>

          <Section title="11. Contact Us">
            <p>
              For any questions or concerns regarding these terms, please contact us at:{' '}
              <a href="mailto:contactus@magnifier-platform.com" className="text-blue-500 hover:underline">
                contactus@magnifier-platform.com
              </a>.
            </p>
          </Section>
        </article>
      </section>
      </div>
   </>
  );
};

const Section = ({ title, children }) => (
  <section>
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <div className="space-y-2">{children}</div>
  </section>
);

export default TermsAndConditions;*/}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "../../../componenets/Welcome/button";

const TermsAndConditions = () => {
  const effectiveDate = 'April 19, 2025';
  const lastUpdatedDate = 'April 19, 2025';
const navigate = useNavigate()
  return (
    <>
    <div className=''>
    {/* <Button
                onClick={() => navigate("/")}
                variant="ghost"
                className="mb-6 m-4 text-white flex bg-blue-800 items-center gap-2 hover:bg-white hover:text-blue-900 border hover:border-slate-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button> */}
       <div className="max-w-md mx-auto flex mt-3">
             
              </div>
      <section className="max-w-4xl mx-auto mt-0 bg-white shadow-xl rounded-2xl p-6 md:p-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">Web Magnifier: Terms and Conditions</h1>
          <p className="text-sm text-gray-500 mt-2">
            Effective Date: {effectiveDate} | Last Updated: {lastUpdatedDate}
          </p>
        </header>

        <article className="space-y-8 text-gray-700 text-base leading-relaxed">
          <Section title="1. Eligibility">
            <p>You must be at least 18 years old to create an account and use Web Magnifier.</p>
            <p>By registering, you confirm that all the information provided is accurate and up-to-date.</p>
          </Section>

          <Section title="2. User Responsibilities">
            <p><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials.</p>
            <p><strong>Content Standards:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>Hate speech or incitement of violence</li>
              <li>Misinformation or fake news</li>
              <li>Content that violates any applicable laws or regulations</li>
            </ul>
          </Section>

          <Section title="3. Content Ownership and Usage">
            <p><strong>User Content:</strong> You retain ownership of the content you post. By posting, you grant Web Magnifier a non-exclusive, royalty-free, worldwide license to use, display, and distribute your content.</p>
            <p><strong>Platform Content:</strong> All platform content, including designs, logos, and features, is owned by Web Magnifier. You may not reproduce or distribute platform content without permission.</p>
          </Section>

          <Section title="4. Moderation and Enforcement">
            <p>Web Magnifier reserves the right to moderate and review user content to ensure compliance with these terms.</p>
            <p>Violations of these terms may result in warnings, content removal, account suspension, or permanent banning.</p>
          </Section>

          <Section title="5. Privacy">
            <p>By using Web Magnifier, you consent to the collection, storage, and use of your data as outlined in our Privacy Policy.</p>
          </Section>

          <Section title="6. Liability and Disclaimers">
            <p><strong>No Guarantee of Accuracy:</strong> Web Magnifier does not guarantee the accuracy or reliability of user-generated content.</p>
            <p><strong>Limitation of Liability:</strong> Web Magnifier is not liable for any damages resulting from your use of the platform.</p>
          </Section>

          <Section title="7. Payment and Earnings">
            <p>Users participating in monetized discussions or content must adhere to platform-specific guidelines for payments and earnings.</p>
            <p>Web Magnifier reserves the right to modify payment structures or terms with prior notice.</p>
          </Section>

          <Section title="8. Termination">
            <p>You may terminate your account at any time by following the instructions in your account settings.</p>
            <p>Web Magnifier may terminate or suspend your account for violations of these terms or other legitimate reasons.</p>
          </Section>

          <Section title="9. Changes to Terms">
            <p>Web Magnifier reserves the right to update or modify these Terms and Conditions at any time.</p>
            <p>Continued use of the platform constitutes acceptance of the updated terms.</p>
          </Section>

          <Section title="10. Governing Law and Dispute Resolution">
            <p>These terms are governed by the laws of India.</p>
            <p>Disputes will be resolved through arbitration or appropriate legal forums.</p>
          </Section>

          <Section title="11. Contact Us">
            <p>
              For any questions or concerns regarding these terms, please contact us at:{' '}
              <a href="mailto:contactus@magnifier-platform.com" className="text-blue-500 hover:underline">
                contactus@magnifier-platform.com
              </a>.
            </p>
          </Section>
        </article>
      </section>
      </div>
   </>
  );
};

const Section = ({ title, children }) => (
  <section>
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <div className="space-y-2">{children}</div>
  </section>
);

export default TermsAndConditions;