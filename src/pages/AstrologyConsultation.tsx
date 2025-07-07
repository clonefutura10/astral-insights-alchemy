
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Header from '../components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User, Star, Moon, Sun } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp?: string;
}

interface UserProfile {
  name?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  currentConcern?: string;
  problemDetails?: string;
  lifeArea?: string;
  timeframe?: string;
  previousExperience?: string;
  additionalInfo?: string;
}

type ConsultationStage = 'initial' | 'gathering' | 'analysis' | 'report';

const AstrologyConsultation = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: "🌟 Namaste! I'm here to help you understand your life's challenges through Vedic astrology. Please tell me what's currently troubling you or what situation you're facing in your life right now.",
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [consultationStage, setConsultationStage] = useState<ConsultationStage>('initial');
  const [questionCount, setQuestionCount] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Check for initial message from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialMessage = urlParams.get('message');
    
    if (initialMessage) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: decodeURIComponent(initialMessage),
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setConsultationStage('gathering');
      
      // Process the initial message
      setTimeout(() => {
        processUserMessage(decodeURIComponent(initialMessage));
      }, 1000);
      
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      gsap.to(chatContainerRef.current, {
        scrollTop: chatContainerRef.current.scrollHeight,
        duration: 0.8,
        ease: "power2.out"
      });
    }
  }, [messages]);

  const processUserMessage = async (userInput: string) => {
    setIsLoading(true);
    
    try {
      // Use GROQ API for intelligent responses
      const response = await getAIResponse(userInput);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, botMessage]);
      setQuestionCount(prev => prev + 1);
      
      // Update consultation stage based on question count
      if (questionCount >= 6 && consultationStage === 'gathering') {
        setConsultationStage('analysis');
      }
      
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "I apologize for the technical difficulty. Let me continue with your consultation based on what you've shared so far. Could you please tell me more about when this problem started and how it's affecting your daily life?",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setIsLoading(false);
  };

  const getAIResponse = async (userInput: string): Promise<string> => {
    const apiKey = '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';
    
    // Build context from conversation history
    const conversationHistory = messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
    
    const systemPrompt = `You are Pandit Pradeep Kiradoo, an expert Vedic astrologer conducting a consultation. Your role is to:

1. Ask probing questions to deeply understand the person's problem
2. Gather specific details about their situation, timing, and circumstances
3. Eventually provide a detailed planetary analysis report (NOT remedies)

Current consultation stage: ${consultationStage}
Questions asked so far: ${questionCount}

Guidelines:
- Ask 2-3 follow-up questions to understand their problem better
- Be empathetic, wise, and professional
- Focus on understanding WHEN, WHERE, HOW the problem manifests
- Ask about their birth details when appropriate for analysis
- DO NOT suggest remedies or solutions - only analyze and explain planetary influences
- After 6-8 exchanges, provide a detailed planetary report explaining which planets are causing challenges and which are supporting them

Previous conversation:
${conversationHistory}

Current user message: ${userInput}

Respond as Pandit Pradeep Kiradoo with wisdom and empathy.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userInput
          }
        ],
        temperature: 0.7,
        max_tokens: 1200,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    
    await processUserMessage(currentInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      <Header />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-blue-200/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8 pt-24 min-h-screen flex flex-col">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-light mb-4 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 bg-clip-text text-transparent">
            Vedic Astrology Consultation
          </h1>
          <p className="text-lg text-blue-100/80 max-w-2xl mx-auto">
            Deep analysis through planetary influences - Understanding your challenges through cosmic wisdom
          </p>
        </div>

        <Card className="bg-blue-900/20 backdrop-blur-xl border border-blue-300/20 flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Chat Messages */}
          <div ref={chatContainerRef} className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[60vh]">
            {messages.map((message, index) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`rounded-2xl px-6 py-4 max-w-3xl transform transition-all duration-300 hover:scale-[1.01] ${
                  message.sender === 'user' 
                    ? 'bg-blue-500/80 text-white hover:bg-blue-600/90 hover:shadow-xl' 
                    : 'bg-blue-900/30 text-blue-100/95 border border-blue-300/20 hover:bg-blue-900/40 hover:shadow-xl backdrop-blur-xl'
                }`}>
                  <div className="flex items-start space-x-3">
                    {message.sender === 'bot' && (
                      <div className="flex space-x-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-300 animate-pulse" />
                        <Moon className="w-4 h-4 text-blue-300 animate-pulse" style={{animationDelay: '0.5s'}} />
                        <Sun className="w-4 h-4 text-orange-300 animate-pulse" style={{animationDelay: '1s'}} />
                      </div>
                    )}
                    {message.sender === 'user' && (
                      <User className="w-5 h-5 mt-1 text-blue-100 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="text-base leading-relaxed whitespace-pre-wrap">{message.text}</div>
                      {message.timestamp && (
                        <div className="text-xs opacity-60 mt-2">
                          {message.timestamp}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-blue-900/30 text-blue-100/95 border border-blue-300/20 rounded-2xl px-6 py-4 backdrop-blur-xl">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <Star className="w-4 h-4 text-yellow-300 animate-spin" />
                      <Moon className="w-4 h-4 text-blue-300 animate-pulse" />
                      <Sun className="w-4 h-4 text-orange-300 animate-bounce" />
                    </div>
                    <span className="text-base">Consulting the cosmic energies...</span>
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

          {/* Input Area */}
          <div className="p-6 border-t border-blue-300/20">
            <div className="flex space-x-4">
              <Textarea
                placeholder="Describe your concern or answer the astrologer's questions..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-blue-800/20 border-blue-300/30 text-blue-100 placeholder-blue-200/60 focus:border-blue-400 focus:ring-blue-400/30 min-h-[60px] max-h-[120px] resize-none backdrop-blur-xl"
              />
              <Button 
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-blue-500/80 hover:bg-blue-600/90 text-white px-8 border-0 hover:scale-105 transition-all duration-300 hover:shadow-lg self-end"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-blue-200/60">
                Stage: <span className="capitalize text-blue-300">{consultationStage}</span> • 
                Questions: {questionCount}/8 • 
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AstrologyConsultation;
