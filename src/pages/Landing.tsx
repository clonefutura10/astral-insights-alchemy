
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Bot, User } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

const Landing = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero text entrance animation
    if (heroRef.current) {
      gsap.fromTo(heroRef.current.children, {
        opacity: 0,
        y: 50
      }, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out"
      });
    }

    // Scroll to bottom on new message
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: Date.now().toString() + '-bot',
        sender: 'bot',
        text: generateBotResponse(input),
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('horoscope') || lowerMessage.includes('birth chart')) {
      return "I can provide insights about your horoscope and birth chart. Please share your birth date, time, and place for a personalized reading.";
    } else if (lowerMessage.includes('future') || lowerMessage.includes('prediction')) {
      return "The future holds many possibilities. Based on your planetary positions, I can guide you about upcoming opportunities and challenges.";
    } else if (lowerMessage.includes('career') || lowerMessage.includes('job')) {
      return "Career guidance through astrology can reveal your natural talents and favorable periods for professional growth. What specific career concerns do you have?";
    } else if (lowerMessage.includes('love') || lowerMessage.includes('marriage')) {
      return "Relationships and marriage timing can be understood through Vedic astrology. Your 7th house and Venus position play key roles in this aspect.";
    } else {
      return "Welcome! I'm here to help you with astrological guidance. Feel free to ask about your horoscope, career, relationships, or any life questions you may have.";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
      <Header />
      
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />
      
      {/* Main Hero Section */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-4xl mx-auto">
          <div ref={heroRef}>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              One Platform,<br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Endless Astrological Possibilities
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-blue-200 max-w-2xl mx-auto">
              Complete Vedic Astrology Guidance for Life's Journey
            </p>

            {/* Chat Box */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 max-w-2xl mx-auto">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-center mb-4 text-white">
                  Ask Pandit Pradeep Kiradoo
                </h3>
                
                {/* Chat Messages */}
                <div ref={chatContainerRef} className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                  {messages.length === 0 && (
                    <div className="text-center text-blue-200 py-8">
                      <Bot className="w-12 h-12 mx-auto mb-3 text-blue-400" />
                      <p>Welcome! I'm here to provide astrological guidance. What would you like to know?</p>
                    </div>
                  )}
                  
                  {messages.map(message => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`rounded-2xl px-4 py-3 max-w-xs ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white/20 text-white border border-white/10'
                      }`}>
                        <div className="flex items-start space-x-2">
                          {message.sender === 'bot' && (
                            <Bot className="w-4 h-4 mt-0.5 text-blue-300 flex-shrink-0" />
                          )}
                          {message.sender === 'user' && (
                            <User className="w-4 h-4 mt-0.5 text-blue-100 flex-shrink-0" />
                          )}
                          <span className="text-sm">{message.text}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/20 text-white border border-white/10 rounded-2xl px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4 text-blue-300" />
                          <span className="text-sm">Consulting the stars...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Chat Input */}
                <div className="flex space-x-3">
                  <Input
                    type="text"
                    placeholder="Ask about your future, career, love life..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder-blue-200 focus:border-blue-400"
                  />
                  <Button 
                    onClick={sendMessage}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Additional Navigation */}
            <div className="flex justify-center space-x-6 mt-8">
              <Link to="/about">
                <Button variant="outline" className="border-blue-400 text-blue-300 hover:bg-blue-400 hover:text-white px-6 py-3">
                  Learn More About Me
                </Button>
              </Link>
              <Link to="/consultation">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3">
                  Full Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
