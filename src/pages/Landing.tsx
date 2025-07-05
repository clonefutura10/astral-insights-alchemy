
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
    // Generate more stars for better effect
    const newStars = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      delay: Math.random() * 4
    }));
    setStars(newStars);

    // Hero text entrance animation
    if (heroRef.current) {
      gsap.fromTo(heroRef.current.children, {
        opacity: 0,
        y: 60,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.5,
        stagger: 0.3,
        ease: "power3.out"
      });
    }

    // Smooth scroll to bottom on new message
    if (chatContainerRef.current) {
      gsap.to(chatContainerRef.current, {
        scrollTop: chatContainerRef.current.scrollHeight,
        duration: 0.8,
        ease: "power2.out"
      });
    }
  }, [messages]);

  useEffect(() => {
    if (isChatMode && landingRef.current && chatModeRef.current) {
      // Enhanced transition to chat mode
      const tl = gsap.timeline();
      
      tl.to(landingRef.current, {
        opacity: 0,
        scale: 0.9,
        y: -30,
        duration: 0.8,
        ease: "power3.inOut"
      })
      .set(landingRef.current, { display: 'none' })
      .set(chatModeRef.current, { display: 'flex' })
      .fromTo(chatModeRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out"
      });
    }
  }, [isChatMode]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Switch to chat mode on first message with enhanced animation
    if (!isChatMode) {
      setIsChatMode(true);
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
    };

    // Enhanced message sending animation
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Smooth input clear with bounce effect
    gsap.timeline()
      .to('.chat-input', {
        scale: 1.05,
        duration: 0.1,
        ease: "power2.out"
      })
      .to('.chat-input', {
        scale: 1,
        duration: 0.3,
        ease: "bounce.out"
      });
    
    setInput('');
    setIsLoading(true);

    // Simulate bot response with enhanced timing
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: Date.now().toString() + '-bot',
        sender: 'bot',
        text: generateBotResponse(input),
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
      setIsLoading(false);
    }, 1800);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-blue-800 text-white relative overflow-hidden">
      <Header />
      
      {/* Enhanced Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map(star => (
          <div
            key={star.id}
            className="absolute bg-blue-200/70 rounded-full animate-pulse twinkle-animation"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              boxShadow: `0 0 ${star.size * 2}px rgba(147, 197, 253, 0.3)`
            }}
          />
        ))}
      </div>

      {/* Enhanced light effects */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-blue-400/10 via-blue-300/5 to-transparent" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-full h-32 bg-gradient-to-r from-blue-400/10 via-blue-500/20 to-blue-600/10 blur-2xl transform rotate-12" />
      
      {/* Landing Mode */}
      <div ref={landingRef} className={`relative z-10 min-h-screen flex items-center justify-center px-6 ${isChatMode ? 'hidden' : 'flex'}`}>
        <div className="text-center max-w-5xl mx-auto">
          <div ref={heroRef}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light mb-8 leading-tight tracking-tight bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 bg-clip-text text-transparent">
              Pandit Pradeep Kiradoo
            </h1>
            
            <p className="text-lg md:text-xl mb-12 text-blue-100/80 font-light max-w-2xl mx-auto">
              Complete Vedic Astrology Guidance for Life's Journey
            </p>

            {/* Enhanced Chat Box */}
            <Card className="bg-blue-900/20 backdrop-blur-xl border border-blue-300/20 p-6 max-w-2xl mx-auto mb-8 hover:bg-blue-900/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl cosmic-glow">
              <div className="flex space-x-3">
                <Input
                  type="text"
                  placeholder="Ask your problem"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-blue-800/20 border-blue-300/30 text-blue-100 placeholder-blue-200/60 focus:border-blue-400 focus:ring-blue-400/30 transition-all duration-300 chat-input"
                />
                <Button 
                  onClick={sendMessage}
                  className="bg-blue-500/80 hover:bg-blue-600/90 text-white px-6 border-0 hover:scale-110 transition-all duration-300 hover:shadow-lg cosmic-glow"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Enhanced Navigation */}
            <div className="flex justify-center space-x-6 flex-wrap gap-4">
              <Link to="/about">
                <Button variant="outline" className="border-blue-300/40 text-blue-100/90 hover:bg-blue-800/20 hover:text-blue-100 px-8 py-3 bg-transparent hover:scale-105 transition-all duration-300">
                  Learn More About Me
                </Button>
              </Link>
              <Link to="/consultation">
                <Button className="bg-blue-500/80 hover:bg-blue-600/90 text-white px-8 py-3 border-0 hover:scale-105 transition-all duration-300 hover:shadow-lg">
                  Quick Consultation
                </Button>
              </Link>
              <Link to="/astrology-consultation">
                <Button className="bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-600/90 hover:to-blue-600/90 text-white px-8 py-3 border-0 hover:scale-105 transition-all duration-300 hover:shadow-lg">
                  Deep Analysis Session
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Chat Mode */}
      <div ref={chatModeRef} className={`relative z-10 min-h-screen flex-col justify-between px-6 py-20 ${isChatMode ? 'flex' : 'hidden'}`}>
        <div className="flex-1 max-w-4xl mx-auto w-full">
          {/* Enhanced Chat Messages */}
          <div ref={chatContainerRef} className="space-y-6 mb-6 max-h-[60vh] overflow-y-auto">
            {messages.map((message, index) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className={`rounded-2xl px-6 py-4 max-w-md transform transition-all duration-500 hover:scale-[1.02] ${
                  message.sender === 'user' 
                    ? 'bg-blue-500/80 text-white hover:bg-blue-600/90 hover:shadow-xl cosmic-glow' 
                    : 'bg-blue-900/20 text-blue-100/95 border border-blue-300/20 hover:bg-blue-900/30 hover:shadow-xl backdrop-blur-xl'
                }`}>
                  <div className="flex items-start space-x-3">
                    {message.sender === 'bot' && (
                      <Bot className="w-5 h-5 mt-1 text-blue-300 flex-shrink-0 animate-pulse" />
                    )}
                    {message.sender === 'user' && (
                      <User className="w-5 h-5 mt-1 text-blue-100 flex-shrink-0" />
                    )}
                    <span className="text-base leading-relaxed">{message.text}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-blue-900/20 text-blue-100/95 border border-blue-300/20 rounded-2xl px-6 py-4 hover:bg-blue-900/30 transition-all duration-300 backdrop-blur-xl">
                  <div className="flex items-center space-x-3">
                    <Bot className="w-5 h-5 text-blue-300 animate-pulse" />
                    <span className="text-base">Consulting the stars...</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced Chat Input */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex space-x-4">
            <Input
              type="text"
              placeholder="Ask your problem"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-blue-800/20 border-blue-300/30 text-blue-100 placeholder-blue-200/60 focus:border-blue-400 focus:ring-blue-400/30 h-12 text-base transition-all duration-300 chat-input focus:scale-[1.01] backdrop-blur-xl"
            />
            <Button 
              onClick={sendMessage}
              className="bg-blue-500/80 hover:bg-blue-600/90 text-white px-8 border-0 h-12 hover:scale-105 transition-all duration-300 hover:shadow-lg cosmic-glow"
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
