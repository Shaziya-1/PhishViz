import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { scanQR, checkURL } from "../services/api";
import "./qr_scanner.css";

const QRScanner = () => {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleScan = async () => {
        if (!image) return;
        setLoading(true);
        try {
            // Extract URL from QR
            const { data: qrData } = await scanQR(image);
            
            // Analyze the extracted URL
            const { data: analysisData } = await checkURL(qrData.url);
            
            setResult({
                url: qrData.url,
                analysis: analysisData
            });
        } catch (err) {
            console.error(err);
            alert("Error scanning QR code. Make sure it's a clear image of a QR code containing a URL.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="qr-page">
                <div className="page-header">
                    <h1>QR Code Phishing Scanner</h1>
                    <p>Upload a QR code to safely extract and analyze the hidden URL</p>
                </div>

                <div className="scanner-container">
                    <input type="file" onChange={handleFileChange} accept="image/*" />
                    {image && <img src={image} alt="Preview" className="qr-preview" />}
                    <button onClick={handleScan} disabled={loading || !image}>
                        {loading ? "Extracting & Analyzing..." : "Scan & Analyze QR"}
                    </button>
                </div>

                {result && (
                    <div className={`result-card ${result.analysis.risk_level.toLowerCase()}`}>
                        <h2>Status: {result.analysis.risk_level}</h2>
                        <p><strong>Extracted URL:</strong> {result.url}</p>
                        <p><strong>Risk Score:</strong> {result.analysis.final_score}/100</p>
                        <div className="qr-actions">
                            <button onClick={() => window.open(result.url, '_blank')} className="visit-btn">Visit Anyway (Not Recommended)</button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default QRScanner;
