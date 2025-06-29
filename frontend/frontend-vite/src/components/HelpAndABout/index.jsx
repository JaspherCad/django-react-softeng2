import React, { useState, useRef, useEffect } from 'react'
import styles from './HelpAndAbout.module.css'
import { FaBook, FaFileAlt, FaQuestionCircle, FaInfoCircle, FaTimes } from 'react-icons/fa'

const HelpAndAbout = () => {
    const [showPdfModal, setShowPdfModal] = useState(false)
    const modalRef = useRef(null)
    const [activeIndex, setActiveIndex] = useState(null)

    const handleOpenPdf = () => setShowPdfModal(true)
    const handleClosePdf = () => setShowPdfModal(false)
    
    const toggleFAQ = (index) => {
        setActiveIndex(index === activeIndex ? null : index)
    }
    
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
    ]

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClosePdf()
            }
        }

        if (showPdfModal) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showPdfModal])

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (showPdfModal) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [showPdfModal])

    return (
        <div className={styles.container}>
            <h2 className={styles.pageTitle}>
                <FaInfoCircle className={styles.titleIcon} />
                Help & About
            </h2>

            <div className={styles.cardsContainer}>
                <h3 className={styles.cardTitle}>
                    Learn More about the System
                </h3>

                <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>
                        <FaQuestionCircle className={styles.cardIcon} />
                        User Guide
                    </h3>
                    <button
                        onClick={handleOpenPdf}
                        className={styles.cardButton}
                    >
                        <FaBook className={styles.buttonIcon} />
                        <h1>User Manual</h1>
                    </button>
                </div>

                <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>
                        DEVELOPERS
                    </h3>
                    <p className={styles.cardText}>
                        Cadelina, Jaspher F.
                        <br />
                        Cortina, Clarence
                        <br />
                        Gonzales, Lance
                    </p>
                    <p className={styles.cardText}>
                        <strong>Version:</strong> 1.0
                        <br />
                        <strong>Last Updated:</strong> June 25, 2025
                        <br />
                    </p>
                </div>
            </div>

            {/* FAQ Section */}
            <div className={styles.faqSection}>
                <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
                <div className={styles.faqContainer}>
                    {faqs.map((faq, index) => (
                        <div key={index} className={styles.faqItem}>
                            <button
                                onClick={() => toggleFAQ(index)}
                                className={styles.faqQuestion}
                            >
                                <span>{faq.question}</span>
                                <span className={styles.faqArrow}>
                                    {activeIndex === index ? "▲" : "▼"}
                                </span>
                            </button>
                            {activeIndex === index && (
                                <div className={styles.faqAnswer}>
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom PDF Modal (iframe) */}
            {showPdfModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} ref={modalRef}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>User Guide</h3>
                            <button
                                className={styles.closeButton}
                                onClick={handleClosePdf}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <iframe
                                src="/how-to-guide.pdf"
                                title="nsoasdasd"
                                className={styles.pdfFrame}
                            />
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                className={styles.closeModalButton}
                                onClick={handleClosePdf}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HelpAndAbout