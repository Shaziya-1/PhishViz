import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./quiz.css";

const PhishingQuiz = () => {
    const questions = [
        {
            question: "You receive an email from 'PayPal Support' <support@paypa1.com> asking to verify your account. Is this phishing?",
            options: ["Yes, the domain is spoofed (paypa1 instead of paypal)", "No, it looks official", "Maybe, I should click first"],
            answer: 0,
            explanation: "Legitimate companies will use their exact domain. 'paypa1.com' is a common typo-squatting technique."
        },
        {
            question: "A website uses HTTPS (a green padlock). Does this mean the site is 100% safe?",
            options: ["Yes, HTTPS means it's verified", "No, hackers can also use SSL certificates", "Only if it doesn't have hyphens"],
            answer: 1,
            explanation: "HTTPS only means the connection is encrypted. Many phishing sites now use SSL to appear trustworthy."
        },
        {
            question: "Which of these URLs is most likely a phishing link?",
            options: ["https://security.google.com/settings", "http://192.168.1.1/login", "https://wellsfargo-verify-account-info.net"],
            answer: 2,
            explanation: "Phishing links often use long, hyphenated domains that mimic real brands but end in unusual TLDs like .net or .tk."
        }
    ];

    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const handleAnswer = (idx) => {
        if (idx === questions[current].answer) {
            setScore(score + 1);
            setFeedback({ type: "correct", text: questions[current].explanation });
        } else {
            setFeedback({ type: "wrong", text: questions[current].explanation });
        }
    };

    const nextQuestion = () => {
        setFeedback(null);
        if (current + 1 < questions.length) {
            setCurrent(current + 1);
        } else {
            setShowScore(true);
        }
    };

    return (
        <>
            <Navbar />
            <div className="quiz-page">
                <div className="quiz-container">
                    <h1>Phishing Awareness Quiz 🎮</h1>
                    <p>Test your cybersecurity knowledge and earn the 'Phish-Proof' badge!</p>
                    
                    {showScore ? (
                        <div className="score-box">
                            <h2>Your Final Score: {score}/{questions.length}</h2>
                            <p>{score === questions.length ? "🎖️ Cybersecurity Expert!" : "Keep learning to stay safe!"}</p>
                            <button onClick={() => window.location.reload()}>Retry Quiz</button>
                        </div>
                    ) : (
                        <div className="question-box">
                            <h3>Question {current + 1}:</h3>
                            <p className="q-text">{questions[current].question}</p>
                            <div className="options">
                                {questions[current].options.map((opt, i) => (
                                    <button key={i} onClick={() => handleAnswer(i)} disabled={feedback}>{opt}</button>
                                ))}
                            </div>
                            
                            {feedback && (
                                <div className={`feedback ${feedback.type}`}>
                                    <p><strong>{feedback.type === "correct" ? "✅ Correct!" : "❌ Oops!"}</strong></p>
                                    <p>{feedback.text}</p>
                                    <button className="next-btn" onClick={nextQuestion}>Next Question ➡️</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PhishingQuiz;
