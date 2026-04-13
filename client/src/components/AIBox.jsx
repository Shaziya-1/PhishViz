import { useState } from "react";
import axios from "axios";
import "./aibox.css";

const AIBox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "bot", text: "Hello! I am CyberPhish AI. How can I help you stay safe today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input || loading) return;
        const msg = input;
        const newMessages = [...messages, { role: "user", text: msg }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5001/api/chatbot", {
                message: msg
            });
            
            setMessages([...newMessages, { role: "bot", text: response.data.reply }]);
        } catch (error) {
            setMessages([...newMessages, { role: "bot", text: "⚠️ Connection Error: Please make sure the backend is running on port 5001!" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`ai-box-wrapper ${isOpen ? 'open' : ''}`}>
            {!isOpen && (
                <button className="ai-toggle" onClick={() => setIsOpen(true)}>
                    🤖 AI Assistant
                </button>
            )}

            {isOpen && (
                <div className="ai-chat-window">
                    <div className="ai-header">
                        <span>CyberPhish AI</span>
                        <button onClick={() => setIsOpen(false)}>✖</button>
                    </div>
                    <div className="ai-messages">
                        {messages.map((m, i) => (
                            <div key={i} className={`msg ${m.role}`}>
                                {m.text}
                            </div>
                        ))}
                        {loading && <div className="msg bot loading-dots">Thinking...</div>}
                    </div>
                    <div className="ai-input">
                        <input 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend}>➤</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIBox;
