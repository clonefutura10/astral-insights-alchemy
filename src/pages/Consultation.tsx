import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '../components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Moon, Star, Sun, Send, Bot, User, Key, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

const Consultation = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create floating stars animation
    if (starsRef.current) {
      const stars = starsRef.current.children;
      gsap.to(stars, {
        y: -20,
        duration: 2,
        ease: "power2.inOut",
        stagger: 0.1,
        repeat: -1,
        yoyo: true
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
    // Simple logic to generate different responses
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('horoscope')) {
      return "I can provide general information about horoscopes, but for a personalized reading, please provide your birth details.";
    } else if (lowerMessage.includes('future')) {
      return "The future is not fixed, but influenced by our actions. I can offer insights based on astrological patterns.";
    } else if (lowerMessage.includes('career')) {
      return "In terms of career, your planetary alignment suggests a path in [specific field]. However, this is a general reading.";
    } else {
      return "Thank you for your message! I'm processing your request. For more detailed advice, consider a personalized consultation.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
      <Header />
      
      {/* Floating Stars Background */}
      <div ref={starsRef} className="fixed inset-0 pointer-events-none z-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main Content - Added pt-20 for header spacing */}
      <div className="relative z-10 container mx-auto px-6 py-10 pt-24 min-h-screen">
        <Card className="bg-black/50 backdrop-blur-md border border-white/10 p-6 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Ask an Astrologer</h2>
          <div ref={chatContainerRef} className="space-y-4 mb-4 max-h-[500px] overflow-y-auto px-2">
            {messages.map(message => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-xl px-4 py-2 ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-xl px-4 py-2 bg-gray-800 text-gray-300">
                  Loading...
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Ask your question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-grow bg-black/30 border-white/20 text-white placeholder-gray-400"
            />
            <Button onClick={sendMessage} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
              Send <Send className="ml-2" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            <Sparkles className="inline-block mr-1" /> Get instant answers and guidance.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Consultation;
