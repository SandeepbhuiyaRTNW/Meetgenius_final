'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Premium Navigation */}
      <nav className="border-b border-white/10 py-4 px-6 fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 transform hover:scale-105 transition-all duration-300 group">
            <div className="relative">
              <Image
                src="/meetgenius-logo.png"
                alt="MeetGenius Logo"
                width={44}
                height={44}
                className="rounded-xl shadow-lg group-hover:shadow-purple-500/25 transition-shadow duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                MeetGenius
              </span>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <span>powered by</span>
                <Image
                  src="/rtnw-logo.jpeg"
                  alt="Ride The Next Wave"
                  width={16}
                  height={16}
                  className="rounded-sm"
                />
                <span>Ride The Next Wave</span>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="#features" className="text-white/70 hover:text-white transition-all duration-200 text-sm font-medium">
              Features
            </Link>
            <Link href="#pricing" className="text-white/70 hover:text-white transition-all duration-200 text-sm font-medium">
              Pricing
            </Link>
            <Link href="/events" className="glass-card glass-card-hover px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500/90 hover:to-blue-500/90 transition-all duration-300">
              View Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Premium Hero Section */}
      <section className="py-32 px-6 pt-40">
        <div className="max-w-6xl mx-auto text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 glass-card rounded-2xl animate-fade-in-up">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <span className="text-white/80 text-sm font-medium tracking-wide uppercase">
              Enterprise AI Networking
            </span>
          </div>

          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight animate-fade-in-up animation-delay-200">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Intelligent
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-fade-in-up animation-delay-300">
                Networking
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400 font-light">
              Advanced AI-powered matching system that analyzes professional profiles to create meaningful connections at enterprise events.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up animation-delay-500">
            <Link
              href="/events"
              className="group relative glass-card glass-card-hover px-10 py-4 rounded-2xl font-semibold text-base bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500/90 hover:to-blue-500/90 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="relative z-10">View Demo Event</span>
            </Link>
            <Link
              href="/events"
              className="group glass-card glass-card-hover px-10 py-4 rounded-2xl font-semibold text-base border border-white/20 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Get Started</span>
            </Link>
          </div>

          {/* Premium Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-fade-in-up animation-delay-600">
            <div className="text-center glass-card glass-card-hover p-8 rounded-2xl group">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 animate-float">95%</div>
              <div className="text-white/70 text-sm font-medium">Match Success Rate</div>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-center glass-card glass-card-hover p-8 rounded-2xl group animation-delay-100">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3 animate-float">10K+</div>
              <div className="text-white/70 text-sm font-medium">Connections Made</div>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-center glass-card glass-card-hover p-8 rounded-2xl group animation-delay-200">
              <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3 animate-float">500+</div>
              <div className="text-white/70 text-sm font-medium">Events Powered</div>
              <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium How It Works */}
      <section id="features" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-20 animate-fade-in-up">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center animate-fade-in-up animation-delay-200 group">
              <div className="relative mb-8">
                <div className="w-20 h-20 glass-card glass-card-hover bg-gradient-to-br from-purple-600/80 to-purple-700/80 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Profile Analysis</h3>
              <p className="text-white/70 text-sm leading-relaxed">Advanced AI processes professional profiles and extracts key compatibility factors</p>
            </div>

            <div className="text-center animate-fade-in-up animation-delay-400 group">
              <div className="relative mb-8">
                <div className="w-20 h-20 glass-card glass-card-hover bg-gradient-to-br from-blue-600/80 to-blue-700/80 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-700/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Smart Matching</h3>
              <p className="text-white/70 text-sm leading-relaxed">Sophisticated algorithms identify optimal professional connections and compatibility</p>
            </div>

            <div className="text-center animate-fade-in-up animation-delay-600 group">
              <div className="relative mb-8">
                <div className="w-20 h-20 glass-card glass-card-hover bg-gradient-to-br from-green-600/80 to-green-700/80 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-green-500/25 group-hover:shadow-green-500/40 transition-all duration-300">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-700/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Strategic Connections</h3>
              <p className="text-white/70 text-sm leading-relaxed">Receive conversation starters and networking strategies for meaningful interactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="glass-card glass-card-hover p-16 rounded-3xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 animate-fade-in-up">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Ready to Connect?
              </span>
            </h2>
            <p className="text-lg text-white/70 mb-12 animate-fade-in-up animation-delay-200 max-w-2xl mx-auto leading-relaxed">
              Experience the future of professional networking with our enterprise-grade AI matching system
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animation-delay-400">
              <Link
                href="/events"
                className="group relative glass-card glass-card-hover px-12 py-4 rounded-2xl font-semibold text-base bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500/90 hover:to-blue-500/90 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <span className="relative z-10">View Demo Event</span>
              </Link>
              <Link
                href="/matches?event=ride-the-next-wave-demo-night"
                className="glass-card glass-card-hover px-12 py-4 rounded-2xl font-semibold text-base border border-white/20 hover:border-white/30 transition-all duration-300"
              >
                See Live Matches
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="border-t border-white/10 py-12 px-6 relative">
        <div className="max-w-5xl mx-auto text-center animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Image
              src="/rtnw-logo.jpeg"
              alt="Ride The Next Wave"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div className="text-left">
              <div className="text-white font-semibold text-lg">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">MeetGenius</span>
                <span className="text-white/80"> is powered by </span>
                <span className="text-white">Ride The Next Wave</span>
              </div>
              <p className="text-white/60 text-sm">Transform your ideas into impactful digital solutions swiftly and effectively.</p>
            </div>
          </div>
          <p className="text-white/40 text-xs font-light">
            &copy; 2025 MeetGenius. Enterprise AI networking platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
