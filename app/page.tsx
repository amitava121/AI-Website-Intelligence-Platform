"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Moon, Globe, Target, ArrowRight, LineChart, Gauge, Shield,
  Rocket, CheckCircle2, RefreshCw, MoreHorizontal, LayoutDashboard,
  BarChart3, Network, Search, Zap, Gamepad2, Image as ImageIcon, Code,
  AlertTriangle, Lock, Download, Sparkles
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// --- Shared Components ---

const InteractiveCard = ({ children, className = '', tilt = true, spotlight = true }: { children: React.ReactNode, className?: string, tilt?: boolean, spotlight?: boolean }) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (spotlight) {
      setPosition({ x, y });
      setOpacity(1);
    }

    if (tilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: 'none',
      });
    }
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    if (tilt) {
      setStyle({
        transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        transition: 'transform 0.5s ease',
      });
    }
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {spotlight && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0,102,255,.1), transparent 40%)`,
          }}
        />
      )}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
};

const TopNav = ({ minimal = false, onHome, isLoggedIn, onLogin, action }: { minimal?: boolean, onHome?: () => void, isLoggedIn?: boolean, onLogin?: () => void, action?: React.ReactNode }) => (
  <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-[0_16px_32px_-12px_rgba(0,102,255,0.08)] flex justify-between items-center px-8 h-20">
    <div className="flex items-center gap-8">
      <button onClick={onHome} className="text-2xl font-extrabold tracking-tighter text-slate-900 hover:opacity-80 transition-opacity">Lumina AI</button>
      {!minimal && (
        <div className="hidden md:flex gap-6">
          <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1 font-semibold tracking-tight">Intelligence</a>
          <a href="#" className="text-slate-600 hover:text-blue-500 font-semibold tracking-tight transition-all duration-300">Architecture</a>
          <a href="#" className="text-slate-600 hover:text-blue-500 font-semibold tracking-tight transition-all duration-300">Network</a>
          <a href="#" className="text-slate-600 hover:text-blue-500 font-semibold tracking-tight transition-all duration-300">Pricing</a>
        </div>
      )}
    </div>
    <div className="flex items-center gap-4">
      {action}
      {minimal ? (
        <span className="text-xs font-bold uppercase tracking-widest text-secondary">Atmospheric Precision</span>
      ) : (
        <>
          <button className="p-2 rounded-xl hover:bg-blue-50/50 transition-all duration-300 flex items-center justify-center text-slate-600">
            <Moon size={20} />
          </button>
          {isLoggedIn ? (
            <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container/30 hover:border-primary-container transition-all duration-300 shadow-md">
              <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" />
            </button>
          ) : (
            <button onClick={onLogin} className="bg-primary-container text-on-primary px-6 py-2.5 rounded-xl font-semibold tracking-tight hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-lg shadow-blue-500/20">
              Login
            </button>
          )}
        </>
      )}
    </div>
  </nav>
);

const Footer = () => (
  <footer className="w-full py-12 bg-slate-50 flex flex-col items-center gap-6 border-t border-outline-variant/10 mt-auto">
    <div className="flex gap-8">
      {['Privacy', 'Terms', 'API', 'Status'].map((item) => (
        <a key={item} href="#" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-500 underline underline-offset-4 transition-all duration-300 opacity-80 hover:opacity-100">
          {item}
        </a>
      ))}
    </div>
    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 opacity-80">© 2024 Lumina AI. Atmospheric Precision.</p>
  </footer>
);

// --- Views ---

const HeroSection = ({ onStart }: { onStart: () => void }) => {
  const containerRef = React.useRef<HTMLElement>(null);
  const glowRef = React.useRef<HTMLDivElement>(null);
  const tiltCardRef = React.useRef<HTMLDivElement>(null);
  const parallaxRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const floatingRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const nodeRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) - 0.5;
      mouseY = ((e.clientY - rect.top) / rect.height) - 0.5;

      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX - rect.left}px`;
        glowRef.current.style.top = `${e.clientY - rect.top}px`;
        glowRef.current.style.opacity = '1';
      }

      nodeRefs.current.forEach((node, i) => {
        if (!node) return;
        const factor = (i + 1) * 20;
        const x = mouseX * factor;
        const y = mouseY * factor;
        node.style.transform = `translate(${x}px, ${y}px)`;
        node.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
      });
    };

    const handleMouseLeave = () => {
      mouseX = 0;
      mouseY = 0;
      if (glowRef.current) glowRef.current.style.opacity = '0';
    };

    const scrollContainer = document.getElementById('home-scroll-container') || window;

    const handleScroll = () => {
      const scrollTop = scrollContainer === window ? window.scrollY : (scrollContainer as HTMLElement).scrollTop;
      nodeRefs.current.forEach((node, i) => {
        if (!node) return;
        const speed = (i + 1) * 0.05;
        const y = scrollTop * speed;
        node.style.marginTop = `${y}px`;
      });
    };

    const update = () => {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;

      const tiltX = currentY * -16;
      const tiltY = currentX * 16;
      if (tiltCardRef.current) {
        tiltCardRef.current.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }

      parallaxRefs.current.forEach(layer => {
        if (!layer) return;
        const speed = parseFloat(layer.getAttribute('data-speed') || '0');
        const x = currentX * speed * 1000;
        const y = currentY * speed * 1000;
        layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });

      floatingRefs.current.forEach(el => {
        if (!el) return;
        const speed = parseFloat(el.getAttribute('data-speed') || '0.05');
        const x = currentX * speed * 2000;
        const y = currentY * speed * 2000;
        const time = Date.now() * 0.002;
        const hover = Math.sin(time) * 10;
        el.style.transform = `translate3d(${x}px, ${y + hover}px, 50px)`;
      });

      animationFrameId = requestAnimationFrame(update);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    scrollContainer.addEventListener('scroll', handleScroll);
    update();

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      scrollContainer.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen flex flex-col justify-center pt-20 overflow-hidden snap-start snap-always" id="hero-section">
      <div 
        ref={glowRef}
        className="pointer-events-none absolute w-[600px] h-[600px] rounded-full z-0 transition-opacity duration-300 opacity-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 102, 255, 0.15) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Floating Data Nodes */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div ref={el => { nodeRefs.current[0] = el; }} className="absolute pointer-events-none z-5" style={{ top: '20%', left: '10%' }}>
          <div className="w-2 h-2 bg-primary-container/40 rounded-full blur-sm"></div>
        </div>
        <div ref={el => { nodeRefs.current[1] = el; }} className="absolute pointer-events-none z-5" style={{ top: '15%', right: '25%' }}>
          <div className="w-3 h-3 bg-blue-500/30 rounded-full blur-[2px]"></div>
        </div>
        <div ref={el => { nodeRefs.current[2] = el; }} className="absolute pointer-events-none z-5" style={{ bottom: '30%', left: '20%' }}>
          <div className="w-1.5 h-1.5 bg-primary-container/50 rounded-full"></div>
        </div>
        <div ref={el => { nodeRefs.current[3] = el; }} className="absolute pointer-events-none z-5" style={{ bottom: '10%', right: '15%' }}>
          <div className="w-4 h-4 bg-primary-container/20 rounded-full blur-md"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-20 relative z-10">
          <div ref={el => { parallaxRefs.current[0] = el; }} data-speed="0.02" className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-sm font-bold tracking-wide uppercase">
              <Sparkles size={16} />
              Precision Website Intelligence
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter leading-tight text-on-surface">
              Analyze Your <br/><span className="text-primary-container">Website Intelligence</span>
            </h1>
            <p className="text-xl text-secondary leading-relaxed max-w-xl mx-auto lg:mx-0">
              Harness the power of Lumina's 3D-mapped diagnostic engine. Transform technical complexity into atmospheric precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={onStart} className="bg-primary-container text-on-primary px-10 py-4 rounded-xl text-lg font-bold shadow-[0_20px_40px_-12px_rgba(0,102,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_25px_50px_-12px_rgba(0,102,255,0.4)] active:scale-95">
                Start Analysis
              </button>
              <button className="glass-panel text-on-surface px-10 py-4 rounded-xl text-lg font-bold border border-outline-variant/30 transition-all hover:bg-surface-container-low hover:scale-105 active:scale-95 hover:shadow-xl">
                View Demo
              </button>
            </div>
          </div>
          <div className="flex-1 relative" style={{ perspective: '1000px' }}>
            <div ref={tiltCardRef} className="relative transition-transform duration-300 ease-out">
              <div ref={el => { parallaxRefs.current[1] = el; }} data-speed="-0.03" className="absolute -inset-4 bg-primary-container/10 blur-3xl rounded-full"></div>
              <div className="relative glass-panel rounded-2xl shadow-2xl overflow-hidden border border-white/40">
                <img alt="Hero Illustration" className="w-full h-auto opacity-95" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7fVbcSOSrooTjFx-1Fw5zVB7RhWEjlqYaCM1Nn8YsyF9L2J1VwqtYdFdqr9JZ2G69XJVB4FZDdz4-db6Sg_0TUolQuLMAtvKlMGowrz2c7qFCQXZnAqQtIbT1QeCHcESvV81bYgViNHLF9jrqlZf-rKkPBpXSSP9mQ4T2KcDlVCnvYSUF9vr38ybLxK1QdJ1muNKc3nTxYgKPgzcjcfccwZTQaNNAU_dGeeM4cvk6nX-zovfSdU32pVwp-JoBmGoiQgvp8tpI560" />
              </div>
              <div ref={el => { floatingRefs.current[0] = el; }} data-speed="0.08" className="absolute -top-10 -right-10 glass-panel p-6 rounded-2xl shadow-2xl border border-white/60 w-48 pointer-events-none">
                <div className="text-xs font-bold text-primary-container mb-2 uppercase tracking-widest">Performance</div>
                <div className="text-3xl font-black">99.8%</div>
                <div className="w-full h-1 bg-surface-container-low rounded-full mt-2">
                  <div className="w-[99%] h-full bg-primary-container rounded-full shadow-[0_0_8px_rgba(0,102,255,0.5)]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HomeView = ({ onStart, onHome, isLoggedIn, onLogin }: { onStart: () => void, onHome: () => void, isLoggedIn?: boolean, onLogin?: () => void }) => {
  return (
    <div className="bg-surface h-screen overflow-hidden text-on-surface selection:bg-primary-fixed-dim">
      <TopNav onHome={onHome} isLoggedIn={isLoggedIn} onLogin={onLogin} />
      <main id="home-scroll-container" className="mesh-bg h-screen overflow-y-auto snap-y snap-mandatory">
        <HeroSection onStart={onStart} />

        {/* Features Section */}
        <section className="relative h-screen flex flex-col justify-center py-12 overflow-hidden snap-start snap-always">
          <div className="max-w-7xl mx-auto px-8 relative z-20 w-full">
            <div className="mb-12 text-center max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 bg-gradient-to-b from-on-surface to-on-surface/60 bg-clip-text text-transparent">
                Atmospheric Clarity
              </h2>
              <p className="text-lg md:text-xl text-secondary font-medium">Three pillars of analysis built with industrial precision and digital elegance.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                { icon: Search, title: 'SEO Architecture', desc: 'Deep crawl technology that maps every semantic connection and metadata anchor.', link: 'Explore Metrics' },
                { icon: Gauge, title: 'Core Vitals', desc: 'Millisecond precision in performance monitoring and resource bottleneck detection.', link: 'Live Stream' },
                { icon: LayoutDashboard, title: 'UX Intelligence', desc: 'Visual heatmaps and behavioral flows rendered in high-fidelity 3D environments.', link: 'View Patterns' }
              ].map((feat, i) => (
                <InteractiveCard key={i} tilt={false} className="group surface-container-lowest glass-panel p-8 rounded-3xl transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_48px_80px_-24px_rgba(0,102,255,0.2)] hover:border-primary-container/30">
                  <div className="flex flex-col min-h-[300px] justify-between h-full">
                    <div>
                      <div className="w-16 h-16 bg-primary-fixed rounded-2xl flex items-center justify-center text-primary-container mb-6 transition-transform group-hover:scale-110 shadow-lg shadow-primary-container/5">
                        <feat.icon size={28} />
                      </div>
                      <h3 className="text-2xl font-extrabold mb-4">{feat.title}</h3>
                      <p className="text-base text-secondary leading-relaxed mb-6">{feat.desc}</p>
                    </div>
                    <div className="flex items-center text-primary-container font-bold text-base group-hover:gap-4 transition-all">
                      {feat.link} <ArrowRight size={18} className="ml-2" />
                    </div>
                  </div>
                </InteractiveCard>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-32 bg-surface snap-start snap-always h-screen flex flex-col justify-center overflow-hidden">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-12">
                <div>
                  <h2 className="text-4xl font-extrabold tracking-tighter mb-6">Three Steps to Intelligence</h2>
                  <p className="text-secondary text-lg">Our streamlined deployment pipeline ensures you go from raw data to actionable insight in seconds.</p>
                </div>
                <div className="space-y-8">
                  {[
                    { num: '01', title: 'Domain Synchronization', desc: 'Link your URL and our nodes will begin a high-frequency handshake.' },
                    { num: '02', title: 'Neural Processing', desc: 'Lumina AI scans every pixel and packet, applying atmospheric filters.' },
                    { num: '03', title: 'Insight Visualization', desc: 'Access your interactive workspace with prioritized action items.' }
                  ].map((step, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: i * 0.2, ease: "easeOut" }}
                      className="flex gap-6 group"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-primary-fixed flex items-center justify-center font-black text-primary-container transition-colors group-hover:bg-primary-container group-hover:text-white">{step.num}</div>
                      <div>
                        <h4 className="text-xl font-bold mb-1">{step.title}</h4>
                        <p className="text-secondary">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-tr from-primary-container/20 to-primary-container/10 rounded-3xl overflow-hidden relative border border-white/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img alt="3D Sphere" className="w-4/5 h-4/5 object-cover rounded-2xl shadow-xl transform -rotate-3 transition-transform hover:rotate-0 duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVPmpGZGet9x3ASEx3T1wi2t3xUvBtHsI0g5gxpTtGJlqmXblTYJB0Cv4biS0PysVyGX0dRheEom-5S7NGdIkZUDEdBGNr9y5KXlIQpEl9rizZDOzJQj_TZm-t2Kyexdz9ZDAiB2ELNiTfdBhnyJ8NtviCcvW6tJL2JifgzCRwgjNe_SnhsV5ElQJJQ7oMx1D3BGAk412xY1O_20TrvGlahG-75lsDpHGz5ttp3jgBijVnLLa-30Nuz4TaCsjIWMd3AMxcrOI9p5w" />
                  </div>
                  <div className="absolute bottom-8 right-8 glass-panel p-4 rounded-xl shadow-lg animate-bounce">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-primary-container" size={20} />
                      <span className="text-sm font-bold">Analysis Complete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section and Footer */}
        <div className="snap-start snap-always h-screen flex flex-col justify-between pt-32 overflow-hidden">
          <section className="max-w-7xl mx-auto px-8 w-full">
            <InteractiveCard tilt={true} spotlight={true} className="relative rounded-[3rem] overflow-hidden bg-slate-900 text-white p-12 md:p-24 text-center w-full">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-blue-600/20 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-blue-400/10 blur-[120px] rounded-full"></div>
              </div>
              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight">Ready for Premium <br />Atmospheric Precision?</h2>
                <p className="text-slate-400 text-xl font-medium">Join 2,500+ architecture firms and intelligence networks scaling with Lumina AI.</p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
                  <button onClick={onStart} className="bg-primary-container text-on-primary px-12 py-5 rounded-2xl text-xl font-extrabold shadow-2xl transition-all hover:scale-105 hover:shadow-blue-500/30 active:scale-95">
                    Get Started Free
                  </button>
                  <button className="bg-white/10 backdrop-blur-md text-white border border-white/10 px-12 py-5 rounded-2xl text-xl font-extrabold transition-all hover:bg-white/20 hover:scale-105 active:scale-95">
                    Book Architecture Call
                  </button>
                </div>
              </div>
            </InteractiveCard>
          </section>
          <Footer />
        </div>
      </main>
    </div>
  );
};

const ComparisonView = ({ onAnalyze, onHome, isLoggedIn, onLogin }: { onAnalyze: () => void, onHome: () => void, isLoggedIn?: boolean, onLogin?: () => void }) => {
  return (
    <div className="mesh-bg min-h-screen flex flex-col">
      <TopNav onHome={onHome} isLoggedIn={isLoggedIn} onLogin={onLogin} />
      <main className="flex-grow relative flex flex-col items-center justify-center pt-32 px-4 pb-20">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[10%] w-[40rem] h-[40rem] bg-primary-container/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[5%] w-[35rem] h-[35rem] bg-primary-container/5 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="w-full max-w-2xl z-10">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-extrabold uppercase tracking-[0.2em] text-primary-container bg-primary-container/10 rounded-full">
              Competitive Intelligence
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface mb-4 leading-tight">
              Benchmark Your <br /> <span className="text-primary-container">Digital DNA</span>
            </h1>
            <p className="text-secondary text-lg font-medium max-w-lg mx-auto">
              Contrast architectural frameworks and structural integrity against industry competitors in seconds.
            </p>
          </div>

          <div className="glass-panel bg-surface-container-lowest/40 p-10 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,102,255,0.12)] relative overflow-hidden">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold uppercase tracking-widest text-secondary/70 px-1">Your Website URL</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline-variant">
                    <Globe size={20} />
                  </div>
                  <input type="text" placeholder="https://yourdomain.com" className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-on-surface placeholder:text-outline-variant focus:ring-4 focus:ring-primary-container/10 focus:border-primary-container/40 focus:bg-surface-bright transition-all duration-300 outline-none" />
                </div>
              </div>

              <div className="flex items-center gap-4 py-2">
                <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent"></div>
                <span className="text-[10px] font-black text-outline-variant tracking-[0.3em] uppercase">vs</span>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent"></div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold uppercase tracking-widest text-secondary/70 px-1">Competitor Website URL</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline-variant">
                    <Target size={20} />
                  </div>
                  <input type="text" placeholder="https://competitor.io" className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-on-surface placeholder:text-outline-variant focus:ring-4 focus:ring-primary-container/10 focus:border-primary-container/40 focus:bg-surface-bright transition-all duration-300 outline-none" />
                </div>
              </div>

              <button onClick={onAnalyze} className="group relative mt-4 w-full bg-primary-container text-on-primary py-5 rounded-xl font-extrabold text-lg tracking-tight shadow-[0_20px_40px_-10px_rgba(0,102,255,0.4)] hover:shadow-[0_24px_48px_-12px_rgba(0,102,255,0.5)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center justify-center gap-3">
                  Analyze Architecture
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              { icon: LineChart, title: 'Deep Indexing', desc: 'Multi-layer scanning of CMS, CDN, and backend frameworks.' },
              { icon: Gauge, title: 'Latency Delta', desc: 'Measure the gap between your TTFB and industry leading scores.' },
              { icon: Shield, title: 'Encrypted Audit', desc: 'All comparisons are performed within secure sandboxed environments.' }
            ].map((feature, i) => (
              <div key={i} className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-primary-container/20">
                <feature.icon className="text-primary-container mb-3" size={24} />
                <h3 className="font-bold text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-secondary leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const LoadingView = ({ onComplete, onHome, isLoggedIn, onLogin }: { onComplete: () => void, onHome: () => void, isLoggedIn?: boolean, onLogin?: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000; // 3 seconds total
    const intervalTime = 50;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300); // slight delay before switching
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="bg-surface min-h-screen flex flex-col overflow-hidden">
      <TopNav minimal onHome={onHome} isLoggedIn={isLoggedIn} onLogin={onLogin} />
      <main className="flex-grow relative flex items-center justify-center p-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary-fixed opacity-30 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary-container opacity-20 blur-[120px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-2xl">
          <div className="glass-panel p-10 md:p-16 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,102,255,0.12)] flex flex-col items-center">
            
            <div className="mb-12 relative">
              <div className="absolute inset-0 bg-primary-container blur-2xl opacity-20 scale-150"></div>
              <div className="relative w-20 h-20 rounded-2xl bg-primary-container flex items-center justify-center shadow-lg shadow-primary-container/20">
                <Rocket className="text-white" size={36} />
              </div>
            </div>

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4 leading-tight">
                Analyzing both websites...
              </h1>
              <p className="text-secondary text-lg font-medium max-w-md mx-auto leading-relaxed">
                Cross-referencing architectural patterns and data structures for neural mapping.
              </p>
            </div>

            <div className="w-full space-y-10">
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <span className="text-sm font-bold text-primary-container tracking-wide">{Math.round(progress)}% COMPLETE</span>
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">Processing Data Clusters</span>
                </div>
                <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-container rounded-full shadow-[0_0_12px_rgba(0,102,255,0.4)] transition-all duration-75 ease-linear"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Scraping Data',
                    desc: 'Found 4,209 entry points',
                    status: progress < 33 ? 'ACTIVE' : 'DONE'
                  },
                  {
                    title: 'Running Analysis',
                    desc: 'Cross-referencing nodes',
                    status: progress < 33 ? 'WAITING' : progress < 66 ? 'ACTIVE' : 'DONE'
                  },
                  {
                    title: 'Generating Insights',
                    desc: 'Constructing final report',
                    status: progress < 66 ? 'WAITING' : progress < 100 ? 'ACTIVE' : 'DONE'
                  }
                ].map((step, i) => {
                  if (step.status === 'DONE') {
                    return (
                      <div key={i} className="bg-surface-container-low p-5 rounded-2xl flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <CheckCircle2 className="text-primary-container" size={20} />
                          <span className="text-[10px] font-bold text-primary-container px-2 py-1 bg-primary-fixed rounded-full">DONE</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{step.title}</p>
                          <p className="text-xs text-secondary leading-tight mt-1">{step.desc}</p>
                        </div>
                      </div>
                    );
                  } else if (step.status === 'ACTIVE') {
                    return (
                      <div key={i} className="bg-surface-container-lowest p-5 rounded-2xl flex flex-col gap-3 shadow-sm border-2 border-primary-container">
                        <div className="flex justify-between items-start">
                          <RefreshCw className="text-primary-container animate-spin" size={20} />
                          <span className="text-[10px] font-bold text-primary-container px-2 py-1 bg-primary-fixed rounded-full">ACTIVE</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{step.title}</p>
                          <p className="text-xs text-secondary leading-tight mt-1">{step.desc}</p>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={i} className="bg-surface-container-low opacity-50 p-5 rounded-2xl flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <MoreHorizontal className="text-outline-variant" size={20} />
                          <span className="text-[10px] font-bold text-outline-variant px-2 py-1 bg-surface-container-highest rounded-full">WAITING</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{step.title}</p>
                          <p className="text-xs text-secondary leading-tight mt-1">{step.desc}</p>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>

            <div className="mt-12 flex items-center gap-3 py-3 px-6 rounded-full bg-surface-container-low/50">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
              <p className="text-xs font-bold text-secondary tracking-wide uppercase">Lumina Intelligence Engine v4.2</p>
            </div>
          </div>
        </div>

        {/* Decorative Side Elements */}
        <div className="absolute top-1/4 right-10 hidden lg:block">
          <div className="glass-panel p-4 rounded-xl shadow-xl w-48 border-l-4 border-primary-container">
            <p className="text-[10px] font-bold text-primary-container uppercase mb-2">Network Load</p>
            <div className="flex items-end gap-1 h-8">
              {[4, 6, 8, 5, 3, 7].map((h, i) => (
                <div key={i} className={`w-1 rounded-full ${i % 2 === 0 ? 'bg-primary-fixed' : 'bg-primary-container'}`} style={{ height: `${h * 4}px` }}></div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-1/4 left-10 hidden lg:block">
          <div className="glass-panel p-4 rounded-xl shadow-xl w-48 border-l-4 border-secondary">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="text-secondary" size={14} />
              <p className="text-[10px] font-bold text-secondary uppercase">Encryption</p>
            </div>
            <p className="text-xs font-mono text-secondary truncate">0x9a2f...bb12</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const ResultsView = ({ onHome, isLoggedIn, onLogin, onNewAnalysis }: { onHome: () => void, isLoggedIn?: boolean, onLogin?: () => void, onNewAnalysis?: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const chartData = [
    { name: 'Jan', yourSite: 40, competitor: 24 },
    { name: 'Feb', yourSite: 45, competitor: 28 },
    { name: 'Mar', yourSite: 55, competitor: 32 },
    { name: 'Apr', yourSite: 70, competitor: 36 },
    { name: 'May', yourSite: 85, competitor: 42 },
    { name: 'Jun', yourSite: 110, competitor: 50 },
    { name: 'Jul', yourSite: 140, competitor: 65 },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const downloadAction = isScrolled ? (
    <button className="w-10 h-10 flex items-center justify-center bg-white border border-outline-variant/30 rounded-full shadow-sm hover:shadow-md transition-all animate-in fade-in zoom-in duration-300">
      <Download size={18} className="text-primary-container" />
    </button>
  ) : null;

  return (
    <div className="bg-surface min-h-screen">
      <TopNav onHome={onHome} isLoggedIn={isLoggedIn} onLogin={onLogin} action={downloadAction} />
      
      <aside className="hidden lg:flex flex-col p-6 gap-4 w-64 fixed left-0 top-20 bottom-0 bg-slate-50/50 backdrop-blur-lg border-r border-outline-variant/20 z-40">
        <div className="mb-4">
          <p className="text-lg font-bold text-slate-900">Lumina Admin</p>
          <p className="text-xs font-bold text-secondary">Premium Plan</p>
        </div>
        <div className="flex flex-col gap-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-white text-blue-600 shadow-sm rounded-xl transition-transform hover:scale-[1.02]">
            <LayoutDashboard size={18} />
            <span className="text-sm font-bold">Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-xl transition-transform hover:scale-[1.02]">
            <BarChart3 size={18} />
            <span className="text-sm font-bold">Analytics</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-xl transition-transform hover:scale-[1.02]">
            <Network size={18} />
            <span className="text-sm font-bold">Nodes</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-xl transition-transform hover:scale-[1.02]">
            <Shield size={18} />
            <span className="text-sm font-bold">Security</span>
          </a>
        </div>
        <button onClick={onNewAnalysis} className="mt-auto bg-primary-fixed text-primary-container px-4 py-3 rounded-xl font-bold text-sm hover:bg-blue-200 transition-all">
          New Analysis
        </button>
      </aside>

      <main className="pt-32 pb-24 px-6 md:px-12 lg:ml-64 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Comparison Results</h1>
            <p className="text-secondary font-medium">Comparative analysis of intelligence metrics across peer entities.</p>
          </div>
          <button className={`flex items-center gap-2 bg-white border border-outline-variant/30 px-6 py-3 rounded-xl font-bold shadow-sm hover:shadow-md transition-all duration-300 text-sm ${isScrolled ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
            <Download size={18} className="text-primary-container" />
            Download Report
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 perspective-1000">
          <div className="box-3d p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="bg-primary-fixed text-primary-container p-3 rounded-xl">
                <Search size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-secondary">SEO Authority</span>
            </div>
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-4xl font-extrabold text-blue-600">92</span>
                <span className="text-xs font-bold text-secondary mt-1">Your Site</span>
              </div>
              <div className="h-12 w-[1px] bg-outline-variant/30"></div>
              <div className="flex flex-col items-end">
                <span className="text-4xl font-extrabold text-slate-400">84</span>
                <span className="text-xs font-bold text-secondary mt-1">Competitor</span>
              </div>
            </div>
            <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
              <div className="bg-primary-container h-full rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>

          <div className="box-3d p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="bg-tertiary-fixed text-tertiary p-3 rounded-xl">
                <Zap size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-secondary">Performance</span>
            </div>
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-4xl font-extrabold text-blue-600">98</span>
                <span className="text-xs font-bold text-secondary mt-1">Your Site</span>
              </div>
              <div className="h-12 w-[1px] bg-outline-variant/30"></div>
              <div className="flex flex-col items-end">
                <span className="text-4xl font-extrabold text-slate-400">71</span>
                <span className="text-xs font-bold text-secondary mt-1">Competitor</span>
              </div>
            </div>
            <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
              <div className="bg-primary-container h-full rounded-full" style={{ width: '98%' }}></div>
            </div>
          </div>

          <div className="box-3d p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="bg-secondary-container text-on-secondary-container p-3 rounded-xl">
                <Gamepad2 size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-secondary">UX Friction</span>
            </div>
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-4xl font-extrabold text-blue-600">0.4</span>
                <span className="text-xs font-bold text-secondary mt-1">Your Site</span>
              </div>
              <div className="h-12 w-[1px] bg-outline-variant/30"></div>
              <div className="flex flex-col items-end">
                <span className="text-4xl font-extrabold text-slate-400">1.2</span>
                <span className="text-xs font-bold text-secondary mt-1">Competitor</span>
              </div>
            </div>
            <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
              <div className="bg-primary-container h-full rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-10 mb-16 relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight mb-1">Growth Trajectory</h3>
              <p className="text-sm text-secondary font-medium">Comparative velocity over the last 90 days.</p>
            </div>
            <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl">
              <button className="px-5 py-2 bg-white shadow-sm rounded-lg text-sm font-bold text-primary-container">Day</button>
              <button className="px-5 py-2 text-sm font-bold text-secondary hover:text-slate-900">Week</button>
              <button className="px-5 py-2 text-sm font-bold text-secondary hover:text-slate-900">Month</button>
            </div>
          </div>
          <div className="h-80 w-full relative rounded-2xl overflow-hidden bg-white border border-outline-variant/20 p-6 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: 600 }} />
                <Line type="monotone" dataKey="yourSite" name="Your Site" stroke="#0066FF" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#0066FF' }} />
                <Line type="monotone" dataKey="competitor" name="Competitor" stroke="#94A3B8" strokeWidth={3} strokeDasharray="8 8" dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#94A3B8' }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-8 bg-primary-container rounded-full"></span>
              <h3 className="text-xl font-extrabold">Optimization Roadmap (You)</h3>
            </div>
            <div className="glass-panel rounded-2xl p-6 border-l-4 border-primary-container">
              <div className="flex gap-4">
                <div className="text-primary-container p-2 bg-primary-fixed rounded-xl h-fit">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <p className="font-bold text-on-surface mb-1">LCP Image Delay</p>
                  <p className="text-sm text-secondary leading-relaxed">Hero image lacks priority hints. Estimated impact: -200ms</p>
                </div>
              </div>
            </div>
            <div className="glass-panel rounded-2xl p-6 border-l-4 border-primary-container">
              <div className="flex gap-4">
                <div className="text-primary-container p-2 bg-primary-fixed rounded-xl h-fit">
                  <Code size={20} />
                </div>
                <div>
                  <p className="font-bold text-on-surface mb-1">Unused JavaScript</p>
                  <p className="text-sm text-secondary leading-relaxed">Legacy analytics tags still present in production bundle.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-8 bg-outline-variant rounded-full"></span>
              <h3 className="text-xl font-extrabold text-slate-500">Critical Gaps (Competitor)</h3>
            </div>
            <div className="glass-panel rounded-2xl p-6 border-l-4 border-error opacity-80">
              <div className="flex gap-4">
                <div className="text-error p-2 bg-error-container rounded-xl h-fit">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <p className="font-bold text-on-surface mb-1">Layout Shift (CLS)</p>
                  <p className="text-sm text-secondary leading-relaxed">Dynamic ad units causing severe reflow on mobile devices.</p>
                </div>
              </div>
            </div>
            <div className="glass-panel rounded-2xl p-6 border-l-4 border-error opacity-80">
              <div className="flex gap-4">
                <div className="text-error p-2 bg-error-container rounded-xl h-fit">
                  <Lock size={20} />
                </div>
                <div>
                  <p className="font-bold text-on-surface mb-1">Mixed Content Headers</p>
                  <p className="text-sm text-secondary leading-relaxed">Sub-resources being served over insecure connections.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] overflow-hidden">
          <div className="px-10 py-8 border-b border-outline-variant/20 bg-white/50">
            <h3 className="text-xl font-extrabold">Deep Metric Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-10 py-5 text-xs font-bold uppercase tracking-widest text-secondary">Metric Name</th>
                  <th className="px-10 py-5 text-xs font-bold uppercase tracking-widest text-secondary">Current Score</th>
                  <th className="px-10 py-5 text-xs font-bold uppercase tracking-widest text-secondary">Target Alpha</th>
                  <th className="px-10 py-5 text-xs font-bold uppercase tracking-widest text-secondary">Deviation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                <tr className="bg-blue-50/30">
                  <td className="px-10 py-6 font-bold">First Input Delay</td>
                  <td className="px-10 py-6"><span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold">12ms</span></td>
                  <td className="px-10 py-6 text-secondary font-medium">100ms</td>
                  <td className="px-10 py-6 text-primary-container font-extrabold">-88% Improvement</td>
                </tr>
                <tr>
                  <td className="px-10 py-6 font-bold">Main Thread Work</td>
                  <td className="px-10 py-6 text-on-surface font-semibold">1.2s</td>
                  <td className="px-10 py-6 text-secondary font-medium">1.5s</td>
                  <td className="px-10 py-6 text-secondary font-medium">-0.3s Variance</td>
                </tr>
                <tr className="bg-blue-50/30">
                  <td className="px-10 py-6 font-bold">Server Response Time</td>
                  <td className="px-10 py-6"><span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold">142ms</span></td>
                  <td className="px-10 py-6 text-secondary font-medium">200ms</td>
                  <td className="px-10 py-6 text-primary-container font-extrabold">-29% Improvement</td>
                </tr>
                <tr>
                  <td className="px-10 py-6 font-bold">Total Blocking Time</td>
                  <td className="px-10 py-6 text-on-surface font-semibold">450ms</td>
                  <td className="px-10 py-6 text-secondary font-medium">300ms</td>
                  <td className="px-10 py-6 text-tertiary font-bold">+150ms Regression</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'home' | 'comparison' | 'loading' | 'results'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleHome = () => setView('home');
  const handleLogin = () => setIsLoggedIn(true);

  return (
    <div className="font-sans text-on-surface selection:bg-primary-fixed selection:text-primary-container">
      {view === 'home' && <HomeView onStart={() => setView('comparison')} onHome={handleHome} isLoggedIn={isLoggedIn} onLogin={handleLogin} />}
      {view === 'comparison' && <ComparisonView onAnalyze={() => setView('loading')} onHome={handleHome} isLoggedIn={isLoggedIn} onLogin={handleLogin} />}
      {view === 'loading' && <LoadingView onComplete={() => setView('results')} onHome={handleHome} isLoggedIn={isLoggedIn} onLogin={handleLogin} />}
      {view === 'results' && <ResultsView onHome={handleHome} isLoggedIn={isLoggedIn} onLogin={handleLogin} onNewAnalysis={() => setView('comparison')} />}
    </div>
  );
}
