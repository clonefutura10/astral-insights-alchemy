
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
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-yellow-200/40 rounded-full animate-pulse"
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
        <section className="about-section mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center about-title">
            <Sparkles className="inline-block mr-2 text-yellow-400" />
            About Pandit Pradeep Kiradoo
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <ScrollReveal baseOpacity={0.3} enableBlur={true} baseRotation={1} blurStrength={3} containerClassName="mb-8">
              <div className="text-center text-lg text-gray-300 leading-relaxed">
                A renowned Vedic astrologer with over 15 years of experience in Jyotish Shastra, 
                combining ancient wisdom with modern insights to guide individuals toward fulfillment and prosperity.
              </div>
            </ScrollReveal>
            
            <ScrollReveal baseOpacity={0.3} enableBlur={true} baseRotation={1} blurStrength={3} containerClassName="mb-8">
              <div className="text-center text-base text-gray-400 leading-relaxed max-w-3xl mx-auto">
                Specializing in birth chart analysis, future predictions, and personalized remedies, 
                Pandit Kiradoo empowers clients with cosmic insights for confident decision-making.
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="values-section mb-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
            <Heart className="inline-block mr-2 text-pink-400" />
            Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:transform hover:scale-105 transition-all duration-300 hover:bg-white/10 text-center">
              <BookOpen className="w-8 h-8 text-yellow-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-3 text-white">Integrity</h3>
              <p className="text-sm text-gray-300 leading-relaxed">Upholding ethical standards in every consultation with honesty and transparency.</p>
            </Card>
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:transform hover:scale-105 transition-all duration-300 hover:bg-white/10 text-center">
              <Users className="w-8 h-8 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-3 text-white">Compassion</h3>
              <p className="text-sm text-gray-300 leading-relaxed">Approaching each individual with genuine care and understanding for their journey.</p>
            </Card>
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:transform hover:scale-105 transition-all duration-300 hover:bg-white/10 text-center">
              <Award className="w-8 h-8 text-green-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-3 text-white">Excellence</h3>
              <p className="text-sm text-gray-300 leading-relaxed">Delivering accurate insights through continuous learning and dedication to the craft.</p>
            </Card>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="achievements-section">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
            <Award className="inline-block mr-2 text-green-400" />
            Experience & Recognition
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:transform hover:scale-105 transition-all duration-300 hover:bg-white/10 text-center">
              <h3 className="text-lg font-semibold mb-3 text-white">15+ Years of Practice</h3>
              <p className="text-sm text-gray-300 mb-4">Dedicated expertise in Vedic astrology and spiritual guidance.</p>
              <Badge className="bg-purple-600/80 text-white text-xs">Vedic Astrology</Badge>
            </Card>
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:transform hover:scale-105 transition-all duration-300 hover:bg-white/10 text-center">
              <h3 className="text-lg font-semibold mb-3 text-white">Trusted by Thousands</h3>
              <p className="text-sm text-gray-300 mb-4">Helping individuals find clarity and direction across diverse life challenges.</p>
              <Badge className="bg-blue-600/80 text-white text-xs">Life Guidance</Badge>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;
