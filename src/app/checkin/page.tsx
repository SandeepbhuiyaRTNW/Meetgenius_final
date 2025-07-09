'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Profile } from '@/types';
import { getProfileImage } from '@/utils/imageMapper';
import { useAttendeeStatus } from '@/contexts/AttendeeStatusContext';

function CheckInContent() {
  const [attendee, setAttendee] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { updateAttendeeStatus, getAttendeeById } = useAttendeeStatus();

  const attendeeId = searchParams.get('attendee');
  const eventId = searchParams.get('event') || 'ride-the-next-wave-demo-night';
  const attendeeName = searchParams.get('name');

  useEffect(() => {
    if (attendeeId) {
      loadAttendeeProfile();
    } else {
      setError('No attendee ID provided');
      setLoading(false);
    }
  }, [attendeeId]);

  // Sync attendee data from global context
  useEffect(() => {
    if (attendeeId) {
      const profile = getAttendeeById(attendeeId);
      if (profile) {
        setAttendee(profile);
      }
    }
  }, [attendeeId, getAttendeeById]);

  const loadAttendeeProfile = async () => {
    try {
      // Try to get from global context first
      const profile = getAttendeeById(attendeeId || '');
      if (profile) {
        setAttendee(profile);
        setLoading(false);
        return;
      }

      // Fallback to API call
      const response = await fetch(`/api/attendees/status?eventId=${eventId}`);
      if (response.ok) {
        const data = await response.json();
        const foundProfile = data.profiles?.find((p: Profile) => p.id === attendeeId);

        if (foundProfile) {
          setAttendee(foundProfile);
        } else {
          setError('Attendee not found');
        }
      } else {
        setError('Failed to load attendee data');
      }
    } catch (error) {
      console.error('Error loading attendee:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!attendee) return;

    setChecking(true);
    setError(null);

    try {
      await updateAttendeeStatus(attendee.id, 'Present', eventId);
      setSuccess(true);

      // Update local attendee state
      const updatedAttendee = getAttendeeById(attendee.id);
      if (updatedAttendee) {
        setAttendee(updatedAttendee);
      }

      // Auto-redirect to overview after successful check-in
      setTimeout(() => {
        router.push(`/overview?event=${eventId}`);
      }, 2000);
    } catch (error) {
      console.error('Check-in error:', error);
      setError('Network error during check-in');
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading attendee information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Check-in Error</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <Link 
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
          >
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-green-400 text-3xl">✅</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to the Event!</h2>
          <p className="text-white/70 mb-6">
            You've been successfully checked in. Redirecting to overview...
          </p>
          <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
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
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              MeetGenius
            </span>
          </Link>
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <span className="text-white/80 text-sm font-medium">Event Check-in</span>
            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </nav>

      {/* Check-in Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Event Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 glass-card rounded-2xl">
              <Image
                src="/rtnw-logo.jpeg"
                alt="Ride The Next Wave"
                width={24}
                height={24}
                className="rounded-sm"
              />
              <span className="text-white/80 text-sm font-medium">
                Ride the Next Wave Demo Night
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Event Check-in
            </h1>
            <p className="text-white/70 text-lg">
              Welcome! Please confirm your attendance below.
            </p>
          </div>

          {/* Attendee Card */}
          {attendee && (
            <div className="glass-card p-8 rounded-3xl mb-8 text-center">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 p-1">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
                    <Image
                      src={getProfileImage(attendee.name)}
                      alt={attendee.name}
                      width={88}
                      height={88}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling!.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      {attendee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{attendee.name}</h2>
                <p className="text-blue-300 font-medium mb-1">{attendee.title}</p>
                <p className="text-white/60">{attendee.company}</p>
              </div>

              {/* Status */}
              <div className="mb-8">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  attendee.status === 'Present' 
                    ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                }`}>
                  {attendee.status === 'Present' ? '✅' : '⏳'} 
                  {attendee.status || 'Not Arrived'}
                </span>
              </div>

              {/* Check-in Button */}
              {attendee.status !== 'Present' && (
                <button
                  onClick={handleCheckIn}
                  disabled={checking}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {checking ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Checking In...</span>
                    </div>
                  ) : (
                    'Check In to Event'
                  )}
                </button>
              )}

              {attendee.status === 'Present' && (
                <div className="space-y-4">
                  <p className="text-green-300 font-medium">You're already checked in!</p>
                  <Link
                    href={`/overview?event=${eventId}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
                  >
                    View Overview →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Additional Actions */}
          <div className="text-center space-y-4">
            <Link
              href={`/attendees?event=${eventId}`}
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
            >
              ← View All Attendees
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading check-in page...</div>
      </div>
    }>
      <CheckInContent />
    </Suspense>
  );
}
