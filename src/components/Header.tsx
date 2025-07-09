import React from 'react';
import { EventInfo } from '@/types';

interface HeaderProps {
  eventInfo: EventInfo;
}

export const Header: React.FC<HeaderProps> = ({ eventInfo }) => {
  return (
    <header className="bg-black border-b border-white/10 py-8 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-black to-blue-900/10"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Premium Event Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 glass-card rounded-2xl animate-fade-in-up">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <span className="text-white/80 text-sm font-medium tracking-wide uppercase">
              Live Event
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in-up animation-delay-200">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI DEMO NIGHT
            </span>
          </h1>
          <div className="text-xl md:text-2xl text-white/70 font-light animate-fade-in-up animation-delay-300">
            {eventInfo.date} @ {eventInfo.time}
          </div>
        </div>

        {/* Premium Event Details */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8 animate-fade-in-up animation-delay-400">
          <div className="flex items-center gap-3 glass-card px-4 py-2 rounded-xl">
            <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-white/80 text-sm font-medium">{eventInfo.location}</span>
          </div>

          <div className="flex items-center gap-3 glass-card px-4 py-2 rounded-xl">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-white/80 text-sm font-medium">{eventInfo.rsvpCount} RSVPs</span>
          </div>

          <div className="flex items-center gap-3 glass-card px-4 py-2 rounded-xl">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-400 font-semibold text-sm">Free Entry</span>
          </div>
        </div>

        {/* Premium MeetGenius Branding */}
        <div className="text-center animate-fade-in-up animation-delay-500">
          <div className="inline-flex items-center gap-4 glass-card px-8 py-4 rounded-2xl group hover:bg-white/8 transition-all duration-300">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow duration-300">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                MeetGenius
              </div>
              <div className="text-white/60 text-sm font-medium">AI Networking Platform</div>
            </div>
          </div>
        </div>

        {/* Premium Live Status */}
        <div className="text-center mt-6 animate-fade-in-up animation-delay-600">
          <div className="inline-flex items-center gap-3 glass-card px-4 py-2 rounded-xl">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <span className="text-white/70 text-xs font-medium">Live Matching Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};
