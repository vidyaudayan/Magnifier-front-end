import React from "react";
import Navbar from "./Navbar";

const UserGuidelines = () => {
  return (
    <div className="min-h-screen min-w-full bg-gray-100 ">
<Navbar/>
<div className="max-w-4xl mx-auto mt-24 bg-white shadow-lg rounded-lg overflow-hidden">

        <div className="p-6">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
            Web Magnifier: User Guidelines
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Effective Date: [Insert Date] | Last Updated: [Insert Date]
          </p>
          <div className="text-gray-700 space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Community Conduct</h2>
              <p>
                <strong>1.1. Respect Others:</strong>
                <ul className="list-disc list-inside pl-4">
                  <li>Engage in discussions with courtesy and respect for differing opinions.</li>
                  <li>Avoid personal attacks, hate speech, or inflammatory remarks.</li>
                </ul>
              </p>
              <p>
                <strong>1.2. Constructive Dialogue:</strong>
                <ul className="list-disc list-inside pl-4">
                  <li>Focus on providing valuable, fact-based insights.</li>
                  <li>Criticism should be directed at ideas, not individuals.</li>
                </ul>
              </p>
              <p>
                <strong>1.3. Inclusivity and Diversity:</strong>
                <ul className="list-disc list-inside pl-4">
                  <li>Respect the diversity of political views and backgrounds.</li>
                  <li>Avoid discriminatory language or exclusionary behavior.</li>
                </ul>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Content Guidelines</h2>
              <p>
                <strong>2.1. Truthful and Verified Information:</strong>
                <ul className="list-disc list-inside pl-4">
                  <li>Ensure your posts are fact-checked and accurate.</li>
                  <li>Misinformation, unverified claims, or misleading content are not allowed.</li>
                </ul>
              </p>
              <p>
                <strong>2.2. Relevant Discussions:</strong>
                <ul className="list-disc list-inside pl-4">
                  <li>Content should remain focused on political topics, governance, and social issues.</li>
                  <li>Off-topic, promotional, or unrelated content may be removed.</li>
                </ul>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. Prohibited Content</h2>
              <ul className="list-disc list-inside pl-4">
                <li>Hate Speech & Harassment: Content promoting violence, discrimination, or harassment.</li>
                <li>Fake News & Misinformation: False claims or conspiracy theories without credible sources.</li>
                <li>Violent or Graphic Content: Material that incites violence or contains explicit imagery.</li>
                <li>Illegal Activity: Content promoting or facilitating illegal activities.</li>
                <li>Spam and Promotion: Unsolicited promotions or repetitive content.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">10. Contact and Support</h2>
              <p>
                For questions, concerns, or reporting issues, reach out to our support team at:{" "}
                <a
                  href="mailto:contactus@magnifier-platform.com"
                  className="text-blue-500 hover:underline"
                >
                  contactus@magnifier-platform.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuidelines;
