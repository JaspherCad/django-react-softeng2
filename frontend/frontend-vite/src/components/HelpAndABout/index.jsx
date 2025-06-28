import React, { useState, useRef, useEffect } from 'react'
import styles from './HelpAndAbout.module.css'
import { FaBook, FaFileAlt, FaQuestionCircle, FaInfoCircle, FaTimes } from 'react-icons/fa'

const HelpAndAbout = () => {
    const [showPdfModal, setShowPdfModal] = useState(false)
    const modalRef = useRef(null)

    const handleOpenPdf = () => setShowPdfModal(true)
    const handleClosePdf = () => setShowPdfModal(false)

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
                    {/* <p className={styles.cardText}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae corrupti minima ullam ratione laboriosam nostrum voluptatum cupiditate alias at fugiat eaque modi quisquam nisi aliquid, vel est maiores odit. Aliquid, exercitationem eius! Doloremque corporis tenetur quis dignissimos, consequatur voluptas provident eius porro facere. Voluptatum explicabo libero excepturi id, unde blanditiis.
            </p> */}
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
                        <strong>Version:</strong> 0.0.1
                        <br />
                        <strong>Last Updated:</strong> June 25, 2025
                        <br />
                    </p>
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