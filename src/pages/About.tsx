import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '../components/ScrollReveal';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Moon, Star, Sun, Sparkles, BookOpen, Users, Award, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const starsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

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

    // Initialize ScrollTrigger timeline
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".about-section",
        start: "top center",
        end: "bottom center",
        scrub: true,
        markers: false,
      }
    });
    timelineRef.current = timeline;

    // Add animations to the timeline
    timeline.fromTo(".about-title", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 });
    timeline.fromTo(".about-content", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
    timeline.fromTo(".values-section", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
    timeline.fromTo(".achievements-section", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");

    return () => {
      timelineRef.current?.kill();
    };
  }, []);

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

      {/* Hero Section - Added pt-20 for header spacing */}
      <div className="relative z-10 container mx-auto px-6 py-20 pt-32">
        {/* About Section */}
        <section className="about-section mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center about-title">
            <Sparkles className="inline-block mr-2 text-yellow-400" />
            About Pandit Pradeep Kiradoo
          </h2>
          <div className="text-lg text-gray-300 leading-relaxed about-content">
            <ScrollReveal baseOpacity={0.2} enableBlur={true} baseRotation={2} blurStrength={6} containerClassName="mb-8">
              Pandit Pradeep Kiradoo is a renowned Vedic astrologer with over 15 years of experience in Jyotish Shastra.
              His deep understanding of planetary influences and their impact on human life has guided countless individuals
              towards a more fulfilling and prosperous existence.
            </ScrollReveal>
            <ScrollReveal baseOpacity={0.2} enableBlur={true} baseRotation={2} blurStrength={6} containerClassName="mb-8">
              With a compassionate approach, he combines ancient wisdom with modern techniques to provide personalized
              astrological consultations. His expertise lies in analyzing birth charts, predicting future events, and
              offering effective remedies to mitigate challenges.
            </ScrollReveal>
            <ScrollReveal baseOpacity={0.2} enableBlur={true} baseRotation={2} blurStrength={6} containerClassName="mb-8">
              Pandit Pradeep Kiradoo is dedicated to empowering individuals with the knowledge of their cosmic potential,
              helping them make informed decisions and navigate life's journey with confidence and clarity.
            </ScrollReveal>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="values-section mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <Heart className="inline-block mr-2 text-pink-400" />
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:transform hover:scale-105 transition-all duration-300 hover:bg-white/10">
              <BookOpen className="w-10 h-10 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Integrity</h3>
              <p className="text-gray-300">Upholding the highest standards of honesty and ethical conduct in every consultation.</p>
            </Card>
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:transform hover:scale-105 transition-all duration-300 hover:bg-white/10">
              <Users className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Empathy</h3>
              <p className="text-gray-300">Approaching each individual with compassion, understanding, and genuine care for their well-being.</p>
            </Card>
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:transform hover:scale-105 transition-all duration-300 hover:bg-white/10">
              <Award className="w-10 h-10 text-green-400 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Excellence</h3>
              <p className="text-gray-300">Striving for continuous improvement and delivering the most accurate and insightful astrological guidance.</p>
            </Card>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="achievements-section">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <Award className="inline-block mr-2 text-green-400" />
            Key Achievements
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:transform hover:scale-105 transition-all duration-300 hover:bg-white/10">
              <h3 className="text-xl font-bold mb-2 text-white">15+ Years of Experience</h3>
              <p className="text-gray-300">Providing expert astrological guidance for over a decade.</p>
              <Badge className="mt-4 bg-purple-600 text-white">Vedic Astrology</Badge>
            </Card>
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:transform hover:scale-105 transition-all duration-300 hover:bg-white/10">
              <h3 className="text-xl font-bold mb-2 text-white">Thousands of Satisfied Clients</h3>
              <p className="text-gray-300">Helping individuals find clarity and direction in their lives.</p>
              <Badge className="mt-4 bg-blue-600 text-white">Life Guidance</Badge>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;
