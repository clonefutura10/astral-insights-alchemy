
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '../components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Moon, Star, Sun } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Declare the spline-viewer as a custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        url?: string;
      };
    }
  }
}

const Landing = () => {
  const starsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

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
        yoyo: true,
      });
    }

    // Enhanced particle effects
    if (particlesRef.current) {
      const particles = particlesRef.current.children;
      gsap.to(particles, {
        y: "random(-50, 50)",
        x: "random(-30, 30)",
        rotation: "random(-180, 180)",
        duration: "random(3, 6)",
        ease: "sine.inOut",
        stagger: 0.1,
        repeat: -1,
        yoyo: true,
      });
    }

    // Hero text entrance animation
    if (heroRef.current) {
      gsap.fromTo(heroRef.current.children, 
        { opacity: 0, y: 100 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.5, 
          stagger: 0.3,
          ease: "power3.out"
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white overflow-hidden relative">
      {/* Enhanced Floating Stars Background */}
      <div ref={starsRef} className="fixed inset-0 pointer-events-none z-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-pulse twinkle-animation"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Cosmic Particles */}
      <div ref={particlesRef} className="fixed inset-0 pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${
                ['#fbbf24', '#a855f7', '#3b82f6', '#ec4899'][Math.floor(Math.random() * 4)]
              }, transparent)`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Mystical Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 cosmic-glow"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              background: `radial-gradient(circle, ${
                ['rgba(168, 85, 247, 0.3)', 'rgba(59, 130, 246, 0.3)', 'rgba(236, 72, 153, 0.3)'][Math.floor(Math.random() * 3)]
              }, transparent)`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-20 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Moon className="w-8 h-8 text-yellow-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
            Pandit Pradeep Kiradoo
          </span>
        </div>
        <div className="space-x-6">
          <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-yellow-400 transition-colors">About</Link>
          <Link to="/consultation" className="hover:text-yellow-400 transition-colors">Consultation</Link>
        </div>
      </nav>

      {/* Hero Section with 3D Model */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div ref={heroRef} className="text-center lg:text-left">
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Jyotish Shastra
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-purple-200">
                The Science in Simple Terms
              </p>
            </div>

            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={5}
              blurStrength={10}
              containerClassName="mb-12"
            >
              Bhagya badla nahi ja sakta, par sawara ja sakta hai. Discover the cosmic wisdom that guides your destiny through the ancient science of astrology.
            </ScrollReveal>

            <div className="flex justify-center lg:justify-start space-x-6 mb-16">
              <Link to="/consultation">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                  Start Your Journey
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-400 hover:text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - 3D Spline Model */}
          <div className="h-96 md:h-[500px] relative">
            <spline-viewer 
              url="https://prod.spline.design/VcB3J4RW3CZxcnGV/scene.splinecode"
              className="w-full h-full rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 container mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-500/30 p-6 hover:transform hover:scale-105 transition-all duration-300">
            <Sun className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-white">Ancient Wisdom</h3>
            <p className="text-purple-200">Discover insights from thousands of years of Vedic astrology knowledge</p>
          </Card>
          
          <Card className="bg-gradient-to-br from-indigo-900/50 to-blue-900/50 border-blue-500/30 p-6 hover:transform hover:scale-105 transition-all duration-300">
            <Star className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-white">Personalized Analysis</h3>
            <p className="text-blue-200">Get detailed insights based on your unique planetary positions</p>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-pink-500/30 p-6 hover:transform hover:scale-105 transition-all duration-300">
            <Moon className="w-12 h-12 text-pink-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-white">Life Guidance</h3>
            <p className="text-pink-200">Understand your challenges and find clarity for your path ahead</p>
          </Card>
        </div>
      </div>

      {/* Quote Section */}
      <div className="relative z-10 container mx-auto px-6 pb-20">
        <ScrollReveal
          baseOpacity={0.2}
          enableBlur={true}
          baseRotation={2}
          blurStrength={6}
          containerClassName="text-center"
        >
          "When the student is ready, the teacher appears. When the seeker is sincere, the stars reveal their secrets."
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Landing;
