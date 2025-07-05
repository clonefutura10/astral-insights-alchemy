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
  const [isChatMode, setIsChatMode] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const landingRef = useRef<HTMLDivElement>(null);
  const chatModeRef = useRef<HTMLDivElement>(null);

  // Generate random stars
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    // Generate stars
    const newStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3
    }));
    setStars(newStars);

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

  useEffect(() => {
    if (isChatMode && landingRef.current && chatModeRef.current) {
      // Animate transition to chat mode
      gsap.timeline()
        .to(landingRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.5,
          ease: "power2.inOut"
        })
        .set(landingRef.current, { display: 'none' })
        .set(chatModeRef.current, { display: 'flex' })
        .fromTo(chatModeRef.current, {
          opacity: 0,
          y: 30
        }, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        });
    }
  }, [isChatMode]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Switch to chat mode on first message with animation
    if (!isChatMode) {
      setIsChatMode(true);
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
    };

    // Animate message sending
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    
    // Input clear animation
    gsap.fromTo('.chat-input', {
      scale: 1.02
    }, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out"
    });

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800 text-white relative overflow-hidden">
      <Header />
      
      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map(star => (
          <div
            key={star.id}
            className="absolute bg-white/60 rounded-full animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Curved light effect */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-blue-400/10 via-cyan-300/5 to-transparent" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-full h-32 bg-gradient-to-r from-cyan-400/10 via-blue-400/20 to-indigo-400/10 blur-2xl transform rotate-12" />
      
      {/* Landing Mode */}
      <div ref={landingRef} className={`relative z-10 min-h-screen flex items-center justify-center px-6 ${isChatMode ? 'hidden' : 'flex'}`}>
        <div className="text-center max-w-5xl mx-auto">
          <div ref={heroRef}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light mb-4 leading-tight tracking-tight text-white/90">
              Pandit Pradeep Kiradoo
            </h1>
            
            <p className="text-lg md:text-xl mb-12 text-white/70 font-light max-w-2xl mx-auto">
              Complete Vedic Astrology Guidance for Life's Journey
            </p>

            {/* Chat Box */}
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 max-w-2xl mx-auto mb-8 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="flex space-x-3">
                <Input
                  type="text"
                  placeholder="Ask your problem"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-white/5 border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300 chat-input"
                />
                <Button 
                  onClick={sendMessage}
                  className="bg-blue-500/80 hover:bg-blue-600/80 text-white px-6 border-0 hover:scale-105 transition-all duration-200 hover:shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Additional Navigation */}
            <div className="flex justify-center space-x-6">
              <Link to="/about">
                <Button variant="outline" className="border-white/30 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 bg-transparent hover:scale-105 transition-all duration-200">
                  Learn More About Me
                </Button>
              </Link>
              <Link to="/consultation">
                <Button className="bg-blue-500/80 hover:bg-blue-600/80 text-white px-8 py-3 border-0 hover:scale-105 transition-all duration-200 hover:shadow-lg">
                  Full Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Mode */}
      <div ref={chatModeRef} className={`relative z-10 min-h-screen flex-col justify-between px-6 py-20 ${isChatMode ? 'flex' : 'hidden'}`}>
        <div className="flex-1 max-w-4xl mx-auto w-full">
          {/* Chat Messages */}
          <div ref={chatContainerRef} className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto">
            {messages.map((message, index) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`rounded-2xl px-6 py-4 max-w-md transform transition-all duration-300 hover:scale-[1.02] ${
                  message.sender === 'user' 
                    ? 'bg-blue-500/80 text-white hover:bg-blue-600/80 hover:shadow-lg' 
                    : 'bg-white/10 text-white/90 border border-white/10 hover:bg-white/15 hover:shadow-lg'
                }`}>
                  <div className="flex items-start space-x-3">
                    {message.sender === 'bot' && (
                      <Bot className="w-5 h-5 mt-1 text-blue-300 flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="w-5 h-5 mt-1 text-blue-100 flex-shrink-0" />
                    )}
                    <span className="text-base">{message.text}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white/10 text-white/90 border border-white/10 rounded-2xl px-6 py-4 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <Bot className="w-5 h-5 text-blue-300 animate-pulse" />
                    <span className="text-base">Consulting the stars...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Chat Input - Fixed at bottom */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex space-x-4">
            <Input
              type="text"
              placeholder="Ask your problem"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-white/5 border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-blue-400/20 h-12 text-base transition-all duration-300 chat-input focus:scale-[1.01]"
            />
            <Button 
              onClick={sendMessage}
              className="bg-blue-500/80 hover:bg-blue-600/80 text-white px-8 border-0 h-12 hover:scale-105 transition-all duration-200 hover:shadow-lg"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
