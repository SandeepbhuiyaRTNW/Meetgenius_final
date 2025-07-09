'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Profile } from '@/types';
import AttendeeCard from '@/components/AttendeeCard';
import StatusChip from '@/components/StatusChip';
import { useAttendeeStatus } from '@/contexts/AttendeeStatusContext';

function AttendeesContent() {
  const { attendees, updateAttendeeStatus, isLoading } = useAttendeeStatus();
  const [statusSummary, setStatusSummary] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Present' | 'Not Arrived' | 'Checked Out'>('all');
  const [filteredAttendees, setFilteredAttendees] = useState<Profile[]>([]);
  const searchParams = useSearchParams();
  const eventId = searchParams.get('event') || 'ride-the-next-wave-demo-night';

  useEffect(() => {
    filterAttendees();
  }, [attendees, searchQuery, statusFilter]);

  useEffect(() => {
    // Calculate status summary from attendees
    const summary: Record<string, number> = {};
    attendees.forEach(attendee => {
      const status = attendee.status || 'Not Arrived';
      summary[status] = (summary[status] || 0) + 1;
    });
    setStatusSummary(summary);
  }, [attendees]);

  const filterAttendees = () => {
    let filtered = attendees;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(attendee =>
        attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(attendee => 
        (attendee.status || 'Not Arrived') === statusFilter
      );
    }

    setFilteredAttendees(filtered);
  };

  const handleStatusUpdate = async (profileId: string, newStatus: 'Present' | 'Not Arrived' | 'Checked Out') => {
    try {
      await updateAttendeeStatus(profileId, newStatus, eventId);
      console.log(`Status updated successfully for ${profileId}`);
    } catch (error) {
      console.error('Error updating status:', error);
      // Could show error toast notification here
    }
  };

  const getEventName = (eventId: string) => {
    switch (eventId) {
      case 'ride-the-next-wave-demo-night': return 'Ride the Next Wave Demo Night';
      default: return 'Event Attendees';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading attendees...</p>
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
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              MeetGenius
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <span className="text-white/80 text-sm font-medium">
                {filteredAttendees.length} of {attendees.length} attendees
              </span>
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            </div>
            <Link href={`/overview?event=${eventId}`} className="text-white/60 hover:text-white transition-colors text-sm font-medium">
              Go to Overview →
            </Link>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section className="pt-24 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Event Attendees
              </span>
            </h1>
            <p className="text-lg text-white/70 font-medium mb-6">
              {getEventName(eventId)}
            </p>

            {/* Status Summary */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-xl border border-green-400/30">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-green-300 font-medium">Present: {statusSummary.Present || 0}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 rounded-xl border border-gray-400/30">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-gray-300 font-medium">Not Arrived: {statusSummary['Not Arrived'] || 0}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-xl border border-orange-400/30">
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                <span className="text-orange-300 font-medium">Checked Out: {statusSummary['Checked Out'] || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search attendees by name, title, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-300"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {(['all', 'Present', 'Not Arrived', 'Checked Out'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    statusFilter === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Attendees Grid */}
      <section className="pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredAttendees.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/60 text-lg">
                {searchQuery || statusFilter !== 'all' 
                  ? 'No attendees match your filters' 
                  : 'No attendees found'
                }
              </p>
              {(searchQuery || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAttendees.map((attendee, index) => (
                <div
                  key={attendee.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <AttendeeCard
                    profile={attendee}
                    onStatusUpdate={handleStatusUpdate}
                    showCheckInButton={true}
                    compact={false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
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
              <p className="text-white/60 text-sm">Real-time attendee management and networking intelligence.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function AttendeesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading attendees...</div>
      </div>
    }>
      <AttendeesContent />
    </Suspense>
  );
}