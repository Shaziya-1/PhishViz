import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { analyzeEmail } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import "./email_analyzer.css";

const EmailAnalyzer = () => {
    const [text, setText] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showComparison, setShowComparison] = useState(false);

    const handleAnalyze = async () => {
        if (!text) return;
        setLoading(true);
        setResult(null);
        setShowComparison(false);
        try {
            const { data } = await analyzeEmail(text);
            setResult(data);
        } catch (err) {
            console.error(err);
            alert("Error analyzing email.");
        } finally {
            setLoading(false);
        }
    };

    const chartData = result ? [
        { name: 'Heuristic Parser', score: result.model_comparison['Heuristic Parser'] },
        { name: 'LSTM (Neural Network)', score: result.model_comparison['LSTM (Neural Network)'] }
    ] : [];

    return (
        <>
            <Navbar />
            <div className="email-page">
                <div className="page-header">
                    <div className="icon">📧</div>
                    <h1>Email Phishing Detector</h1>
                    <p>Paste email content to detect suspicious patterns and urgent keywords</p>
                </div>

                <div className="analyzer-container">
                    <textarea 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste email text here..."
                        rows={10}
                    />
                    <button onClick={handleAnalyze} disabled={loading}>
                        {loading ? "Analyzing NLP..." : "Check for Phishing"}
                    </button>
                    {result && (
                        <button className="compare-btn-email" onClick={() => setShowComparison(!showComparison)}>
                            {showComparison ? "Hide Comparison" : "📊 View Model Comparison"}
                        </button>
                    )}
                </div>

                {result && (
                    <div className={`result-card ${result.risk_level.toLowerCase()}`}>
                        <h2>Result: {result.risk_level}</h2>
                        <div className="risk-meter">
                            <div className="meter-fill" style={{ width: `${result.risk_score}%` }}></div>
                        </div>
                        <p className="score-text">Hybrid Risk Score: {result.risk_score}/100</p>
                        
                        {showComparison && (
                            <div className="comparison-section fade-in">
                                <h3>Hybrid Model Comparison</h3>
                                <div className="chart-wrapper">
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                            <XAxis type="number" domain={[0, 100]} hide />
                                            <YAxis dataKey="name" type="category" width={100} fontSize={12} stroke="#fff" />
                                            <Tooltip 
                                              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                            />
                                            <Bar dataKey="score" radius={[0, 5, 5, 0]}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index === 1 ? "#6366f1" : "#3b82f6"} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="best-performer">
                                    <span>🏆 Best Performer: </span>
                                    <strong>{result.model_comparison['Best Performer']}</strong>
                                </div>
                            </div>
                        )}

                        <div className="keywords-section">
                            <h3>🚨 Suspicious Keywords Found:</h3>
                            <div className="keyword-tags">
                                {result.found_keywords.length > 0 ? (
                                    result.found_keywords.map((kw, i) => (
                                        <span key={i} className="kw-tag">{kw}</span>
                                    ))
                                ) : (
                                    <p>None detected</p>
                                )}
                            </div>
                        </div>

                        <div className="explanation">
                            <h3>🔍 Explanation</h3>
                            <p>{result.explanation}</p>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default EmailAnalyzer;
