import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Header from '../components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User, Star, Moon, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      text: "🌟 Namaste! I'm Pandit Pradeep Kiradoo. I'm here to help you understand your life's challenges through Vedic astrology. Please tell me what's currently troubling you or what situation you're facing in your life right now.",
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [consultationStage, setConsultationStage] = useState<ConsultationStage>('initial');
  const [questionCount, setQuestionCount] = useState(0);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
    
    // Add user input to conversation history
    const newHistory = [...conversationHistory, userInput];
    setConversationHistory(newHistory);
    
    try {
      // Use GROQ API
      const response = await getGroqResponse(userInput);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, botMessage]);
      setQuestionCount(prev => prev + 1);
      
      // Update consultation stage based on question count
      if (questionCount >= 4 && consultationStage === 'gathering') {
        setConsultationStage('analysis');
      }
      
    } catch (error) {
      console.error('GROQ API failed, using fallback:', error);
      // Use fallback response system
      const fallbackResponse = getFallbackResponse(userInput, questionCount, consultationStage, newHistory);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: fallbackResponse,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Only increment question count and update stage after successful response
      const newQuestionCount = questionCount + 1;
      setQuestionCount(newQuestionCount);
      
      // Update consultation stage
      if (newQuestionCount >= 5) {
        setConsultationStage('report');
      } else if (newQuestionCount >= 1) {
        setConsultationStage('gathering');
      }
    }
    
    setIsLoading(false);
  };

  const getGroqResponse = async (userInput: string): Promise<string> => {
    // Build context from conversation history
    const conversationHistory = messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
    
    const systemPrompt = `You are Pandit Pradeep Kiradoo, an expert Vedic astrologer conducting a consultation. Your role is to:

1. Ask probing questions to deeply understand the person's problem
2. Gather specific details about their situation, timing, and circumstances
3. Eventually provide a detailed planetary analysis report with solutions

Current consultation stage: ${consultationStage}
Questions asked so far: ${questionCount}

Guidelines:
- Ask 2-3 follow-up questions to understand their problem better
- Be empathetic, wise, and professional
- Focus on understanding WHEN, WHERE, HOW the problem manifests
- DO NOT ask for birth details, time, or place - work without them
- After 5-6 exchanges, provide a detailed planetary report with complete solutions including Karakatva, Samasya, and Upay
- Use proper markdown formatting with proper line breaks
- Format solutions with detailed remedies, mantras, stones, and relationships

When providing final analysis, include detailed solutions in this format for each planet:

## **[Planet Name]**
**Karakatva (Represents):** [What it represents]

**Samasya:** [Problems when weak]

**Upay:**
- [Remedy 1]
- [Remedy 2] 
- **Jaap:** "[Mantra]"
- **Relationship:** [Family relationship guidance]
- **Stone:** [Gemstone with benefits]

Previous conversation:
${conversationHistory}

Current user message: ${userInput}

Respond as Pandit Pradeep Kiradoo with wisdom and empathy, using markdown formatting.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer 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`,
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
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`GROQ API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const getFallbackResponse = (userInput: string, currentQuestionCount: number, stage: ConsultationStage, history: string[]): string => {
    const lowerInput = userInput.toLowerCase();
    
    console.log('Fallback - Question count:', currentQuestionCount, 'Stage:', stage, 'History length:', history.length);
    
    // If we've reached 5+ questions, provide final analysis with complete solutions
    if (currentQuestionCount >= 5 || stage === 'report') {
      return `Based on our detailed discussion, I can now provide you with a comprehensive astrological analysis with complete solutions:

## **PLANETARY ANALYSIS REPORT WITH SOLUTIONS**

### 🔴 **Challenging Planetary Influences & Their Remedies:**

## **1. Surya (Sun)**
**Karakatva (Represents):** Pratishtha, Naam, Tej, Pita (Status, Fame, Radiance, Father)

**Samasya:** Agar Surya kamzor hai to aatma-vishwas ki kami, pitaji se madhbhed, pehchan mein kami hoti hai

**Upay:**
- Surya ko daily jal chadhana (subah ke samay)
- Aditya Hriday Stotra ka paath
- **Jaap:** "Om Suryaay Namaha" (108 baar daily)
- **Relationship:** Pitaji ya sasur ji ki seva, unka maan-samman
- **Stone:** Manik (Ruby) dharan karna - Surya ki shakti badhata hai


## **2. Chandra (Moon)** 
**Karakatva (Represents):** Mann, Maa, Shanti (Mind, Mother, Peace)

**Samasya:** Ashanti, decision making mein confusion, mann ka sthir na rehna

**Upay:**
- Shiv ki upasana (especially Somvaar ko)
- Shivling par jal chadhana
- **Jaap:** "Om Namah Shivaya" (108 baar)
- **Relationship:** Maa ya saas ki seva aur samman
- **Brahman ko daan:** Cheeni aur chawal Somvaar ko
- **Stone:** Moti (Pearl) chandi ki ring mein dharan karna


## **3. Mangal (Mars)**
**Karakatva (Represents):** Saahas, Gussa, Parakram (Courage, Anger, Valor)

**Samasya:** Atyadhik gussa, hinsa, accidents, bhai-behan se anban, issues in getting married

**Upay:**
- Hanuman ji ki upasana
- Hanuman Chalisa ka paath (roz ya Mangal/Shani ko 7 baar)
- **Jaap:** "Om Hanumate Namaha" 
- **Relationship:** Bhai-behan se prem aur seva
- **Stone:** Moonga (Red Coral) dharan karna


### 🟢 **Supporting Planetary Forces:**

## **4. Guru (Jupiter)**
**Karakatva (Represents):** Gyan, Vidya, Santaan (Wisdom, Education, Children)

**Samasya:** Agar kamzor hai to galat decisions, adhyatmik shakti ki kami

**Upay:**
- Brihaspativar ko vrat
- **Jaap:** "Om Gurave Namaha"
- **Relationship:** Guru aur buzurgon ka samman
- **Stone:** Pukhraj (Yellow Sapphire)


## **5. Shukra (Venus)**
**Karakatva (Represents):** Prem, Sundarta, Dhan (Love, Beauty, Wealth)

**Upay:**
- Shukravar ko Lakshmi puja
- **Jaap:** "Om Shukraay Namaha"
- **Stone:** Heera (Diamond) ya Safed Pukhraj


### **🔮 Important Guidelines:**

1. **Timing:** Subah 6-8 baje ka samay sabse uchit hai remedies ke liye
2. **Consistency:** Kam se kam 40 din lagatar karna zaroori hai
3. **Faith:** Poore vishwas aur shraddha ke saath karna chahiye
4. **Donation:** Har Somvaar ko kuch na kuch daan karna beneficial hai

*Your planetary configuration shows this challenging phase will improve significantly with consistent practice of these remedies. The cosmic energies are aligning to support your growth.*

Would you like me to explain any specific remedy in more detail?`;
    }
    
    // Progressive questioning based on current count
    if (currentQuestionCount === 0) {
      if (lowerInput.includes('career') || lowerInput.includes('job') || lowerInput.includes('work')) {
        return `I understand you're facing career challenges. This is a very common concern I help people with through Vedic astrology. Can you tell me more specifically:

1. When did these career problems begin? Was there a particular month or year?

2. What exactly is happening - are you unable to find work, facing issues at your current job, or feeling stuck in your career growth?

3. Have you been experiencing this continuously or does it come in phases?`;
      } else if (lowerInput.includes('relationship') || lowerInput.includes('marriage') || lowerInput.includes('love')) {
        return `Relationship matters are deeply connected to planetary influences, especially Venus and the 7th house in your chart. To better understand your situation:

1. Are you facing issues in finding a suitable partner, or problems in an existing relationship?

2. When did you first notice these relationship challenges?

3. Is this affecting other areas of your life as well?`;
      } else {
        return `Thank you for sharing your concern with me. To provide you with accurate astrological guidance, I need to understand your situation better:

1. Can you describe in more detail what specific problems you're experiencing?

2. When did you first notice these issues starting?

3. How is this affecting your daily life and peace of mind?`;
      }
    } else if (currentQuestionCount === 1) {
      return `I see. This gives me important insights into your situation. Now, to analyze the planetary influences more accurately:

1. During which specific months or seasons do you feel these problems are most intense?

2. Have you consulted any astrologer before about this matter?

3. Do you feel more stressed or face more obstacles during certain days of the week?`;
    } else if (currentQuestionCount === 2) {
      return `Thank you for sharing these details. The timing and patterns you've described are very telling from an astrological perspective. A few more questions:

1. Has anyone in your family faced similar challenges?

2. What time of day do you generally feel most positive or most troubled?

3. Are there any specific colors you're naturally drawn to or avoid?`;
    } else if (currentQuestionCount === 3) {
      return `This information is helping me understand the cosmic influences affecting you. Let me ask:

1. Do you have any spiritual practices or religious observances?

2. What are your hopes and expectations from resolving this situation?

3. Have you noticed any dreams or signs that seemed significant during this difficult period?`;
    } else if (currentQuestionCount === 4) {
      return `Your responses are giving me a clear picture of the planetary influences at play. One final question:

1. Do you prefer mornings or evenings? When do you feel most energetic?

2. Have there been any major changes in your life in the past year?

3. What would you consider your biggest strength in handling difficult situations?`;
    }
    
    return "Thank you for your patience. Let me analyze all the information you've provided to give you a comprehensive astrological reading with complete solutions.";
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

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
                      <div 
                        className="text-base leading-relaxed prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: message.text
                            .replace(/\n\n/g, '<br><br>')
                            .replace(/\n/g, '<br>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
                            .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
                            .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
                            .replace(/^• (.*$)/gm, '<div class="ml-4 mb-2">• $1</div>')
                            .replace(/^(\d+)\. (.*$)/gm, '<div class="mb-3"><strong>$1.</strong> $2</div>')
                        }}
                      />
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
                disabled={isLoading}
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
                Questions: {questionCount}/5 • 
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
