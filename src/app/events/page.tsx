'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  description: string;
  status: 'upcoming' | 'processing' | 'completed';
  image: string;
}

const mockEvents: Event[] = [
  {
    id: 'ride-the-next-wave-demo-night',
    name: 'Ride the Next Wave Demo Night',
    date: 'July 9, 2025',
    time: '7:00 PM',
    location: 'Minneapolis, MN',
    attendees: 15,
    description: 'Premier networking event for Minneapolis tech professionals, entrepreneurs, and innovators. Connect with like-minded individuals and discover your next business opportunity.',
    status: 'completed',
    image: ''
  }
];

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const router = useRouter();

  const handleEventSelect = (eventId: string) => {
    setSelectedEvent(eventId);
    // Navigate to loading screen first
    setTimeout(() => {
      router.push(`/loading?event=${eventId}`);
    }, 800);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-yellow-500';
      case 'upcoming': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Matches Available';
      case 'processing': return 'Processing';
      case 'upcoming': return 'Ready to Match';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
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
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <span className="text-white/80 text-sm font-medium">Select Event</span>
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></div>
          </div>
        </div>
      </nav>

      {/* Premium Header */}
      <section className="py-20 px-6 pt-32">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-4 mb-8 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl animate-fade-in-up">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></div>
            <span className="text-white/80 text-sm font-medium tracking-wide uppercase">
              Event Selection
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight animate-fade-in-up animation-delay-200">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Choose Your Event
            </span>
          </h1>

          <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in-up animation-delay-400">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-400"></div>
            <p className="text-sm text-white/70 font-medium max-w-3xl">
              Select an event to analyze attendee profiles and generate intelligent networking matches
            </p>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-blue-400"></div>
          </div>
        </div>
      </section>

      {/* Premium Events Grid */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center">
            {mockEvents.map((event, index) => (
              <div
                key={event.id}
                className={`group relative cursor-pointer transition-all duration-500 animate-fade-in-up max-w-3xl w-full ${
                  selectedEvent === event.id ? 'scale-105' : 'hover:scale-105'
                }`}
                style={{ animationDelay: `${index * 200 + 600}ms` }}
                onClick={() => handleEventSelect(event.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className={`relative bg-black/40 backdrop-blur-xl border rounded-3xl p-10 shadow-2xl transition-all duration-500 ${
                  selectedEvent === event.id
                    ? 'border-purple-400/50 shadow-purple-500/20'
                    : 'border-white/10 hover:shadow-purple-500/10'
                }`}>
                  {/* Premium Event Header */}
                <div className="flex items-start justify-between mb-8">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-2xl blur-lg opacity-50"></div>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold text-white border ${
                    event.status === 'completed'
                      ? 'bg-green-500/20 border-green-400/30 text-green-300'
                      : 'bg-blue-500/20 border-blue-400/30 text-blue-300'
                  }`}>
                    {getStatusText(event.status)}
                  </div>
                </div>

                {/* Premium Event Details */}
                <div className="mb-8">
                  <h3 className="text-4xl font-bold mb-4 text-white leading-tight">{event.name}</h3>
                  <p className="text-white/80 mb-6 text-base leading-relaxed">{event.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs font-medium uppercase tracking-wide">Date & Time</div>
                        <div className="text-white font-medium text-sm">{event.date}</div>
                        <div className="text-white/80 text-xs">{event.time}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs font-medium uppercase tracking-wide">Location</div>
                        <div className="text-white font-medium text-sm">{event.location}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs font-medium uppercase tracking-wide">Attendees</div>
                        <div className="text-white font-medium text-sm">{event.attendees} professionals</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Action Section */}
                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <div className="text-white/60 text-sm">
                    {event.status === 'completed' ? 'Ready to view intelligent matches' : 'Generate AI-powered networking matches'}
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedEvent === event.id ? (
                      <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                        <span className="text-white font-medium text-sm">Initializing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                        <span className="text-white font-medium text-sm">Start Analysis</span>
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-8 animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-8 animate-fade-in-up">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
              <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center mb-4 transform hover:scale-110 transition-transform duration-300 animate-pulse">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <h4 className="font-semibold mb-2 text-lg">Select Event</h4>
                <p className="text-gray-400 text-sm">Choose your networking event from the list above</p>
              </div>
              <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mb-4 transform hover:scale-110 transition-transform duration-300 animate-pulse">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h4 className="font-semibold mb-2 text-lg">Intelligent Processing</h4>
                <p className="text-gray-400 text-sm">Our algorithms analyze attendee profiles and preferences</p>
              </div>
              <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mb-4 transform hover:scale-110 transition-transform duration-300 animate-pulse">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h4 className="font-semibold mb-2 text-lg">View Matches</h4>
                <p className="text-gray-400 text-sm">Get personalized matches with conversation starters</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 mt-12">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/rtnw-logo.jpeg"
              alt="Ride The Next Wave"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <div className="text-left">
              <div className="text-white font-semibold">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">MeetGenius</span>
                <span className="text-white/80"> is powered by </span>
                <span className="text-white">Ride The Next Wave</span>
              </div>
              <p className="text-white/60 text-sm">Transform your ideas into impactful digital solutions swiftly and effectively.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
