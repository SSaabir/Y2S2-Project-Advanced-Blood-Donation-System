import React, { useState } from "react";
import { Card, Accordion, Button } from "flowbite-react";

export default function Terms() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const termsSections = [
    {
      id: 1,
      title: "Acceptance of Terms",
      content:
        "By accessing or using this website, you agree to comply with and be bound by these Terms & Conditions. If you do not agree, please do not use this website.",
    },
    {
      id: 2,
      title: "Use of the Website",
      content:
        "You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use of the website.",
    },
    {
      id: 3,
      title: "Intellectual Property",
      content:
        "All content on this website, including text, graphics, logos, and images, is the property of RedDrop and is protected by intellectual property laws. Unauthorized use is prohibited.",
    },
    {
      id: 4,
      title: "Limitation of Liability",
      content:
        "RedDrop is not liable for any damages arising from the use of this website or the information provided. Use the website at your own risk.",
    },
    {
      id: 5,
      title: "Changes to Terms",
      content:
        "RedDrop reserves the right to modify these Terms & Conditions at any time. Your continued use of the website constitutes acceptance of the updated terms.",
    },
    {
      id: 6,
      title: "Governing Law",
      content:
        "These Terms & Conditions are governed by the laws of Sri Lanka. Any disputes will be resolved in the courts of Sri Lanka.",
    },
  ];

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-red-700 mb-8">Terms & Conditions</h1>

        {/* Terms Content */}
        <Card className="shadow-lg border border-gray-200">
          <Accordion flush>
            {termsSections.map((section) => (
              <Accordion.Panel key={section.id}>
                <Accordion.Title
                  className="text-xl font-semibold text-red-700 hover:text-red-800 focus:ring-red-300"
                  onClick={() => toggleSection(section.id)}
                >
                  {`${section.id}. ${section.title}`}
                </Accordion.Title>
                <Accordion.Content>
                  <p className="text-gray-600">{section.content}</p>
                </Accordion.Content>
              </Accordion.Panel>
            ))}
          </Accordion>

          {/* Optional Back Button */}
          <div className="mt-6 flex justify-center">
            <Button
              gradientDuoTone="redToPink"
              onClick={() => window.history.back()}
              className="w-40"
            >
              Back
            </Button>
          </div>
        </Card>

        {/* Last Updated Note */}
        <p className="text-center text-gray-500 mt-6 text-sm">
          Last Updated: March 29, 2025
        </p>
      </div>
    </div>
  );
}