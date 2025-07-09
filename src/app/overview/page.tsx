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

function OverviewContent() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const searchParams = useSearchParams();
  const eventId = searchParams.get('event');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const { attendees, updateAttendeeStatus } = useAttendeeStatus();

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
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
    }
  }, [searchQuery, matches]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading matches overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
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
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <span className="text-white/80 text-sm font-medium">
                {filteredMatches.length} Strategic Connections
              </span>
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <Link href={`/matches?event=${eventId}`} className="text-white/60 hover:text-white transition-colors text-xs font-medium hidden sm:block">
                Carousel View
              </Link>
              <Link href={`/attendees?event=${eventId}`} className="text-white/60 hover:text-white transition-colors text-xs font-medium hidden sm:block">
                Attendee Status
              </Link>
              <div className="w-px h-4 bg-white/20 hidden sm:block"></div>
              <Link href="/events" className="text-white/60 hover:text-white transition-colors text-xs font-medium">
                <span className="hidden sm:inline">← Back to Events</span>
                <span className="sm:hidden">← Back</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Strategic Connections
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              Ride the Next Wave Demo Night
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>{matches.length} High-Quality Matches</span>
              </div>
              <div className="w-px h-4 bg-white/20 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>AI-Powered Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-8 md:mb-12">
            <div className="relative max-w-md w-full mx-4 sm:mx-0">
              <input
                type="text"
                placeholder="Search matches by name, title, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300 text-sm sm:text-base"
              />
              <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matches List */}
      <section className="pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {filteredMatches.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/60 text-lg">No matches found for "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredMatches.map((match, index) => (
                <MatchOverviewCard 
                  key={index} 
                  match={match} 
                  index={index} 
                  eventId={eventId}
                  updatingStatus={updatingStatus}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </section>

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
  );
}

// Match Overview Card Component
interface MatchOverviewCardProps {
  match: Match;
  index: number;
  eventId: string | null;
  updatingStatus: string | null;
  onStatusUpdate: (profileId: string, newStatus: 'Present' | 'Not Arrived' | 'Checked Out') => Promise<void>;
}

function MatchOverviewCard({ match, index, eventId, updatingStatus, onStatusUpdate }: MatchOverviewCardProps) {
  // Create a unique identifier for the match
  const matchId = encodeURIComponent(`${match.attendee}-${match.match}`);

  return (
    <Link
      href={`/match/${matchId}?event=${eventId}`}
      className="block group animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/20 backdrop-blur-sm border border-purple-700/30 rounded-xl p-4 md:p-6 hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
        {/* Mobile Layout */}
        <div className="block md:hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
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
                      parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold text-sm">${getInitials(match.attendee)}</div>`;
                    }
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white text-sm truncate">{match.attendee}</h3>
                <p className="text-gray-300 text-xs truncate">{match.attendeeProfile.title}</p>
              </div>
            </div>
            <div className="bg-green-600 text-white px-3 py-1 rounded-lg font-bold text-sm flex-shrink-0">
              {Math.round(match.matchScore * 100)}%
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
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
                      parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold text-sm">${getInitials(match.match)}</div>`;
                    }
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white text-sm truncate">{match.match}</h3>
                <p className="text-gray-300 text-xs truncate">{match.matchProfile.title}</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-gray-300 text-xs font-medium truncate max-w-[80px]">
                {match.whatYouShare[0] || 'Common interests'}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-12 gap-4 items-center">
          {/* Person 1 - Fixed width columns */}
          <div className="col-span-4 flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
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
                      parent.innerHTML = `<div class=\"w-full h-full flex items-center justify-center text-white font-bold text-lg\">${getInitials(match.attendee)}</div>`;
                    }
                  }}
                />
              </div>
              <div className="mt-2">
                <StatusChip
                  status={match.attendeeProfile.status || 'Not Arrived'}
                  onStatusChange={(newStatus) => onStatusUpdate(match.attendeeProfile.id, newStatus)}
                  isLoading={updatingStatus === match.attendeeProfile.id}
                  size="sm"
                  showIcon={true}
                  interactive={true}
                />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white text-base truncate">{match.attendee}</h3>
              <p className="text-gray-300 text-sm truncate">{match.attendeeProfile.title}</p>
              <p className="text-gray-400 text-sm truncate">{match.attendeeProfile.company}</p>
            </div>
          </div>

          {/* Spacer 1 */}
          <div className="col-span-1"></div>

          {/* Person 2 - Fixed width columns */}
          <div className="col-span-4 flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
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
                      parent.innerHTML = `<div class=\"w-full h-full flex items-center justify-center text-white font-bold text-lg\">${getInitials(match.match)}</div>`;
                    }
                  }}
                />
              </div>
              <div className="mt-2">
                <StatusChip
                  status={match.matchProfile.status || 'Not Arrived'}
                  onStatusChange={(newStatus) => onStatusUpdate(match.matchProfile.id, newStatus)}
                  isLoading={updatingStatus === match.matchProfile.id}
                  size="sm"
                  showIcon={true}
                  interactive={true}
                />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white text-base truncate">{match.match}</h3>
              <p className="text-gray-300 text-sm truncate">{match.matchProfile.title}</p>
              <p className="text-gray-400 text-sm truncate">{match.matchProfile.company}</p>
            </div>
          </div>

          {/* Spacer 2 */}
          <div className="col-span-1"></div>

          {/* Match Info - Fixed width columns */}
          <div className="col-span-2 flex items-center justify-end gap-4">
            <div className="text-right">
              <p className="text-gray-300 text-sm font-medium truncate">
                {match.whatYouShare[0] || 'Common interests'}
              </p>
            </div>
            <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-lg w-20 text-center flex-shrink-0">
              {Math.round(match.matchScore * 100)}%
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function OverviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading overview...</div>
    </div>}>
      <OverviewContent />
    </Suspense>
  );
}
