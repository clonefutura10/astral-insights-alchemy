
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '../components/ScrollReveal';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Moon, Star, Sun, Sparkles, BookOpen, Users, Award, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

    // Animate cards on scroll
    if (cardsRef.current) {
      const cards = cardsRef.current.children;
      gsap.fromTo(cards,
        { opacity: 0, scale: 0.8, rotateY: 45 },
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white">
      {/* Floating Stars Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
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
          <Link to="/about" className="text-yellow-400">About</Link>
          <Link to="/consultation" className="hover:text-yellow-400 transition-colors">Consultation</Link>
        </div>
      </nav>

      {/* Header Section */}
      <div ref={headerRef} className="relative z-10 container mx-auto px-6 py-20 text-center">
        <Sparkles className="w-16 h-16 mx-auto mb-6 text-yellow-400 animate-pulse" />
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          About Our Mission
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-purple-200 max-w-4xl mx-auto">
          Bridging ancient wisdom with modern understanding to illuminate your path
        </p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 pb-20">
        {/* Introduction */}
        <div className="mb-20">
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={3}
            blurStrength={8}
            containerClassName="mb-12"
          >
            Pandit Pradeep Kiradoo kehte hain – "Bhagya badla nahi ja sakta, par sawara ja sakta hai." This profound truth forms the foundation of our approach to Jyotish Shastra, the ancient science of astrology.
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Our Philosophy</h2>
              <p className="text-lg leading-8 text-purple-100 mb-6">
                We believe that while destiny cannot be changed, it can certainly be refined and improved. Through the ancient wisdom of Vedic astrology, we help you understand the cosmic influences that shape your life, providing clarity and guidance for navigating life's challenges.
              </p>
              <p className="text-lg leading-8 text-purple-100">
                Our approach combines traditional astrological knowledge with modern analytical techniques, making this ancient science accessible and relevant to contemporary life.
              </p>
            </div>
            <div className="relative">
              <div className="w-full h-64 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-lg flex items-center justify-center">
                <Sun className="w-32 h-32 text-yellow-400 animate-spin" style={{ animationDuration: '20s' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Our Services Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <Card className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-500/30 p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
            <BookOpen className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-white">Ancient Texts</h3>
            <p className="text-purple-200">Based on classical Vedic astrology texts and centuries of wisdom</p>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-900/50 to-blue-900/50 border-blue-500/30 p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
            <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-white">Personal Guidance</h3>
            <p className="text-blue-200">Individual consultations tailored to your unique planetary positions</p>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-cyan-500/30 p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
            <Award className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-white">Expertise</h3>
            <p className="text-cyan-200">Decades of experience in Vedic astrology and spiritual guidance</p>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-pink-500/30 p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
            <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-white">Compassionate</h3>
            <p className="text-pink-200">Understanding approach focused on healing and personal growth</p>
          </Card>
        </div>

        {/* About Pandit Pradeep Kiradoo */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
            About Pandit Pradeep Kiradoo
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-purple-500/30 p-8">
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">Experience & Expertise</h3>
                <p className="text-lg leading-8 text-purple-100 mb-6">
                  With over 25 years of dedicated study and practice in Vedic astrology, Pandit Pradeep Kiradoo has guided thousands of seekers on their spiritual journey. His deep understanding of planetary influences and their impact on human life has made him a trusted advisor for people from all walks of life.
                </p>
                <p className="text-lg leading-8 text-purple-100 mb-6">
                  Pandit ji specializes in understanding the root causes of life's challenges through careful analysis of planetary positions, helping individuals gain clarity about their purpose and path forward.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Vedic Astrology</Badge>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Spiritual Guidance</Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Life Analysis</Badge>
                  <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">Problem Resolution</Badge>
                </div>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/30 p-6">
                <Star className="w-8 h-8 text-yellow-400 mb-3" />
                <h4 className="text-lg font-bold mb-2 text-white">Personalized Approach</h4>
                <p className="text-yellow-100">Every consultation is unique, focusing on your specific planetary configurations and life circumstances.</p>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/30 p-6">
                <Moon className="w-8 h-8 text-purple-400 mb-3" />
                <h4 className="text-lg font-bold mb-2 text-white">Holistic Understanding</h4>
                <p className="text-purple-100">We look at the complete picture of your life, considering all planetary influences and their interconnections.</p>
              </Card>
            </div>
          </div>
        </div>

        {/* Our Methodology */}
        <div className="mb-20">
          <ScrollReveal
            baseOpacity={0.1}
            enableBlur={true}
            baseRotation={2}
            blurStrength={6}
            containerClassName="text-center mb-12"
          >
            Our methodology combines ancient wisdom with modern understanding, ensuring that the timeless knowledge of Jyotish Shastra remains relevant and accessible in today's world.
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-yellow-400">Deep Listening</h3>
              <p className="text-purple-200">We carefully understand your concerns, questions, and life situation through meaningful conversation.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-purple-400">Planetary Analysis</h3>
              <p className="text-purple-200">We analyze your planetary positions and their influences on your current life circumstances.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-blue-400">Insightful Report</h3>
              <p className="text-purple-200">You receive a comprehensive analysis that provides clarity and understanding of your challenges.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <ScrollReveal
            baseOpacity={0.2}
            enableBlur={true}
            baseRotation={1}
            blurStrength={4}
            containerClassName="mb-8"
          >
            Ready to discover what the stars reveal about your life's journey?
          </ScrollReveal>
          
          <Link to="/consultation">
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-12 py-4 text-xl font-semibold rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
              Begin Your Consultation
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
