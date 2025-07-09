'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Profile } from '@/types';
import { getProfileImage, getInitials } from '@/utils/imageMapper';
import StatusChip from './StatusChip';

interface AttendeeCardProps {
  profile: Profile;
  onStatusUpdate?: (profileId: string, newStatus: 'Present' | 'Not Arrived' | 'Checked Out') => Promise<void>;
  showCheckInButton?: boolean;
  compact?: boolean;
}

export default function AttendeeCard({ 
  profile, 
  onStatusUpdate, 
  showCheckInButton = true,
  compact = false 
}: AttendeeCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: 'Present' | 'Not Arrived' | 'Checked Out') => {
    if (!onStatusUpdate) return;

    setIsUpdating(true);
    try {
      await onStatusUpdate(profile.id, newStatus);
      setLastUpdated(new Date().toLocaleTimeString());
      
      // Show success feedback
      if (newStatus === 'Present') {
        // Could add a toast notification here
        console.log(`${profile.name} checked in successfully`);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      // Could add error toast notification here
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStatus = profile.status || 'Not Arrived';

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/8 transition-all duration-300">
        <div className="flex flex-col items-center relative">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0">
            <Image
              src={getProfileImage(profile.name)}
              alt={profile.name}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<div class=\"w-full h-full flex items-center justify-center text-white font-bold text-sm\">${getInitials(profile.name)}</div>`;
                }
              }}
            />
          </div>
          <div className="mt-1">
            <StatusChip
              status={currentStatus}
              onStatusChange={onStatusUpdate ? handleStatusChange : undefined}
              isLoading={isUpdating}
              size="sm"
              showIcon={true}
              interactive={onStatusUpdate !== undefined}
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm truncate">{profile.name}</h3>
          <p className="text-white/70 text-xs truncate">{profile.title}</p>
          <p className="text-white/50 text-xs truncate">{profile.company}</p>
        </div>

        {lastUpdated && (
          <div className="text-xs text-green-400 opacity-75">
            Updated {lastUpdated}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-all duration-300 group">
      <div className="flex items-start gap-4">
        {/* Profile Image with Status below */}
        <div className="flex flex-col items-center relative">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0 shadow-lg">
            <Image
              src={getProfileImage(profile.name)}
              alt={profile.name}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold text-lg">${getInitials(profile.name)}</div>`;
                }
              }}
            />
          </div>
          
          <div className="mt-2">
            <StatusChip
              status={currentStatus}
              onStatusChange={onStatusUpdate ? handleStatusChange : undefined}
              isLoading={isUpdating}
              size="md"
              showIcon={true}
              interactive={onStatusUpdate !== undefined}
            />
          </div>
        </div>

        {/* Profile Information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{profile.name}</h3>
              <p className="text-white/80 text-sm font-medium mb-1">{profile.title}</p>
              <p className="text-white/60 text-sm">{profile.company}</p>
              <p className="text-white/50 text-xs mt-1">{profile.location}</p>
            </div>
          </div>

          {/* Skills Preview */}
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-medium border border-purple-400/30"
              >
                {skill}
              </span>
            ))}
            {profile.skills.length > 3 && (
              <span className="px-2 py-1 bg-white/10 text-white/60 rounded-lg text-xs">
                +{profile.skills.length - 3} more
              </span>
            )}
          </div>

          {/* Check-in Information */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-white/60">
              {profile.checkedInAt && (
                <span>Checked in: {new Date(profile.checkedInAt).toLocaleTimeString()}</span>
              )}
              {lastUpdated && (
                <span className="text-green-400 ml-2">Updated {lastUpdated}</span>
              )}
            </div>

            {/* Quick Check-in Button */}
            {showCheckInButton && currentStatus !== 'Present' && onStatusUpdate && (
              <button
                onClick={() => handleStatusChange('Present')}
                disabled={isUpdating}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-black"
              >
                {isUpdating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    <span>Checking in...</span>
                  </div>
                ) : (
                  'Quick Check-in'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}