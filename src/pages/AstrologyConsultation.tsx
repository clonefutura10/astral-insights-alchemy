
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
      text: "🌟 **Namaste! I'm Pandit Pradeep Kiradoo.** I'm here to help you understand your life's challenges through Vedic astrology. Please tell me what's currently troubling you or what situation you're facing in your life right now.",
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
      // Try GROQ API first
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
      if (questionCount >= 5 && consultationStage === 'gathering') {
        setConsultationStage('analysis');
      }
      
    } catch (error) {
      console.error('Error processing message:', error);
      // Use fallback response system
      const fallbackResponse = getFallbackResponse(userInput, questionCount, consultationStage);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: fallbackResponse,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setQuestionCount(prev => prev + 1);
      
      // Update consultation stage
      if (questionCount >= 5 && consultationStage === 'gathering') {
        setConsultationStage('analysis');
      }
    }
    
    setIsLoading(false);
  };

  const getFallbackResponse = (userInput: string, questionCount: number, stage: ConsultationStage): string => {
    const lowerInput = userInput.toLowerCase();
    
    // Stage-based responses
    if (stage === 'initial' || questionCount === 0) {
      if (lowerInput.includes('career') || lowerInput.includes('job') || lowerInput.includes('work')) {
        return "I understand you're facing **career challenges**. This is a very common concern I help people with through Vedic astrology.\n\nCan you tell me more specifically:\n\n1. **When did these career problems begin?** Was there a particular month or year?\n\n2. **What exactly is happening** - are you unable to find work, facing issues at your current job, or feeling stuck in your career growth?\n\n3. **Have you been experiencing this continuously** or does it come in phases?";
      } else if (lowerInput.includes('relationship') || lowerInput.includes('marriage') || lowerInput.includes('love')) {
        return "**Relationship matters** are deeply connected to planetary influences, especially Venus and the 7th house in your chart.\n\nTo better understand your situation:\n\n1. Are you facing issues in **finding a suitable partner**, or problems in an **existing relationship**?\n\n2. **When did you first notice** these relationship challenges?\n\n3. Is this **affecting other areas** of your life as well?";
      } else if (lowerInput.includes('health') || lowerInput.includes('illness') || lowerInput.includes('disease')) {
        return "**Health concerns** often reflect planetary imbalances that can be understood through astrological analysis.\n\nLet me gather some details:\n\n1. What **specific health issues** are you experiencing?\n\n2. **When did these health problems begin?**\n\n3. Are there any **patterns** - do they worsen during certain times of the year?";
      } else if (lowerInput.includes('money') || lowerInput.includes('financial') || lowerInput.includes('business')) {
        return "**Financial difficulties** can stem from various planetary positions, particularly related to wealth and income houses.\n\nHelp me understand:\n\n1. Are you facing **sudden financial losses**, inability to save money, or **business-related problems**?\n\n2. **When did your financial troubles begin?**\n\n3. Have you noticed if these problems are **cyclical or constant**?";
      } else {
        return "Thank you for sharing your concern with me. To provide you with **accurate astrological guidance**, I need to understand your situation better:\n\n1. Can you describe in **more detail what specific problems** you're experiencing?\n\n2. **When did you first notice** these issues starting?\n\n3. How is this **affecting your daily life** and peace of mind?";
      }
    }
    
    // Follow-up questions based on count
    if (questionCount === 1) {
      return "I see. This gives me **important insights** into your situation.\n\nNow, to analyze the planetary influences more accurately:\n\n1. During which **specific months or seasons** do you feel these problems are most intense?\n\n2. Have you **consulted any astrologer before** about this matter?\n\n3. Do you feel there are **particular days of the week** when things are more challenging?";
    } else if (questionCount === 2) {
      return "Thank you for sharing these details. The **timing and patterns** you've described are very telling from an astrological perspective.\n\nA few more questions:\n\n1. Do you feel more **stressed or face more obstacles** during certain times of the day?\n\n2. Has **anyone in your family** faced similar challenges?\n\n3. What are your **main hopes and expectations** from resolving this situation?";
    } else if (questionCount === 3) {
      return "This information is helping me understand the **cosmic influences** affecting you.\n\nLet me ask:\n\n1. Are there any **specific colors** you're naturally drawn to or avoid?\n\n2. Do you have any **spiritual practices** or religious observances?\n\n3. How would you describe your **general energy levels** throughout the day?";
    } else if (questionCount >= 4 && stage === 'gathering') {
      setConsultationStage('analysis');
      return "Based on our detailed discussion, I can now provide you with an **astrological analysis** of your situation:\n\n---\n\n# **PLANETARY ANALYSIS REPORT**\n\n## 🔴 **Challenging Planetary Influences:**\n\n• **Saturn (Shani)** appears to be creating obstacles and delays in your path, causing the persistent difficulties you're experiencing\n\n• **Mars (Mangal)** may be contributing to conflicts and aggressive situations in your environment\n\n• **Rahu** (North Node) seems to be creating confusion and unconventional challenges\n\n## 🟢 **Supporting Planetary Forces:**\n\n• **Jupiter (Guru)** is providing you with wisdom and the ability to seek guidance, which is why you've reached out\n\n• **Venus (Shukra)** is offering some protection in relationships and material comforts\n\n• **Mercury (Budh)** is supporting your communication and decision-making abilities\n\n---\n\n## **Key Insights:**\n\nThe combination of **Saturn and Rahu** is creating what we call **'Shani-Rahu Yutti'** effects in your life, causing unexpected delays and obstacles. However, **Jupiter's supportive influence** suggests that with proper understanding and patience, these challenges will transform into opportunities for growth.\n\nYour planetary influences indicate this is a **temporary phase** that will improve as these cosmic transits change. The difficulties you're facing are actually **preparing you for a much stronger and more successful period** ahead.\n\n**The cosmic energies are currently testing your patience and resilience, but they are also building your inner strength for the prosperous times that await you.**";
    } else {
      return "Thank you for your patience in answering my questions. This detailed information allows me to provide you with **more specific guidance** about the planetary influences in your life.\n\nIs there any **particular aspect** of your situation you'd like me to explain further?";
    }
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
- DO NOT ask for birth details, time, or place - work without them
- DO NOT suggest remedies or solutions - only analyze and explain planetary influences
- Use proper markdown formatting in your responses
- After 5-6 exchanges, provide a detailed planetary report explaining which planets are causing challenges and which are supporting them
- Format reports with proper headings, bullet points, and emphasis

Previous conversation:
${conversationHistory}

Current user message: ${userInput}

Respond as Pandit Pradeep Kiradoo with wisdom and empathy, using markdown formatting.`;

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

  // Function to render markdown-like formatting
  const renderMessageText = (text: string) => {
    // Split text by double newlines to create paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, paragraphIndex) => {
      // Check if paragraph contains numbered list items
      const lines = paragraph.split('\n');
      const hasNumberedList = lines.some(line => /^\d+\.\s/.test(line.trim()));
      
      if (hasNumberedList) {
        return (
          <div key={paragraphIndex} className="mb-4">
            {lines.map((line, lineIndex) => {
              const trimmedLine = line.trim();
              if (/^\d+\.\s/.test(trimmedLine)) {
                // This is a numbered list item
                const content = trimmedLine.replace(/^\d+\.\s/, '');
                const parts = content.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
                
                return (
                  <div key={lineIndex} className="mb-2 pl-4">
                    <span className="text-blue-300 font-semibold mr-2">
                      {trimmedLine.match(/^\d+\./)[0]}
                    </span>
                    {parts.map((part, partIndex) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={partIndex} className="text-blue-200 font-semibold">{part.slice(2, -2)}</strong>;
                      } else if (part.startsWith('*') && part.endsWith('*')) {
                        return <em key={partIndex} className="text-blue-300 italic">{part.slice(1, -1)}</em>;
                      } else {
                        return <span key={partIndex}>{part}</span>;
                      }
                    })}
                  </div>
                );
              } else if (trimmedLine) {
                // Regular text line in a numbered list context
                const parts = trimmedLine.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
                return (
                  <div key={lineIndex} className="mb-2">
                    {parts.map((part, partIndex) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={partIndex} className="text-blue-200 font-semibold">{part.slice(2, -2)}</strong>;
                      } else if (part.startsWith('*') && part.endsWith('*')) {
                        return <em key={partIndex} className="text-blue-300 italic">{part.slice(1, -1)}</em>;
                      } else {
                        return <span key={partIndex}>{part}</span>;
                      }
                    })}
                  </div>
                );
              }
              return null;
            })}
          </div>
        );
      } else {
        // Regular paragraph processing
        const parts = paragraph.split(/(\*\*[^*]+\*\*|\*[^*]+\*|#{1,6}\s[^\n]+|•\s[^\n]+)/g);
        
        return (
          <div key={paragraphIndex} className="mb-4">
            {parts.map((part, index) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="text-blue-200 font-semibold">{part.slice(2, -2)}</strong>;
              } else if (part.startsWith('*') && part.endsWith('*')) {
                return <em key={index} className="text-blue-300 italic">{part.slice(1, -1)}</em>;
              } else if (part.startsWith('#')) {
                const level = part.match(/^#+/)[0].length;
                const text = part.replace(/^#+\s/, '');
                const className = level === 1 ? 'text-xl font-bold text-yellow-300 mb-2 mt-4' : 
                                 level === 2 ? 'text-lg font-bold text-blue-200 mb-2 mt-3' : 
                                 'text-base font-semibold text-blue-300 mb-1 mt-2';
                return <div key={index} className={className}>{text}</div>;
              } else if (part.startsWith('• ')) {
                return <div key={index} className="ml-4 mb-1 text-blue-100">• {part.slice(2)}</div>;
              } else if (part === '---') {
                return <hr key={index} className="border-blue-300/30 my-4" />;
              } else {
                return <span key={index}>{part}</span>;
              }
            })}
          </div>
        );
      }
    });
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
                      <div className="text-base leading-relaxed">
                        {renderMessageText(message.text)}
                      </div>
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
                Questions: {questionCount}/6 • 
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
