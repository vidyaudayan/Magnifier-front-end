{/*import React from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "../../../componenets/Welcome/button";


const guidelines = [
  {
    title: "1. Community Conduct",
    items: [
      {
        label: "1.1. Respect Others",
        points: [
          "Engage in discussions with courtesy and respect for differing opinions.",
          "Avoid personal attacks, hate speech, or inflammatory remarks.",
        ],
      },
      {
        label: "1.2. Constructive Dialogue",
        points: [
          "Focus on providing valuable, fact-based insights.",
          "Criticism should be directed at ideas, not individuals.",
        ],
      },
      {
        label: "1.3. Inclusivity and Diversity",
        points: [
          "Respect the diversity of political views and backgrounds.",
          "Avoid discriminatory language or exclusionary behavior.",
        ],
      },
    ],
  },
  {
    title: "2. Content Guidelines",
    items: [
      {
        label: "2.1. Truthful and Verified Information",
        points: [
          "Ensure your posts are fact-checked and accurate.",
          "Misinformation, unverified claims, or misleading content are not allowed.",
        ],
      },
      {
        label: "2.2. Relevant Discussions",
        points: [
          "Content should remain focused on political topics, governance, and social issues.",
          "Off-topic, promotional, or unrelated content may be removed.",
        ],
      },
    ],
  },
  {
    title: "3. Prohibited Content",
    listOnly: true,
    points: [
      "Hate Speech & Harassment: Content promoting violence, discrimination, or harassment.",
      "Fake News & Misinformation: False claims or conspiracy theories without credible sources.",
      "Violent or Graphic Content: Material that incites violence or contains explicit imagery.",
      "Illegal Activity: Content promoting or facilitating illegal activities.",
      "Spam and Promotion: Unsolicited promotions or repetitive content.",
    ],
  },
];

const UserGuidelines = () => {
  const effectiveDate = 'April 19, 2025';
  const lastUpdatedDate = 'April 19, 2025';
  const navigate = useNavigate()
  return (
    <>
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
      <main className="max-w-4xl mx-auto mt-0 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 md:p-10">
          <header className="text-center mb-10">
            <h1 className="text-3xl font-bold text-blue-600">Web Magnifier: User Guidelines</h1>
            <p className="text-sm text-gray-500 mt-2">
              Effective Date: {effectiveDate} | Last Updated: {lastUpdatedDate}
            </p>
          </header>

          <article className="text-gray-700 space-y-10">
            {guidelines.map((section, index) => (
              <section key={index}>
                <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                {section.listOnly ? (
                  <ul className="list-disc list-inside pl-4 space-y-1">
                    {section.points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                ) : (
                  section.items.map((item, subIndex) => (
                    <div key={subIndex} className="mb-4">
                      <p className="font-medium">{item.label}</p>
                      <ul className="list-disc list-inside pl-4 space-y-1 mt-1">
                        {item.points.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </section>
            ))}

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Contact and Support</h2>
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
          </article>
        </div>
      </main>
    </>
  );
};

export default UserGuidelines;*/}

import React from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "../../../componenets/Welcome/button";


const guidelines = [
  {
    title: "1. Community Conduct",
    items: [
      {
        label: "1.1. Respect Others",
        points: [
          "Engage in discussions with courtesy and respect for differing opinions.",
          "Avoid personal attacks, hate speech, or inflammatory remarks.",
        ],
      },
      {
        label: "1.2. Constructive Dialogue",
        points: [
          "Focus on providing valuable, fact-based insights.",
          "Criticism should be directed at ideas, not individuals.",
        ],
      },
      {
        label: "1.3. Inclusivity and Diversity",
        points: [
          "Respect the diversity of political views and backgrounds.",
          "Avoid discriminatory language or exclusionary behavior.",
        ],
      },
    ],
  },
  {
    title: "2. Content Guidelines",
    items: [
      {
        label: "2.1. Truthful and Verified Information",
        points: [
          "Ensure your posts are fact-checked and accurate.",
          "Misinformation, unverified claims, or misleading content are not allowed.",
        ],
      },
      {
        label: "2.2. Relevant Discussions",
        points: [
          "Content should remain focused on political topics, governance, and social issues.",
          "Off-topic, promotional, or unrelated content may be removed.",
        ],
      },
    ],
  },
  {
    title: "3. Prohibited Content",
    listOnly: true,
    points: [
      "Hate Speech & Harassment: Content promoting violence, discrimination, or harassment.",
      "Fake News & Misinformation: False claims or conspiracy theories without credible sources.",
      "Violent or Graphic Content: Material that incites violence or contains explicit imagery.",
      "Illegal Activity: Content promoting or facilitating illegal activities.",
      "Spam and Promotion: Unsolicited promotions or repetitive content.",
    ],
  },
];

const UserGuidelines = () => {
  const effectiveDate = 'April 19, 2025';
  const lastUpdatedDate = 'April 19, 2025';
  const navigate = useNavigate()
  return (
    <>
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
      <main className="max-w-4xl mx-auto mt-0 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 md:p-10">
          <header className="text-center mb-10">
            <h1 className="text-3xl font-bold text-blue-600">Web Magnifier: User Guidelines</h1>
            <p className="text-sm text-gray-500 mt-2">
              Effective Date: {effectiveDate} | Last Updated: {lastUpdatedDate}
            </p>
          </header>

          <article className="text-gray-700 space-y-10">
            {guidelines.map((section, index) => (
              <section key={index}>
                <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                {section.listOnly ? (
                  <ul className="list-disc list-inside pl-4 space-y-1">
                    {section.points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                ) : (
                  section.items.map((item, subIndex) => (
                    <div key={subIndex} className="mb-4">
                      <p className="font-medium">{item.label}</p>
                      <ul className="list-disc list-inside pl-4 space-y-1 mt-1">
                        {item.points.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </section>
            ))}

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Contact and Support</h2>
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
          </article>
        </div>
      </main>
    </>
  );
};

export default UserGuidelines;