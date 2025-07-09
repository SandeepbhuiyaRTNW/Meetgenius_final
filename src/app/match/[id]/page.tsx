'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Match } from '@/types';
import { getProfileImage, getInitials } from '@/utils/imageMapper';
import { useAttendeeStatus } from '@/contexts/AttendeeStatusContext';

export default function MatchDetailPage() {
  const [match, setMatch] = useState<Match | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const matchId = params.id as string;
  const eventId = searchParams.get('event') || 'ride-the-next-wave-demo-night';
  const { attendees } = useAttendeeStatus();

  useEffect(() => {
    loadMatchData();
  }, [matchId]);

  // Sync match data with updated attendee status from global context
  useEffect(() => {
    if (match && attendees.length > 0) {
      // Try to find by ID first, then by name as fallback
      const updatedAttendeeProfile = attendees.find(a =>
        a.id === match.attendeeProfile.id || a.name === match.attendeeProfile.name
      );
      const updatedMatchProfile = attendees.find(a =>
        a.id === match.matchProfile.id || a.name === match.matchProfile.name
      );

      if (updatedAttendeeProfile || updatedMatchProfile) {
        setMatch(prev => prev ? {
          ...prev,
          attendeeProfile: updatedAttendeeProfile || prev.attendeeProfile,
          matchProfile: updatedMatchProfile || prev.matchProfile
        } : null);
      }
    }
  }, [attendees, match?.attendeeProfile.id, match?.matchProfile.id]);

  // Listen for matches refresh events
  useEffect(() => {
    const handleRefreshMatches = () => {
      console.log('Refreshing match data due to status change...');
      loadMatchData();
    };

    window.addEventListener('refreshMatches', handleRefreshMatches);

    return () => {
      window.removeEventListener('refreshMatches', handleRefreshMatches);
    };
  }, []);

  const loadMatchData = async () => {
    try {
      const response = await fetch(`/api/matches?event=${eventId}`);
      const data = await response.json();

      if (response.ok && data.matches) {
        setMatches(data.matches);

        // Decode the matchId and find the match by attendee-match combination
        const decodedMatchId = decodeURIComponent(matchId);
        const currentMatch = data.matches.find((match: Match) => {
          const matchIdentifier = `${match.attendee}-${match.match}`;
          return matchIdentifier === decodedMatchId;
        });

        setMatch(currentMatch || null);
      }
    } catch (error) {
      console.error('Error loading match data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventName = (eventId: string) => {
    switch (eventId) {
      case 'ride-the-next-wave-demo-night': return 'Ride the Next Wave Demo Night';
      case 'ai-demo-night-2025': return 'Ride the Next Wave Demo Night';
      case 'tech-startup-mixer': return 'Tech Startup Mixer';
      case 'fintech-summit': return 'FinTech Innovation Summit';
      case 'healthcare-ai-conference': return 'Healthcare AI Conference';
      default: return 'Ride the Next Wave Demo Night';
    }
  };

  const getCurrentMatchIndex = () => {
    const decodedMatchId = decodeURIComponent(matchId);
    return matches.findIndex((match: Match) => {
      const matchIdentifier = `${match.attendee}-${match.match}`;
      return matchIdentifier === decodedMatchId;
    });
  };

  const navigateToMatch = (direction: 'prev' | 'next') => {
    const currentIndex = getCurrentMatchIndex();
    let newIndex;

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : matches.length - 1;
    } else {
      newIndex = currentIndex < matches.length - 1 ? currentIndex + 1 : 0;
    }

    const nextMatch = matches[newIndex];
    const nextMatchId = encodeURIComponent(`${nextMatch.attendee}-${nextMatch.match}`);
    router.push(`/match/${nextMatchId}?event=${eventId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-400/30 border-t-purple-400 mx-auto mb-4"></div>
          <p className="text-white/60 text-sm">Loading match details...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Match Not Found</h1>
          <Link
            href={`/overview?event=${eventId}`}
            className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
          >
            ← Back to Overview
          </Link>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <span className="text-white/80 text-xs font-medium">
                Match {getCurrentMatchIndex() + 1} of {matches.length}
              </span>
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            </div>
            <Link
              href={`/overview?event=${eventId}`}
              className="text-white/60 hover:text-white transition-colors text-xs font-medium"
            >
              ← Back to Overview
            </Link>

          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-4 mb-8 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></div>
              <span className="text-white/80 text-xs font-medium tracking-wide uppercase">
                Strategic Connection
              </span>
              <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-400/30">
                <span className="text-purple-300 text-xs font-bold">#{getCurrentMatchIndex() + 1}</span>
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Perfect Match
              </span>
            </h1>

            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-400"></div>
              <p className="text-sm text-white/70 font-medium">
                {getEventName(eventId)}
              </p>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-blue-400"></div>
            </div>
          </div>

          {/* Match Score Display */}
          <div className="text-center mb-16 animate-fade-in-up animation-delay-200">
            <div className="inline-flex items-center gap-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="text-center group">
                <div className="relative mb-3">
                  <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {Math.round(match.matchScore * 100)}%
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                </div>
                <div className="text-white/70 text-xs font-medium tracking-wide uppercase">
                  Compatibility Score
                </div>
              </div>
              
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
              
              <div className="text-center group">
                <div className="relative mb-3">
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {match.matchConfidence}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                </div>
                <div className="text-white/70 text-xs font-medium tracking-wide uppercase">
                  Confidence Level
                </div>
              </div>
              
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
              
              <div className="text-center group">
                <div className="relative mb-3">
                  <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Premium
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                </div>
                <div className="text-white/70 text-xs font-medium tracking-wide uppercase">
                  Match Quality
                </div>
              </div>
            </div>
          </div>

          {/* Attendee Profiles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 animate-fade-in-up animation-delay-400">
            {/* Person 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
                <div className="text-center mb-8">
                  <div className="relative mb-6">
                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden mx-auto shadow-2xl shadow-purple-500/25 bg-gradient-to-br from-purple-500 to-purple-600">
                      <Image
                        src={getProfileImage(match.attendee)}
                        alt={match.attendee}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold text-4xl">${getInitials(match.attendee)}</div>`;
                          }
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-2xl blur-lg opacity-50"></div>
                  </div>
                  
                  <h2 className="text-4xl font-bold text-white mb-3 leading-tight">{match.attendee}</h2>
                  <p className="text-base text-purple-300 mb-2 font-medium">{match.attendeeProfile.title}</p>
                  <p className="text-white/60 text-sm">{match.attendeeProfile.company}</p>
                  
                  <div className="mt-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                      match.attendeeProfile.status === 'Present'
                        ? 'bg-green-500/20 text-green-300 border-green-400/30'
                        : match.attendeeProfile.status === 'Checked Out'
                        ? 'bg-orange-500/20 text-orange-300 border-orange-400/30'
                        : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                    }`}>
                      {match.attendeeProfile.status || 'Not Arrived'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-purple-300 mb-4 text-base">Key Expertise</h4>
                    <div className="flex flex-wrap gap-3">
                      {match.attendeeProfile.skills.map((skill, idx) => (
                        <span key={idx} className="px-4 py-2 bg-purple-500/20 text-purple-200 rounded-xl text-xs font-medium border border-purple-400/30 hover:bg-purple-500/30 transition-colors duration-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-purple-300 mb-4 text-base">Experience Highlights</h4>
                    <ul className="text-white/80 space-y-3">
                      {match.attendeeProfile.experience.map((exp, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-xs leading-relaxed">{exp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Person 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                <div className="text-center mb-8">
                  <div className="relative mb-6">
                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden mx-auto shadow-2xl shadow-blue-500/25 bg-gradient-to-br from-blue-500 to-blue-600">
                      <Image
                        src={getProfileImage(match.match)}
                        alt={match.match}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold text-4xl">${getInitials(match.match)}</div>`;
                          }
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-2xl blur-lg opacity-50"></div>
                  </div>
                  
                  <h2 className="text-4xl font-bold text-white mb-3 leading-tight">{match.match}</h2>
                  <p className="text-base text-blue-300 mb-2 font-medium">{match.matchProfile.title}</p>
                  <p className="text-white/60 text-sm">{match.matchProfile.company}</p>
                  
                  <div className="mt-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                      match.matchProfile.status === 'Present'
                        ? 'bg-green-500/20 text-green-300 border-green-400/30'
                        : match.matchProfile.status === 'Checked Out'
                        ? 'bg-orange-500/20 text-orange-300 border-orange-400/30'
                        : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                    }`}>
                      {match.matchProfile.status || 'Not Arrived'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-blue-300 mb-4 text-base">Key Expertise</h4>
                    <div className="flex flex-wrap gap-3">
                      {match.matchProfile.skills.map((skill, idx) => (
                        <span key={idx} className="px-4 py-2 bg-blue-500/20 text-blue-200 rounded-xl text-xs font-medium border border-blue-400/30 hover:bg-blue-500/30 transition-colors duration-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-blue-300 mb-4 text-base">Experience Highlights</h4>
                    <ul className="text-white/80 space-y-3">
                      {match.matchProfile.experience.map((exp, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-green-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-xs leading-relaxed">{exp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 1. Why We Matched Them - Enhanced Visual Connection */}
          <div className="mb-20 animate-fade-in-up animation-delay-600">
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  Why We Matched Them
                </span>
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto rounded-full"></div>
              <p className="text-white/60 mt-4 text-sm max-w-2xl mx-auto">
                Our AI identified {match.whatYouShare.length} key compatibility factors that make this a high-value networking opportunity
              </p>
            </div>

            {/* Visual Connection Diagram */}
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-3xl blur-2xl"></div>
              <div className="relative glass-card p-12 rounded-3xl">
                <div className="flex items-center justify-center">
                  <div className="relative w-full max-w-5xl">
                    {/* Mobile Layout */}
                    <div className="block md:hidden">
                      <div className="space-y-6">
                        {/* Person 1 */}
                        <div className="flex flex-col items-center">
                          <div className="relative w-20 h-20 rounded-2xl overflow-hidden mb-3 shadow-lg shadow-purple-500/25 bg-gradient-to-br from-purple-500 to-blue-500">
                            <Image
                              src={getProfileImage(match.attendee)}
                              alt={match.attendee}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold text-lg">${getInitials(match.attendee)}</div>`;
                                }
                              }}
                            />
                          </div>
                          <h4 className="text-white font-semibold text-sm text-center">{match.attendee}</h4>
                          <p className="text-white/60 text-xs text-center">{match.attendeeProfile.title}</p>
                          <p className="text-white/40 text-xs text-center">{match.attendeeProfile.company}</p>
                        </div>

                        {/* Connection Factors */}
                        <div className="flex justify-center">
                          <div className="grid grid-cols-3 gap-4 max-w-xs">
                            {match.whatYouShare.slice(0, 3).map((factor, idx) => (
                              <div key={idx} className="flex flex-col items-center">
                                <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center mb-2">
                                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
                                </div>
                                <p className="text-xs text-white/70 text-center font-medium leading-tight">{factor}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Person 2 */}
                        <div className="flex flex-col items-center">
                          <div className="relative w-20 h-20 rounded-2xl overflow-hidden mb-3 shadow-lg shadow-blue-500/25 bg-gradient-to-br from-blue-500 to-green-500">
                            <Image
                              src={getProfileImage(match.match)}
                              alt={match.match}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold text-lg">${getInitials(match.match)}</div>`;
                                }
                              }}
                            />
                          </div>
                          <h4 className="text-white font-semibold text-sm text-center">{match.match}</h4>
                          <p className="text-white/60 text-xs text-center">{match.matchProfile.title}</p>
                          <p className="text-white/40 text-xs text-center">{match.matchProfile.company}</p>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                      {/* Left Profile */}
                      <div className="col-span-3 flex flex-col items-center">
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden mb-4 shadow-lg shadow-purple-500/25 bg-gradient-to-br from-purple-500 to-blue-500">
                          <Image
                            src={getProfileImage(match.attendee)}
                            alt={match.attendee}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold text-lg">${getInitials(match.attendee)}</div>`;
                              }
                            }}
                          />
                        </div>
                        <h4 className="text-white font-semibold text-sm text-center max-w-[120px] truncate">{match.attendee}</h4>
                        <p className="text-white/60 text-xs text-center max-w-[120px] leading-tight">{match.attendeeProfile.title}</p>
                        <p className="text-white/40 text-xs text-center max-w-[120px] truncate mt-1">{match.attendeeProfile.company}</p>
                      </div>

                      {/* Connection Lines and Shared Factors */}
                      <div className="col-span-6 relative px-4">
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-purple-400 via-yellow-400 to-blue-400 transform -translate-y-1/2"></div>
                        <div className="grid grid-cols-3 gap-6 items-center justify-items-center">
                          {match.whatYouShare.slice(0, 3).map((factor, idx) => (
                            <div key={idx} className="relative flex flex-col items-center">
                              <div className="w-16 h-16 glass-card rounded-xl flex items-center justify-center group hover:scale-110 transition-transform duration-300 mb-2">
                                <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
                              </div>
                              <div className="w-24 min-h-[32px] flex items-center justify-center">
                                <p className="text-xs text-white/70 text-center font-medium leading-tight">{factor}</p>
                              </div>
                            </div>
                          ))}
                          {/* Fill empty slots if less than 3 factors */}
                          {Array.from({ length: Math.max(0, 3 - match.whatYouShare.length) }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="relative flex flex-col items-center">
                              <div className="w-16 h-16 glass-card rounded-xl flex items-center justify-center opacity-30 mb-2">
                                <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"></div>
                              </div>
                              <div className="w-24 min-h-[32px] flex items-center justify-center">
                                <p className="text-xs text-white/40 text-center font-medium leading-tight">Additional Match</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Profile */}
                      <div className="col-span-3 flex flex-col items-center">
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden mb-4 shadow-lg shadow-blue-500/25 bg-gradient-to-br from-blue-500 to-green-500">
                          <Image
                            src={getProfileImage(match.match)}
                            alt={match.match}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold text-lg">${getInitials(match.match)}</div>`;
                              }
                            }}
                          />
                        </div>
                        <h4 className="text-white font-semibold text-sm text-center max-w-[120px] truncate">{match.match}</h4>
                        <p className="text-white/60 text-xs text-center max-w-[120px] leading-tight">{match.matchProfile.title}</p>
                        <p className="text-white/40 text-xs text-center max-w-[120px] truncate mt-1">{match.matchProfile.company}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Score Visualization */}
                <div className="mt-12 text-center">
                  <div className="inline-flex items-center gap-4 glass-card px-8 py-4 rounded-2xl">
                    <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                      {Math.round(match.matchScore * 100)}%
                    </div>
                    <div className="text-left">
                      <div className="text-white font-semibold text-sm">Compatibility Score</div>
                      <div className="text-white/60 text-xs">{match.matchConfidence} Confidence Match</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Matching Factors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {match.whatYouShare.map((factor, idx) => {
                const icons = [
                  "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", // Skills
                  "M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z", // Experience
                  "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16", // Industry
                  "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", // Goals
                  "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" // Location
                ];
                return (
                  <div key={idx} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <div className="relative glass-card glass-card-hover p-6 rounded-2xl text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/25">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d={icons[idx % icons.length]} clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="text-yellow-300 font-bold text-sm mb-2">{factor}</h4>
                      <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${85 + (idx * 3)}%` }}
                        ></div>
                      </div>
                      <p className="text-white/60 text-xs">Strong alignment</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. What Benefits From Talking - Business Value Focus */}
          <div className="mb-20 animate-fade-in-up animation-delay-800">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  What Benefits From Talking
                </span>
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full"></div>
              <p className="text-white/60 mt-4 text-sm max-w-2xl mx-auto">
                Mutual value opportunities that make this conversation worthwhile for both parties
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Benefits for Attendee */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-3xl blur-2xl"></div>
                <div className="relative glass-card p-8 rounded-3xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                      <span className="text-white font-bold text-lg">{match.attendee.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-purple-300">Benefits for {match.attendee}</h4>
                      <p className="text-white/60 text-sm">{match.attendeeProfile.title}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="text-white font-semibold text-sm mb-1">Industry Insights</h5>
                        <p className="text-white/70 text-xs leading-relaxed">
                          Gain valuable perspectives from {match.matchProfile.company}'s approach to {match.whatYouShare[0]?.toLowerCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="text-white font-semibold text-sm mb-1">Network Expansion</h5>
                        <p className="text-white/70 text-xs leading-relaxed">
                          Access to {match.match}'s professional network and potential collaboration opportunities
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="text-white font-semibold text-sm mb-1">Knowledge Exchange</h5>
                        <p className="text-white/70 text-xs leading-relaxed">
                          Share expertise in {match.attendeeProfile.skills[0]} while learning about {match.matchProfile.skills[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits for Match */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-green-500/5 rounded-3xl blur-2xl"></div>
                <div className="relative glass-card p-8 rounded-3xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <span className="text-white font-bold text-lg">{match.match.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-blue-300">Benefits for {match.match}</h4>
                      <p className="text-white/60 text-sm">{match.matchProfile.title}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="text-white font-semibold text-sm mb-1">Fresh Perspectives</h5>
                        <p className="text-white/70 text-xs leading-relaxed">
                          Learn from {match.attendeeProfile.company}'s innovative approach to {match.whatYouShare[1]?.toLowerCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="text-white font-semibold text-sm mb-1">Collaboration Potential</h5>
                        <p className="text-white/70 text-xs leading-relaxed">
                          Explore potential partnerships or joint initiatives in shared areas of interest
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="text-white font-semibold text-sm mb-1">Mentorship Opportunity</h5>
                        <p className="text-white/70 text-xs leading-relaxed">
                          Share experience and potentially mentor someone passionate about {match.attendeeProfile.interests[0]?.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mutual Business Value */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-3xl blur-2xl"></div>
              <div className="relative glass-card p-8 rounded-3xl">
                <div className="text-center mb-8">
                  <h4 className="text-2xl font-bold text-green-300 mb-2">Mutual Business Value</h4>
                  <p className="text-white/60 text-sm">Strategic opportunities that benefit both parties</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h5 className="text-green-300 font-bold text-sm mb-2">Business Development</h5>
                    <p className="text-white/70 text-xs">Potential client referrals and partnership opportunities</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h5 className="text-green-300 font-bold text-sm mb-2">Knowledge Sharing</h5>
                    <p className="text-white/70 text-xs">Exchange of best practices and industry insights</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h5 className="text-green-300 font-bold text-sm mb-2">Innovation Catalyst</h5>
                    <p className="text-white/70 text-xs">Spark new ideas through diverse perspectives and experiences</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Approach Strategies - Categorized Conversation Starters */}
          <div className="mb-20 animate-fade-in-up animation-delay-1000">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Approach Strategies
                </span>
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
              <p className="text-white/60 mt-4 text-sm max-w-2xl mx-auto">
                Multiple conversation approaches tailored to different contexts and comfort levels
              </p>
            </div>

            {/* Strategy Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Professional Approach */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl blur-2xl"></div>
                <div className="relative glass-card p-8 rounded-3xl">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-blue-300 mb-2">Professional</h4>
                    <p className="text-white/60 text-xs">Business-focused conversation starters</p>
                  </div>

                  <div className="space-y-4">
                    <div className="glass-card p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-blue-300 text-xs font-bold">1</span>
                        </div>
                        <div>
                          <p className="text-white/90 text-sm leading-relaxed">
                            "{match.icebreakers[0] || `I noticed you work at ${match.matchProfile.company}. I'd love to hear about your experience with ${match.whatYouShare[0]?.toLowerCase()}.`}"
                          </p>
                          <span className="text-blue-300 text-xs mt-2 block">Opening line</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-blue-300 text-xs font-bold">2</span>
                        </div>
                        <div>
                          <p className="text-white/90 text-sm leading-relaxed">
                            "What trends are you seeing in {match.matchProfile.title.toLowerCase().includes('data') ? 'data science' : 'your field'}?"
                          </p>
                          <span className="text-blue-300 text-xs mt-2 block">Follow-up question</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-blue-300 text-xs font-bold">3</span>
                        </div>
                        <div>
                          <p className="text-white/90 text-sm leading-relaxed">
                            "I'd be interested in exploring potential collaboration opportunities."
                          </p>
                          <span className="text-blue-300 text-xs mt-2 block">Collaboration opener</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Casual Approach */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-3xl blur-2xl"></div>
                <div className="relative glass-card p-8 rounded-3xl">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-green-300 mb-2">Casual</h4>
                    <p className="text-white/60 text-xs">Relaxed, friendly conversation starters</p>
                  </div>

                  <div className="space-y-4">
                    <div className="glass-card p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-green-300 text-xs font-bold">1</span>
                        </div>
                        <div>
                          <p className="text-white/90 text-sm leading-relaxed">
                            "Hi! I'm {match.attendee}. What brought you to this event?"
                          </p>
                          <span className="text-green-300 text-xs mt-2 block">Friendly introduction</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-green-300 text-xs font-bold">2</span>
                        </div>
                        <div>
                          <p className="text-white/90 text-sm leading-relaxed">
                            "I see we both have an interest in {match.whatYouShare[0]?.toLowerCase()}. How did you get into that?"
                          </p>
                          <span className="text-green-300 text-xs mt-2 block">Common ground</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-green-300 text-xs font-bold">3</span>
                        </div>
                        <div>
                          <p className="text-white/90 text-sm leading-relaxed">
                            "What's the most interesting project you're working on these days?"
                          </p>
                          <span className="text-green-300 text-xs mt-2 block">Interest builder</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project-Focused Approach */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl blur-2xl"></div>
                <div className="relative glass-card p-8 rounded-3xl">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-purple-300 mb-2">Project-Focused</h4>
                    <p className="text-white/60 text-xs">Technical and collaboration-oriented</p>
                  </div>

                  <div className="space-y-4">
                    <div className="glass-card p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-purple-300 text-xs font-bold">1</span>
                        </div>
                        <div>
                          <p className="text-white/90 text-sm leading-relaxed">
                            "{match.icebreakers[1] || `I'd love to learn more about how you approach ${match.whatYouShare[1]?.toLowerCase()} at ${match.matchProfile.company}.`}"
                          </p>
                          <span className="text-purple-300 text-xs mt-2 block">Technical opener</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-purple-300 text-xs font-bold">2</span>
                        </div>
                        <div>
                          <p className="text-white/90 text-sm leading-relaxed">
                            "What challenges are you facing with {match.matchProfile.skills[0]?.toLowerCase()}?"
                          </p>
                          <span className="text-purple-300 text-xs mt-2 block">Problem-solving</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-purple-300 text-xs font-bold">3</span>
                        </div>
                        <div>
                          <p className="text-white/90 text-sm leading-relaxed">
                            "Have you considered collaborating on {match.whatYouShare[2]?.toLowerCase()} initiatives?"
                          </p>
                          <span className="text-purple-300 text-xs mt-2 block">Collaboration idea</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversation Flow Guide */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl blur-2xl"></div>
              <div className="relative glass-card p-8 rounded-3xl">
                <div className="text-center mb-8">
                  <h4 className="text-2xl font-bold text-blue-300 mb-2">Conversation Flow Guide</h4>
                  <p className="text-white/60 text-sm">Suggested progression for a meaningful networking conversation</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h5 className="text-blue-300 font-bold text-sm mb-2">Introduction</h5>
                    <p className="text-white/70 text-xs">Start with a warm greeting and shared context</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h5 className="text-purple-300 font-bold text-sm mb-2">Common Ground</h5>
                    <p className="text-white/70 text-xs">Explore shared interests and experiences</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h5 className="text-pink-300 font-bold text-sm mb-2">Value Exchange</h5>
                    <p className="text-white/70 text-xs">Discuss mutual benefits and opportunities</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <h5 className="text-red-300 font-bold text-sm mb-2">Next Steps</h5>
                    <p className="text-white/70 text-xs">Plan follow-up and exchange contact information</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Additional Insights - Match Metrics & Timing */}
          <div className="mb-20 animate-fade-in-up animation-delay-1200">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  Additional Insights
                </span>
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
              <p className="text-white/60 mt-4 text-sm max-w-2xl mx-auto">
                Strategic insights, optimal timing, and match quality metrics to maximize networking success
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Match Quality Metrics */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl blur-2xl"></div>
                <div className="relative glass-card p-8 rounded-3xl">
                  <div className="text-center mb-8">
                    <h4 className="text-2xl font-bold text-purple-300 mb-2">Match Quality Metrics</h4>
                    <p className="text-white/60 text-sm">AI-powered compatibility analysis</p>
                  </div>

                  <div className="space-y-6">
                    {/* Overall Score */}
                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="2"
                            strokeDasharray={`${match.matchScore * 100}, 100`}
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#8B5CF6" />
                              <stop offset="100%" stopColor="#EC4899" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                              {Math.round(match.matchScore * 100)}%
                            </div>
                            <div className="text-white/60 text-xs">Overall</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Metrics */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">Professional Alignment</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-white/10 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full" style={{ width: '92%' }}></div>
                          </div>
                          <span className="text-purple-300 text-xs font-bold">92%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">Skill Complementarity</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-white/10 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full" style={{ width: '87%' }}></div>
                          </div>
                          <span className="text-purple-300 text-xs font-bold">87%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">Goal Compatibility</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-white/10 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <span className="text-purple-300 text-xs font-bold">85%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">Network Value</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-white/10 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full" style={{ width: '90%' }}></div>
                          </div>
                          <span className="text-purple-300 text-xs font-bold">90%</span>
                        </div>
                      </div>
                    </div>

                    {/* Confidence Level */}
                    <div className="text-center pt-4 border-t border-white/10">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
                        match.matchConfidence === 'High' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                        match.matchConfidence === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
                        'bg-red-500/20 text-red-300 border border-red-400/30'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          match.matchConfidence === 'High' ? 'bg-green-400' :
                          match.matchConfidence === 'Medium' ? 'bg-yellow-400' :
                          'bg-red-400'
                        }`}></div>
                        {match.matchConfidence} Confidence
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optimal Timing & Context */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-green-500/5 rounded-3xl blur-2xl"></div>
                <div className="relative glass-card p-8 rounded-3xl">
                  <div className="text-center mb-8">
                    <h4 className="text-2xl font-bold text-blue-300 mb-2">Optimal Timing & Context</h4>
                    <p className="text-white/60 text-sm">Strategic networking recommendations</p>
                  </div>

                  <div className="space-y-6">
                    {/* Availability Status */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-500/25">
                          <span className="text-white font-bold text-lg">{match.attendee.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <h5 className="text-white font-semibold text-sm mb-1">{match.attendee}</h5>
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          match.attendeeProfile.status === 'Present' ? 'bg-green-500/20 text-green-300' :
                          match.attendeeProfile.status === 'Checked Out' ? 'bg-orange-500/20 text-orange-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            match.attendeeProfile.status === 'Present' ? 'bg-green-400' :
                            match.attendeeProfile.status === 'Checked Out' ? 'bg-orange-400' :
                            'bg-gray-400'
                          }`}></div>
                          {match.attendeeProfile.status || 'Not Arrived'}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/25">
                          <span className="text-white font-bold text-lg">{match.match.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <h5 className="text-white font-semibold text-sm mb-1">{match.match}</h5>
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          match.matchProfile.status === 'Present' ? 'bg-green-500/20 text-green-300' :
                          match.matchProfile.status === 'Checked Out' ? 'bg-orange-500/20 text-orange-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            match.matchProfile.status === 'Present' ? 'bg-green-400' :
                            match.matchProfile.status === 'Checked Out' ? 'bg-orange-400' :
                            'bg-gray-400'
                          }`}></div>
                          {match.matchProfile.status || 'Not Arrived'}
                        </div>
                      </div>
                    </div>

                    {/* Timing Recommendations */}
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="text-white font-semibold text-sm mb-1">Best Time to Approach</h5>
                          <p className="text-white/70 text-xs leading-relaxed">
                            {match.attendeeProfile.status === 'Present' && match.matchProfile.status === 'Present'
                              ? 'Both attendees are present - ideal time for introduction'
                              : match.attendeeProfile.status === 'Present' || match.matchProfile.status === 'Present'
                              ? 'One attendee present - good opportunity when both arrive'
                              : 'Wait for both attendees to arrive for optimal timing'
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="text-white font-semibold text-sm mb-1">Ideal Context</h5>
                          <p className="text-white/70 text-xs leading-relaxed">
                            Networking area or during break sessions when both are available for conversation
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="text-white font-semibold text-sm mb-1">Success Probability</h5>
                          <p className="text-white/70 text-xs leading-relaxed">
                            High likelihood of meaningful connection based on shared {match.whatYouShare.length} compatibility factors
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Recommendations */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-3xl blur-2xl"></div>
              <div className="relative glass-card p-8 rounded-3xl">
                <div className="text-center mb-8">
                  <h4 className="text-2xl font-bold text-purple-300 mb-2">Strategic Recommendations</h4>
                  <p className="text-white/60 text-sm">AI-powered networking strategy for maximum impact</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h5 className="text-purple-300 font-bold text-sm mb-2">Conversation Priority</h5>
                    <p className="text-white/70 text-xs">High-value match - prioritize this connection early in the event</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5 9.293 10.793a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h5 className="text-blue-300 font-bold text-sm mb-2">Follow-up Potential</h5>
                    <p className="text-white/70 text-xs">Strong potential for ongoing professional relationship</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h5 className="text-green-300 font-bold text-sm mb-2">Business Value</h5>
                    <p className="text-white/70 text-xs">Multiple collaboration opportunities and mutual benefits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Overview CTA */}
          <div className="text-center mb-16">
            <Link
              href={`/overview?event=${eventId}`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-2xl text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to All Matches
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 px-6">
          <div className="max-w-6xl mx-auto text-center">
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
    </div>
  );
}
