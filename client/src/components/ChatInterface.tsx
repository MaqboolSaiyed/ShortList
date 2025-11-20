import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface ChatInterfaceProps {
    onSendMessage: (message: string) => Promise<string>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSendMessage }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'bot', text: "I've analyzed the resume. Ask me anything about the candidate!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const response = await onSendMessage(userMessage);
            setMessages(prev => [...prev, { role: 'bot', text: response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I encountered an error processing your request." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-12 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col h-[600px]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <Bot className="text-accent-primary w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-text-primary">AI Assistant</h3>
                        <p className="text-sm text-text-secondary">Ask questions about the candidate</p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-accent-secondary text-white' : 'bg-blue-50 text-accent-primary'
                                }`}>
                                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                            </div>
                            <div className={`max-w-[80%] p-5 rounded-3xl shadow-sm ${msg.role === 'user'
                                    ? 'bg-accent-primary text-white rounded-tr-none'
                                    : 'bg-gray-50 text-text-primary border border-gray-100 rounded-tl-none'
                                }`}>
                                <p className="leading-relaxed text-[15px]">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <Bot size={18} className="text-accent-primary" />
                            </div>
                            <div className="bg-gray-50 p-5 rounded-3xl rounded-tl-none border border-gray-100">
                                <Loader2 className="animate-spin w-5 h-5 text-text-secondary" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/30">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask a question..."
                            className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-blue-500/10 transition-all text-text-primary placeholder-gray-400 shadow-sm"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="absolute right-3 p-2.5 bg-accent-primary text-white rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
