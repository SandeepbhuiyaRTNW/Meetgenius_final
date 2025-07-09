'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Match } from '@/types';
import { getProfileImage, getInitials } from '@/utils/imageMapper';
import StatusChip from '@/components/StatusChip';
import { useAttendeeStatus } from '@/contexts/AttendeeStatusContext';

export const dynamic = 'force-dynamic';

function MatchesContent() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const searchParams = useSearchParams();
  const eventId = searchParams.get('event');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const { attendees, updateAttendeeStatus } = useAttendeeStatus();

  const loadMatches = async () => {
    try {
      const response = await fetch('/api/matches');
      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || data);
      }
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextMatch = () => {
    if (isAnimating || filteredMatches.length === 0) return;
    setIsAnimating(true);
    setExpandedSection(null);
    setTimeout(() => {
      setCurrentMatchIndex((prev) => (prev + 1) % filteredMatches.length);
      setIsAnimating(false);
    }, 300);
  };

  const prevMatch = () => {
    if (isAnimating || filteredMatches.length === 0) return;
    handleUserInteraction(); // Pause auto-advance when user manually navigates
    setIsAnimating(true);
    setExpandedSection(null);
    setTimeout(() => {
      setCurrentMatchIndex((prev) => (prev - 1 + filteredMatches.length) % filteredMatches.length);
      setIsAnimating(false);
    }, 300);
  };

  const nextMatchManual = () => {
    handleUserInteraction(); // Pause auto-advance when user manually navigates
    nextMatch();
  };

  const goToMatch = (index: number) => {
    if (isAnimating || index === currentMatchIndex) return;
    setIsAnimating(true);
    setExpandedSection(null);
    setTimeout(() => {
      setCurrentMatchIndex(index);
      setIsAnimating(false);
    }, 300);
  };

  const getEventName = (eventId: string | null) => {
    switch (eventId) {
      case 'ride-the-next-wave-demo-night': return 'Ride the Next Wave Demo Night';
      case 'ai-demo-night-2025': return 'Ride the Next Wave Demo Night';
      case 'tech-startup-mixer': return 'Tech Startup Mixer';
      case 'fintech-summit': return 'FinTech Innovation Summit';
      case 'healthcare-ai-conference': return 'Healthcare AI Conference';
      default: return 'Ride the Next Wave Demo Night';
    }
  };

  const getCompatibilityInsight = (score: number) => {
    if (score >= 0.9) return { level: 'Exceptional', color: 'text-green-400', description: 'Perfect synergy potential' };
    if (score >= 0.8) return { level: 'Excellent', color: 'text-blue-400', description: 'Strong compatibility' };
    if (score >= 0.7) return { level: 'Good', color: 'text-yellow-400', description: 'Solid foundation' };
    return { level: 'Moderate', color: 'text-orange-400', description: 'Potential for growth' };
  };

  useEffect(() => {
    loadMatches();
  }, []);

  // Filter matches based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMatches(matches);
    } else {
      const filtered = matches.filter(match =>
        match.attendee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.match.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.attendeeProfile.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.matchProfile.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.attendeeProfile.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.matchProfile.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.whatYouShare.some(factor => factor.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredMatches(filtered);
      setCurrentMatchIndex(0);
    }
  }, [searchQuery, matches]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextMatchManual();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevMatch();
      } else if (e.key === 'Escape') {
        setExpandedSection(null);
      } else if (e.key === ' ') {
        e.preventDefault();
        setAutoAdvance(!autoAdvance);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-advance slideshow every 3 seconds
  useEffect(() => {
    if (!autoAdvance || isPaused || filteredMatches.length === 0 || isAnimating) {
      return;
    }

    const interval = setInterval(() => {
      nextMatch();
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, [autoAdvance, isPaused, filteredMatches.length, isAnimating, currentMatchIndex]);

  // Pause auto-advance when user interacts
  const handleUserInteraction = () => {
    setIsPaused(true);
    // Resume after 10 seconds of no interaction
    setTimeout(() => setIsPaused(false), 10000);
  };

  // Sync matches with updated attendee status from global context
  useEffect(() => {
    if (matches.length > 0 && attendees.length > 0) {
      setMatches(prev => prev.map(match => {
        // Try to find by ID first, then by name as fallback
        const updatedAttendeeProfile = attendees.find(a =>
          a.id === match.attendeeProfile.id || a.name === match.attendeeProfile.name
        );
        const updatedMatchProfile = attendees.find(a =>
          a.id === match.matchProfile.id || a.name === match.matchProfile.name
        );

        return {
          ...match,
          attendeeProfile: updatedAttendeeProfile || match.attendeeProfile,
          matchProfile: updatedMatchProfile || match.matchProfile
        };
      }));
    }
  }, [attendees]);

  // Listen for matches refresh events
  useEffect(() => {
    const handleRefreshMatches = () => {
      console.log('Refreshing matches due to status change...');
      loadMatches();
    };

    window.addEventListener('refreshMatches', handleRefreshMatches);

    return () => {
      window.removeEventListener('refreshMatches', handleRefreshMatches);
    };
  }, []);

  const handleStatusUpdate = async (profileId: string, newStatus: 'Present' | 'Not Arrived' | 'Checked Out') => {
    setUpdatingStatus(profileId);
    try {
      await updateAttendeeStatus(profileId, newStatus, eventId || 'ride-the-next-wave-demo-night');

      // Update matches with new profile status from global context
      const updatedProfile = attendees.find(a => a.id === profileId || a.name === profileId);
      if (updatedProfile) {
        setMatches(prev => prev.map(match => ({
          ...match,
          attendeeProfile: (match.attendeeProfile.id === profileId || match.attendeeProfile.name === profileId) ? updatedProfile : match.attendeeProfile,
          matchProfile: (match.matchProfile.id === profileId || match.matchProfile.name === profileId) ? updatedProfile : match.matchProfile
        })));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading matches...</p>
        </div>
      </div>
    );
  }

  const currentMatch = filteredMatches[currentMatchIndex];

  if (!currentMatch) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">No matches found.</p>
          <Link href="/events" className="text-purple-400 hover:text-purple-300 mt-4 inline-block">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
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
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              MeetGenius
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <span className="text-white/80 text-sm font-medium">
                Match {currentMatchIndex + 1} of {matches.length}
              </span>
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            </div>
            <Link href="/events" className="text-white/60 hover:text-white transition-colors text-xs font-medium">
              ← Back to Events
            </Link>
          </div>
        </div>
      </nav>

      {/* Header - Perfect Matches at Top */}
      <section className="py-6 px-6 pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">

            {/* Perfect Matches Title - Very Top */}
            <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Perfect Matches
              </span>
            </h1>

            {/* Event Name */}
            <p className="text-lg text-white/70 font-medium mb-6">
              {getEventName(eventId)}
            </p>

            {/* Strategic Connections Info */}
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 shadow-lg mb-6">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-sm font-medium tracking-wide uppercase">
                Strategic Connections
              </span>
              <span className="text-purple-300 text-sm font-bold">
                {searchQuery ? `${filteredMatches.length} of ${matches.length}` : `${matches.length} Matches`}
              </span>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search matches by name, title, company, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white transition-colors"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center gap-3 mb-6">
              {filteredMatches.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToMatch(index)}
                  className={`group relative w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 ${
                    index === currentMatchIndex
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/50'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                >
                  {index === currentMatchIndex && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-lg animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Match Cards - Bigger Cards with Smaller Percentage */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>

            {/* Match Cards with Minimal Percentage - Fixed Height */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-stretch gap-4 min-h-[600px]">

                  {/* Person 1 - Fixed Height Card */}
                  <div className="flex-1 group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                    <div className="relative bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 h-full flex flex-col">

                      {/* Header Section - Fixed Height */}
                      <div className="text-center mb-6 flex-shrink-0">
                        <div className="relative mb-6">
                          <div className="relative w-24 h-24 rounded-2xl overflow-hidden mx-auto shadow-2xl shadow-purple-500/25 bg-gradient-to-br from-purple-500 to-purple-600">
                            {/* Status Chip positioned over profile image */}
                            <div className="absolute -top-2 -right-2 z-10">
                              <StatusChip
                                status={currentMatch.attendeeProfile.status || 'Not Arrived'}
                                onStatusChange={(newStatus) => handleStatusUpdate(currentMatch.attendeeProfile.id, newStatus)}
                                isLoading={updatingStatus === currentMatch.attendeeProfile.id}
                                size="sm"
                                showIcon={true}
                                interactive={true}
                              />
                            </div>
                            <Image
                              src={getProfileImage(currentMatch.attendee)}
                              alt={currentMatch.attendee}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold text-3xl">${getInitials(currentMatch.attendee)}</div>`;
                                }
                              }}
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-2xl blur-lg opacity-50"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 leading-tight">{currentMatch.attendee}</h3>
                        <p className="text-lg text-purple-300 mb-2 font-medium">{currentMatch.attendeeProfile.title}</p>
                        <p className="text-sm text-white/60 mb-4">{currentMatch.attendeeProfile.company}</p>
                        <div className="mb-4">
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                            (currentMatch.attendeeProfile.status || 'Not Arrived') === 'Present'
                              ? 'bg-green-500/20 text-green-300 border-green-400/30'
                              : (currentMatch.attendeeProfile.status || 'Not Arrived') === 'Checked Out'
                              ? 'bg-orange-500/20 text-orange-300 border-orange-400/30'
                              : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                          }`}>
                            {currentMatch.attendeeProfile.status || 'Not Arrived'}
                          </span>
                        </div>
                      </div>

                      {/* Skills Section - Flexible Height */}
                      <div className="flex-1 flex flex-col justify-center">
                        <div>
                          <h4 className="font-bold text-purple-300 mb-4 text-lg text-center">Key Expertise</h4>
                          <div className="flex flex-wrap gap-3 justify-center">
                            {currentMatch.attendeeProfile.skills.slice(0, 6).map((skill, idx) => (
                              <span key={idx} className="px-4 py-2 bg-purple-500/20 text-purple-200 rounded-xl text-sm font-medium border border-purple-400/30 hover:bg-purple-500/30 transition-colors duration-300">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Left Divider Line */}
                  <div className="flex-shrink-0 flex items-center">
                    <div className="w-px h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                  </div>

                  {/* Minimal Percentage - Centered */}
                  <div className="flex-shrink-0 flex items-center">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-lg">
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          {Math.round(currentMatch.matchScore * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Divider Line */}
                  <div className="flex-shrink-0 flex items-center">
                    <div className="w-px h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                  </div>

                  {/* Person 2 - Fixed Height Card */}
                  <div className="flex-1 group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                    <div className="relative bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 h-full flex flex-col">

                      {/* Header Section - Fixed Height */}
                      <div className="text-center mb-6 flex-shrink-0">
                        <div className="relative mb-6">
                          <div className="relative w-24 h-24 rounded-2xl overflow-hidden mx-auto shadow-2xl shadow-blue-500/25 bg-gradient-to-br from-blue-500 to-blue-600">
                            {/* Status Chip positioned over profile image */}
                            <div className="absolute -top-2 -right-2 z-10">
                              <StatusChip
                                status={currentMatch.matchProfile.status || 'Not Arrived'}
                                onStatusChange={(newStatus) => handleStatusUpdate(currentMatch.matchProfile.id, newStatus)}
                                isLoading={updatingStatus === currentMatch.matchProfile.id}
                                size="sm"
                                showIcon={true}
                                interactive={true}
                              />
                            </div>
                            <Image
                              src={getProfileImage(currentMatch.match)}
                              alt={currentMatch.match}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold text-3xl">${getInitials(currentMatch.match)}</div>`;
                                }
                              }}
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-2xl blur-lg opacity-50"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 leading-tight">{currentMatch.match}</h3>
                        <p className="text-lg text-blue-300 mb-2 font-medium">{currentMatch.matchProfile.title}</p>
                        <p className="text-sm text-white/60 mb-4">{currentMatch.matchProfile.company}</p>
                        <div className="mb-4">
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                            (currentMatch.matchProfile.status || 'Not Arrived') === 'Present'
                              ? 'bg-green-500/20 text-green-300 border-green-400/30'
                              : (currentMatch.matchProfile.status || 'Not Arrived') === 'Checked Out'
                              ? 'bg-orange-500/20 text-orange-300 border-orange-400/30'
                              : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                          }`}>
                            {currentMatch.matchProfile.status || 'Not Arrived'}
                          </span>
                        </div>
                      </div>

                      {/* Skills Section - Flexible Height */}
                      <div className="flex-1 flex flex-col justify-center">
                        <div>
                          <h4 className="font-bold text-blue-300 mb-4 text-lg text-center">Key Expertise</h4>
                          <div className="flex flex-wrap gap-3 justify-center">
                            {currentMatch.matchProfile.skills.slice(0, 6).map((skill, idx) => (
                              <span key={idx} className="px-4 py-2 bg-blue-500/20 text-blue-200 rounded-xl text-sm font-medium border border-blue-400/30 hover:bg-blue-500/30 transition-colors duration-300">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Information Sections - Even Height Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6 auto-rows-fr">

              {/* 1. Why We Matched Them */}
              <div className="group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                  <button
                    onClick={() => setExpandedSection(expandedSection === 'why-matched' ? null : 'why-matched')}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-all duration-300 flex-shrink-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm">Why We Matched Them</span>
                        <div className="text-xs text-green-300 mt-1">
                          {currentMatch.whatYouShare.length} shared factors
                        </div>
                      </div>
                    </div>
                    <svg
                      className={`w-4 h-4 text-white/60 transform transition-transform duration-300 ${
                        expandedSection === 'why-matched' ? 'rotate-180' : ''
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {expandedSection === 'why-matched' && (
                    <div className="p-4 pt-0 animate-fade-in flex-1">
                      <div className="flex flex-wrap gap-2">
                        {currentMatch.whatYouShare.map((factor, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-300 rounded-lg text-xs font-medium border border-green-400/30">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. What Benefit Would Come From Them Talking */}
              <div className="group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                  <button
                    onClick={() => setExpandedSection(expandedSection === 'benefits' ? null : 'benefits')}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-all duration-300 flex-shrink-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm">What Benefits From Talking</span>
                        <div className="text-xs text-blue-300 mt-1">
                          Mutual value opportunities
                        </div>
                      </div>
                    </div>
                    <svg
                      className={`w-4 h-4 text-white/60 transform transition-transform duration-300 ${
                        expandedSection === 'benefits' ? 'rotate-180' : ''
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {expandedSection === 'benefits' && (
                    <div className="p-4 pt-0 animate-fade-in flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                          <h6 className="font-bold text-blue-300 mb-2 text-xs">For {currentMatch.attendee}</h6>
                          <ul className="space-y-1 text-xs text-blue-200">
                            <li>• Access to {currentMatch.matchProfile.company}'s network</li>
                            <li>• Learn from {currentMatch.match}'s expertise</li>
                            <li>• Collaboration opportunities</li>
                          </ul>
                        </div>
                        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
                          <h6 className="font-bold text-cyan-300 mb-2 text-xs">For {currentMatch.match}</h6>
                          <ul className="space-y-1 text-xs text-cyan-200">
                            <li>• Insights from {currentMatch.attendeeProfile.company}</li>
                            <li>• Fresh perspective on challenges</li>
                            <li>• Mentorship opportunities</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Approach Strategies for Both Parties */}
              <div className="group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                  <button
                    onClick={() => setExpandedSection(expandedSection === 'strategies' ? null : 'strategies')}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-all duration-300 flex-shrink-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5 9.293 10.793a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm">Approach Strategies</span>
                        <div className="text-xs text-purple-300 mt-1">
                          Conversation starters
                        </div>
                      </div>
                    </div>
                    <svg
                      className={`w-4 h-4 text-white/60 transform transition-transform duration-300 ${
                        expandedSection === 'strategies' ? 'rotate-180' : ''
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {expandedSection === 'strategies' && (
                    <div className="p-4 pt-0 animate-fade-in flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
                          <h6 className="font-bold text-purple-300 mb-2 text-xs">For {currentMatch.attendee}</h6>
                          <ul className="space-y-1 text-xs text-purple-200">
                            <li>• Lead with shared {currentMatch.whatYouShare[0]?.toLowerCase()}</li>
                            <li>• Ask about their {currentMatch.matchProfile.title.toLowerCase()} journey</li>
                            <li>• Explore collaboration opportunities</li>
                          </ul>
                        </div>
                        <div className="bg-pink-900/20 border border-pink-500/30 rounded-lg p-3">
                          <h6 className="font-bold text-pink-300 mb-2 text-xs">For {currentMatch.match}</h6>
                          <ul className="space-y-1 text-xs text-pink-200">
                            <li>• Connect over {currentMatch.whatYouShare[1]?.toLowerCase()}</li>
                            <li>• Share insights about {currentMatch.attendeeProfile.company}</li>
                            <li>• Offer mentorship opportunities</li>
                          </ul>
                        </div>
                      </div>
                      <div className="border-t border-white/10 pt-3">
                        <h6 className="font-bold text-white mb-2 text-xs">Conversation Starters</h6>
                        <div className="space-y-2">
                          {currentMatch.icebreakers.slice(0, 2).map((icebreaker, idx) => (
                            <div key={idx} className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-2">
                              <p className="text-purple-200 italic text-xs">"{icebreaker}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Additional Insights */}
              <div className="group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                  <button
                    onClick={() => setExpandedSection(expandedSection === 'insights' ? null : 'insights')}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-all duration-300 flex-shrink-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm">Additional Insights</span>
                        <div className="text-xs text-yellow-300 mt-1">
                          Match quality & timing
                        </div>
                      </div>
                    </div>
                    <svg
                      className={`w-4 h-4 text-white/60 transform transition-transform duration-300 ${
                        expandedSection === 'insights' ? 'rotate-180' : ''
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {expandedSection === 'insights' && (
                    <div className="p-4 pt-0 animate-fade-in flex-1">
                      <div className="space-y-3">
                        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                          <h6 className="font-bold text-yellow-300 mb-2 text-xs">Match Quality</h6>
                          <p className="text-xs text-yellow-200">
                            This is a {getCompatibilityInsight(currentMatch.matchScore).level.toLowerCase()} match with {getCompatibilityInsight(currentMatch.matchScore).description.toLowerCase()}.
                          </p>
                        </div>
                        <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
                          <h6 className="font-bold text-orange-300 mb-2 text-xs">Best Time to Connect</h6>
                          <p className="text-xs text-orange-200">
                            Both attendees are {(currentMatch.attendeeProfile.status || 'Not Arrived') === 'Present' && (currentMatch.matchProfile.status || 'Not Arrived') === 'Present' ? 'currently present' : 'available'} at the event. Ideal for immediate networking.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Compact Navigation Controls */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={prevMatch}
                disabled={filteredMatches.length <= 1 || isAnimating}
                className="group w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              <div className="text-center px-4 py-2 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                <div className="text-xs text-white/60 font-medium tracking-wide uppercase">Match</div>
                <div className="text-sm font-bold text-white">
                  {currentMatchIndex + 1} of {filteredMatches.length}
                </div>
              </div>

              <button
                onClick={nextMatchManual}
                disabled={filteredMatches.length <= 1 || isAnimating}
                className="group w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Auto-advance Toggle */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setAutoAdvance(!autoAdvance)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                  autoAdvance
                    ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                    : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${autoAdvance ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                {autoAdvance ? 'Auto-Slideshow ON' : 'Auto-Slideshow OFF'}
                {isPaused && autoAdvance && (
                  <span className="text-yellow-300">(Paused)</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Footer */}
      <footer className="border-t border-gray-800/50 py-4 px-6 mt-8">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Image
              src="/meetgenius-logo.png"
              alt="MeetGenius Logo"
              width={20}
              height={20}
              className="rounded-lg"
            />
            <span className="text-sm font-bold text-white">MeetGenius</span>
          </div>
          <p className="text-xs">
            {matches.length} strategic connections • {Math.round((matches.reduce((sum, m) => sum + m.matchScore, 0) / matches.length) * 100)}% average compatibility
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function MatchesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading matches...</div>
    </div>}>
      <MatchesContent />
    </Suspense>
  );
}