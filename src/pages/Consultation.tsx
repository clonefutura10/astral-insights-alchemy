
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import ScrollReveal from '../components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Moon, Send, User, Bot, Key, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Consultation = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [groqApiKey, setGroqApiKey] = useState('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');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  });
  const [hasProvidedInfo, setHasProvidedInfo] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Welcome message
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'assistant',
        content: `Namaste! I am Pandit Pradeep Kiradoo. Welcome to this sacred space where ancient wisdom meets modern understanding.

"Bhagya badla nahi ja sakta, par sawara ja sakta hai" - Your destiny cannot be changed, but it can be refined and understood.

Before we begin our consultation, I need some basic information about you:
- Your full name
- Birth date
- Birth time (if known)
- Birth place

Please share these details so I can provide you with meaningful astrological insights.`,
        timestamp: new Date()
      }]);
    }
  }, []);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      // Check if user has provided basic info
      if (!hasProvidedInfo && !checkIfInfoProvided(currentMessage)) {
        const response = await getAIResponse(currentMessage, false);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        if (!hasProvidedInfo) {
          setHasProvidedInfo(true);
          extractUserInfo(currentMessage);
        }
        
        const response = await getAIResponse(currentMessage, true);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfInfoProvided = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return lowerMessage.includes('name') || 
           lowerMessage.includes('born') || 
           lowerMessage.includes('birth') ||
           /\d{1,2}\/\d{1,2}\/\d{4}/.test(message) ||
           /\d{1,2}-\d{1,2}-\d{4}/.test(message);
  };

  const extractUserInfo = (message: string) => {
    // Simple extraction logic - in a real app, this would be more sophisticated
    const lines = message.split('\n');
    lines.forEach(line => {
      if (line.toLowerCase().includes('name')) {
        const name = line.split(':')[1]?.trim() || '';
        setUserInfo(prev => ({ ...prev, name }));
      }
      // Add more extraction logic as needed
    });
  };

  const getAIResponse = async (userMessage: string, hasBasicInfo: boolean): Promise<string> => {
    if (!groqApiKey.trim()) {
      throw new Error('API key required');
    }

    const systemPrompt = hasBasicInfo 
      ? `You are Pandit Pradeep Kiradoo, a wise and compassionate Vedic astrology expert. The user has provided their basic information. Now provide detailed astrological insights based on their questions. Always remind them that "Bhagya badla nahi ja sakta, par sawara ja sakta hai" - focus on understanding and clarity, not remedies. Be warm, wise, and insightful in your responses.`
      : `You are Pandit Pradeep Kiradoo, a wise Vedic astrology expert. The user hasn't provided their complete birth information yet. Gently guide them to share their full name, birth date, birth time, and birth place. Be warm and encouraging, explaining why this information is important for accurate astrological analysis.`;

    const conversationHistory = messages.slice(-5).map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white">
      {/* Floating Stars Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-20 p-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Moon className="w-8 h-8 text-yellow-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
            Pandit Pradeep Kiradoo
          </span>
        </Link>
        <div className="flex items-center space-x-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className="border-purple-500/50 text-purple-300"
          >
            <Key className="w-4 h-4 mr-2" />
            API Key
          </Button>
          <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-yellow-400 transition-colors">About</Link>
          <Link to="/consultation" className="text-yellow-400">Consultation</Link>
        </div>
      </nav>

      {/* API Key Input */}
      {showApiKeyInput && (
        <div className="relative z-10 container mx-auto px-6 mb-4">
          <Card className="max-w-md mx-auto bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-purple-500/30 p-4">
            <Label className="text-purple-200 mb-2 block">Groq API Key</Label>
            <Input
              type="password"
              value={groqApiKey}
              onChange={(e) => setGroqApiKey(e.target.value)}
              className="bg-purple-900/30 border-purple-500/50 text-white"
              placeholder="Enter your Groq API key"
            />
            <p className="text-xs text-purple-400 mt-1">
              Get your free API key from{' '}
              <a href="https://console.groq.com/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
                console.groq.com
              </a>
            </p>
          </Card>
        </div>
      )}

      {/* Chat Interface */}
      <div className="relative z-10 container mx-auto px-6 pb-6">
        <Card className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-purple-500/30 h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="p-6 border-b border-purple-500/30">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Astrological Consultation Chat
            </h1>
            <p className="text-purple-200 mt-2">
              Connect with ancient wisdom through personalized guidance
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                      : 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 text-yellow-100'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'assistant' && (
                      <Bot className="w-5 h-5 mt-1 text-yellow-400 flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <User className="w-5 h-5 mt-1 text-white flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                      <div className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-yellow-400" />
                    <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
                    <span className="text-yellow-100 text-sm">Pandit Ji is reflecting...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-purple-500/30">
            <div className="flex space-x-4">
              <Textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share your concerns, questions, or birth details..."
                className="flex-1 bg-purple-900/30 border-purple-500/50 text-white resize-none"
                rows={2}
              />
              <Button
                onClick={sendMessage}
                disabled={!currentMessage.trim() || isLoading}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer Quote */}
        <div className="text-center mt-8">
          <ScrollReveal
            baseOpacity={0.3}
            enableBlur={true}
            baseRotation={1}
            blurStrength={3}
          >
            "भाग्य बदला नहीं जा सकता, पर संवारा जा सकता है"
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default Consultation;
