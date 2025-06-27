import React, { useState } from "react";

const Help = () => {
  const faqs = [
    {
      question: "What is the Patient Information Management System (PIMS)?",
      answer:
        "PIMS is a hospital system for managing patient records, admissions, billing, laboratory results, and consultations.",
    },
    {
      question: "Who can access the system?",
      answer:
        "Only the admin and authorized hospital personnels can access the system using their assigned accounts.",
    },
    {
      question: "How can I register a new patient?",
      answer:
        "Go to the 'Patients' section, click on 'Admit New Patient', and fill out the required form fields. Make sure to save the details.",
    },
    {
      question: "How can I generate reports?",
      answer:
        "Navigate to the 'Reports' section and select the type of report you want to generate.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "2rem 5%",
        fontFamily: "'Segoe UI', sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Title */}
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", textAlign: "left" }}>
        Help & About
      </h1>

      {/* Divider */}
      <hr
        style={{
          margin: "1rem 0 2rem 0",
          borderTop: "3px solid #444",
        }}
      />

      {/* FAQ Title */}
      <h1
        style={{
          fontSize: "2rem",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        FAQs
      </h1>

      {/* FAQ Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {faqs.map((faq, index) => (
          <div
            key={index}
            style={{
              marginBottom: "1rem",
              width: "100%",
              maxWidth: "900px",
            }}
          >
            <button
              onClick={() => toggleFAQ(index)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
                padding: "0.75rem 1rem",
                width: "100%",
                textAlign: "left",
                border: "1px solid #ccc",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              <span>{faq.question}</span>
              <span style={{ fontSize: "1rem" }}>
                {activeIndex === index ? "▲" : "▼"}
              </span>
            </button>
            {activeIndex === index && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  border: "1px solid #e0e0e0",
                  borderTop: "none",
                  backgroundColor: "#fafafa",
                }}
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Developer Credits */}
      <div
        style={{
          marginTop: "8rem",
          lineHeight: "1.5",
          textAlign: "center",
        }}
      >
        <h4 style={{ fontWeight: "bold" }}>Developers:</h4>
        <p>Cadelina, Jaspher F.</p>
        <p>Cortina, Clarence C.</p>
        <p>Gonzales, Lance Daniel L.</p>
      </div>

      {/* Version Info */}
      <p
        style={{
          marginTop: "11rem",
          fontSize: "0.9rem",
          color: "#888",
          textAlign: "center",
        }}
      >
        System Version 1.0
      </p>
    </div>
  );
};

export default Help;
