
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
    timeline.fromTo(".about-description", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
    timeline.fromTo(".about-highlights", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
    timeline.fromTo(".values-section", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
    timeline.fromTo(".achievements-section", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");

    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      <Header />
      
      {/* Floating Stars Background */}
      <div ref={starsRef} className="fixed inset-0 pointer-events-none z-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-200/60 rounded-full animate-pulse twinkle-animation"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              boxShadow: `0 0 4px rgba(255,255,255,0.3)`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-20 pt-32">
        {/* About Section */}
        <section className="about-section mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center about-title bg-gradient-to-r from-yellow-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
            <Sparkles className="inline-block mr-3 text-yellow-400" />
            About Pandit Pradeep Kiradoo
          </h2>
          
          <div className="max-w-5xl mx-auto">
            {/* Main Description */}
            <div className="about-description mb-12">
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-300 shadow-2xl cosmic-glow">
                <ScrollReveal baseOpacity={0.3} enableBlur={true} baseRotation={1} blurStrength={2} containerClassName="mb-6">
                  <p className="text-lg text-white/90 leading-relaxed mb-6">
                    Pandit Pradeep Kiradoo is a renowned Vedic astrologer with over 15 years of experience in Jyotish Shastra. His deep understanding of planetary influences and their impact on human life has guided countless individuals towards a more fulfilling and prosperous existence.
                  </p>
                </ScrollReveal>
                
                <ScrollReveal baseOpacity={0.3} enableBlur={true} baseRotation={1} blurStrength={2} containerClassName="mb-6">
                  <p className="text-base text-white/80 leading-relaxed mb-6">
                    With a compassionate approach, he combines ancient wisdom with modern techniques to provide personalized astrological consultations. His expertise lies in analyzing birth charts, predicting future events, and offering effective remedies to mitigate challenges.
                  </p>
                </ScrollReveal>
                
                <ScrollReveal baseOpacity={0.3} enableBlur={true} baseRotation={1} blurStrength={2}>
                  <p className="text-base text-white/80 leading-relaxed">
                    Pandit Pradeep Kiradoo is dedicated to empowering individuals with the knowledge of their cosmic potential, helping them make informed decisions and navigate life's journey with confidence and clarity.
                  </p>
                </ScrollReveal>
              </Card>
            </div>
            
            {/* Highlight Cards */}
            <div className="about-highlights grid md:grid-cols-2 gap-6 mb-12">
              <Card className="bg-white/10 backdrop-blur-xl border border-purple-300/30 p-6 text-center hover:transform hover:scale-105 transition-all duration-300 shadow-2xl hover:bg-white/15 cosmic-glow">
                <Star className="w-12 h-12 text-yellow-400 mb-4 mx-auto animate-pulse" />
                <h3 className="text-xl font-semibold mb-3 text-white">15+ Years</h3>
                <p className="text-sm text-white/80">of dedicated practice in Vedic Astrology</p>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-xl border border-yellow-300/30 p-6 text-center hover:transform hover:scale-105 transition-all duration-300 shadow-2xl hover:bg-white/15 cosmic-glow">
                <Heart className="w-12 h-12 text-pink-400 mb-4 mx-auto animate-pulse" />
                <h3 className="text-xl font-semibold mb-3 text-white">Compassionate</h3>
                <p className="text-sm text-white/80">approach to spiritual guidance</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="values-section mb-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center bg-gradient-to-r from-yellow-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
            <Heart className="inline-block mr-2 text-pink-400" />
            Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 hover:transform hover:scale-105 transition-all duration-300 hover:bg-white/15 text-center shadow-2xl cosmic-glow">
              <BookOpen className="w-8 h-8 text-yellow-400 mb-4 mx-auto animate-pulse" />
              <h3 className="text-lg font-semibold mb-3 text-white">Integrity</h3>
              <p className="text-sm text-white/80 leading-relaxed">Upholding ethical standards in every consultation with honesty and transparency.</p>
            </Card>
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 hover:transform hover:scale-105 transition-all duration-300 hover:bg-white/15 text-center shadow-2xl cosmic-glow">
              <Users className="w-8 h-8 text-blue-400 mb-4 mx-auto animate-pulse" />
              <h3 className="text-lg font-semibold mb-3 text-white">Compassion</h3>
              <p className="text-sm text-white/80 leading-relaxed">Approaching each individual with genuine care and understanding for their journey.</p>
            </Card>
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 hover:transform hover:scale-105 transition-all duration-300 hover:bg-white/15 text-center shadow-2xl cosmic-glow">
              <Award className="w-8 h-8 text-green-400 mb-4 mx-auto animate-pulse" />
              <h3 className="text-lg font-semibold mb-3 text-white">Excellence</h3>
              <p className="text-sm text-white/80 leading-relaxed">Delivering accurate insights through continuous learning and dedication to the craft.</p>
            </Card>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="achievements-section">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center bg-gradient-to-r from-yellow-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
            <Award className="inline-block mr-2 text-green-400" />
            Experience & Recognition
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 hover:transform hover:scale-105 transition-all duration-300 hover:bg-white/15 text-center shadow-2xl cosmic-glow">
              <h3 className="text-lg font-semibold mb-3 text-white">15+ Years of Practice</h3>
              <p className="text-sm text-white/80 mb-4">Dedicated expertise in Vedic astrology and spiritual guidance.</p>
              <Badge className="bg-purple-600/80 text-white text-xs backdrop-blur-sm">Vedic Astrology</Badge>
            </Card>
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 hover:transform hover:scale-105 transition-all duration-300 hover:bg-white/15 text-center shadow-2xl cosmic-glow">
              <h3 className="text-lg font-semibold mb-3 text-white">Trusted by Thousands</h3>
              <p className="text-sm text-white/80 mb-4">Helping individuals find clarity and direction across diverse life challenges.</p>
              <Badge className="bg-blue-600/80 text-white text-xs backdrop-blur-sm">Life Guidance</Badge>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;
