
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import ScrollReveal from '../components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Moon, Star, Send, User, Calendar, Clock, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Consultation = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    problem: '',
    questions: [],
    additionalInfo: ''
  });
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [report, setReport] = useState('');
  const [groqApiKey, setGroqApiKey] = useState('');
  
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Animate header
    if (headerRef.current) {
      gsap.fromTo(headerRef.current.children,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          stagger: 0.2,
          ease: "power2.out"
        }
      );
    }

    // Animate form sections
    if (formRef.current) {
      gsap.fromTo(formRef.current,
        { opacity: 0, scale: 0.9 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.8,
          ease: "power2.out"
        }
      );
    }
  }, [step]);

  const addQuestion = () => {
    if (currentQuestion.trim()) {
      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions, currentQuestion.trim()]
      }));
      setCurrentQuestion('');
    }
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const generateReport = async () => {
    if (!groqApiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Groq API key to generate the analysis.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `
As Pandit Pradeep Kiradoo, a Vedic astrology expert, analyze this consultation:

Personal Details:
Name: ${formData.name}
Birth Date: ${formData.birthDate}
Birth Time: ${formData.birthTime}
Birth Place: ${formData.birthPlace}

Main Problem: ${formData.problem}

Specific Questions:
${formData.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Additional Information: ${formData.additionalInfo}

Please provide a detailed astrological analysis that:
1. Identifies the planetary influences affecting this person's situation
2. Explains the root causes from an astrological perspective
3. Provides deep insights into their challenges and patterns
4. Offers understanding about their karmic lessons
5. Gives clarity about their life path and purpose

Remember: "Bhagya badla nahi ja sakta, par sawara ja sakta hai" - Focus on understanding and clarity, not remedies.

Write in a compassionate, wise tone as Pandit Pradeep Kiradoo would speak.
      `;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are Pandit Pradeep Kiradoo, a wise and compassionate Vedic astrology expert with deep knowledge of planetary influences and their effects on human life. Provide insightful, detailed analysis without suggesting remedies - focus on understanding and clarity.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      setReport(data.choices[0].message.content);
      setStep(4);
      
      toast({
        title: "Analysis Complete",
        description: "Your astrological analysis has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate analysis. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
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
        <div className="space-x-6">
          <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-yellow-400 transition-colors">About</Link>
          <Link to="/consultation" className="text-yellow-400">Consultation</Link>
        </div>
      </nav>

      {/* Header */}
      <div ref={headerRef} className="relative z-10 container mx-auto px-6 py-12 text-center">
        <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-400 animate-pulse" />
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          Your Astrological Consultation
        </h1>
        <p className="text-xl text-purple-200 mb-8">
          Share your concerns and let the stars guide you to clarity
        </p>
        
        {/* Progress Indicator */}
        <div className="flex justify-center space-x-4 mb-8">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= num ? 'bg-yellow-400 text-black' : 'bg-purple-800 text-purple-300'
              } transition-all duration-300`}
            >
              {num}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div ref={formRef} className="relative z-10 container mx-auto px-6 pb-20">
        <Card className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-purple-500/30 p-8">
          
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-6 flex items-center text-yellow-400">
                <User className="w-8 h-8 mr-3" />
                Personal Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-purple-200 mb-2 block">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-purple-900/30 border-purple-500/50 text-white"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="birthPlace" className="text-purple-200 mb-2 block">Birth Place</Label>
                  <Input
                    id="birthPlace"
                    value={formData.birthPlace}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthPlace: e.target.value }))}
                    className="bg-purple-900/30 border-purple-500/50 text-white"
                    placeholder="City, State, Country"
                  />
                </div>
                
                <div>
                  <Label htmlFor="birthDate" className="text-purple-200 mb-2 block">Birth Date</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                    className="bg-purple-900/30 border-purple-500/50 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="birthTime" className="text-purple-200 mb-2 block">Birth Time</Label>
                  <Input
                    id="birthTime"
                    type="time"
                    value={formData.birthTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
                    className="bg-purple-900/30 border-purple-500/50 text-white"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={nextStep}
                  disabled={!formData.name || !formData.birthDate || !formData.birthPlace}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Problem Description */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-6 flex items-center text-yellow-400">
                <Star className="w-8 h-8 mr-3" />
                Describe Your Situation
              </h2>
              
              <div>
                <Label htmlFor="problem" className="text-purple-200 mb-2 block">
                  What challenges or concerns are you facing?
                </Label>
                <Textarea
                  id="problem"
                  value={formData.problem}
                  onChange={(e) => setFormData(prev => ({ ...prev, problem: e.target.value }))}
                  className="bg-purple-900/30 border-purple-500/50 text-white min-h-32"
                  placeholder="Describe your main concerns, challenges, or areas where you seek clarity..."
                />
              </div>
              
              <div>
                <Label className="text-purple-200 mb-2 block">
                  Additional Information (Optional)
                </Label>
                <Textarea
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  className="bg-purple-900/30 border-purple-500/50 text-white"
                  placeholder="Any other details you'd like to share..."
                />
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep} className="border-purple-500/50 text-purple-300">
                  Previous
                </Button>
                <Button 
                  onClick={nextStep}
                  disabled={!formData.problem.trim()}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Questions & API Key */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-6 flex items-center text-yellow-400">
                <Send className="w-8 h-8 mr-3" />
                Specific Questions & API Setup
              </h2>
              
              <div>
                <Label className="text-purple-200 mb-2 block">
                  Groq API Key (Required for Analysis)
                </Label>
                <Input
                  type="password"
                  value={groqApiKey}
                  onChange={(e) => setGroqApiKey(e.target.value)}
                  className="bg-purple-900/30 border-purple-500/50 text-white"
                  placeholder="Enter your Groq API key"
                />
                <p className="text-sm text-purple-400 mt-1">
                  Get your free API key from{' '}
                  <a href="https://console.groq.com/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
                    console.groq.com
                  </a>
                </p>
              </div>
              
              <div>
                <Label className="text-purple-200 mb-2 block">
                  Specific Questions (Optional)
                </Label>
                <div className="flex space-x-2 mb-4">
                  <Input
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    className="bg-purple-900/30 border-purple-500/50 text-white flex-1"
                    placeholder="Ask a specific question..."
                    onKeyPress={(e) => e.key === 'Enter' && addQuestion()}
                  />
                  <Button onClick={addQuestion} size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.questions.map((question, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-purple-700/50 text-purple-100 cursor-pointer hover:bg-purple-700/70"
                      onClick={() => removeQuestion(index)}
                    >
                      {question} ×
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep} className="border-purple-500/50 text-purple-300">
                  Previous
                </Button>
                <Button 
                  onClick={generateReport}
                  disabled={isLoading || !groqApiKey.trim()}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Generate Analysis'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Report */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-6 flex items-center text-yellow-400">
                <Star className="w-8 h-8 mr-3" />
                Your Astrological Analysis
              </h2>
              
              <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/30 p-6">
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-purple-100 leading-relaxed">
                    {report}
                  </div>
                </div>
              </Card>
              
              <div className="text-center space-y-4">
                <ScrollReveal
                  baseOpacity={0.3}
                  enableBlur={true}
                  baseRotation={1}
                  blurStrength={3}
                >
                  May this analysis bring you clarity and peace on your journey.
                </ScrollReveal>
                
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={() => {
                      setStep(1);
                      setFormData({
                        name: '',
                        birthDate: '',
                        birthTime: '',
                        birthPlace: '',
                        problem: '',
                        questions: [],
                        additionalInfo: ''
                      });
                      setReport('');
                    }}
                    variant="outline"
                    className="border-purple-500/50 text-purple-300"
                  >
                    New Consultation
                  </Button>
                  <Link to="/">
                    <Button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
                      Return Home
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Consultation;
