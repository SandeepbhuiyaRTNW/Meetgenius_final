import React, { useState } from 'react';
import Image from 'next/image';
import { Match } from '@/types';
import { getProfileImage, getInitials } from '@/utils/imageMapper';

interface MatchCardProps {
  match: Match;
  onRematch?: (attendeeName: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onRematch }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPresenceColor = (status: string) => {
    switch (status) {
      case 'Present': return 'text-green-400';
      case 'Just Arrived': return 'text-blue-400';
      case 'Arriving Soon': return 'text-yellow-400';
      case 'Not Yet Arrived': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getPresenceIcon = (status: string) => {
    switch (status) {
      case 'Present': return '🟢';
      case 'Just Arrived': return '🔵';
      case 'Arriving Soon': return '🟡';
      case 'Not Yet Arrived': return '⚪';
      default: return '⚪';
    }
  };

  return (
    <div className="glass-card glass-card-hover p-8 rounded-2xl group relative overflow-hidden">
      {/* Premium Match Score Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {Math.round(match.matchScore * 100)}%
          </div>
          <div className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-lg ${getConfidenceColor(match.matchConfidence)}`}>
            {match.matchConfidence} Match
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-white/60 hover:text-white transition-all duration-200 p-2 rounded-lg hover:bg-white/10"
        >
          <svg className={`w-5 h-5 transform transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Premium Attendee Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Attendee */}
        <div className="glass-card p-6 rounded-xl group-hover:bg-white/8 transition-all duration-300">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0">
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
                    parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold text-lg">${getInitials(match.attendee)}</div>`;
                  }
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white truncate">{match.attendee}</h3>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${getPresenceColor(match.presenceStatus.attendee)} bg-white/10 flex-shrink-0 ml-2`}>
                  {getPresenceIcon(match.presenceStatus.attendee)} {match.presenceStatus.attendee}
                </span>
              </div>
              <p className="text-sm text-white/80 mb-1 font-medium">{match.attendeeProfile.title}</p>
              <p className="text-sm text-white/60">{match.attendeeProfile.company}</p>
              <p className="text-xs text-white/50 mt-1">{match.attendeeProfile.location}</p>
            </div>
          </div>
        </div>

        {/* Match */}
        <div className="glass-card p-6 rounded-xl group-hover:bg-white/8 transition-all duration-300">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-green-500 flex-shrink-0">
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
                    parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold text-lg">${getInitials(match.match)}</div>`;
                  }
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white truncate">{match.match}</h3>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${getPresenceColor(match.presenceStatus.match)} bg-white/10 flex-shrink-0 ml-2`}>
                  {getPresenceIcon(match.presenceStatus.match)} {match.presenceStatus.match}
                </span>
              </div>
              <p className="text-sm text-white/80 mb-1 font-medium">{match.matchProfile.title}</p>
              <p className="text-sm text-white/60">{match.matchProfile.company}</p>
              <p className="text-xs text-white/50 mt-1">{match.matchProfile.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Shared Factors */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Why This Match Works
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {match.whatYouShare.slice(0, 4).map((item, index) => (
            <div
              key={index}
              className="glass-card p-3 rounded-xl text-center group hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-yellow-300 text-xs font-medium block">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Business Value Preview */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          Mutual Benefits
        </h4>
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-white/80 text-xs">Knowledge exchange in {match.whatYouShare[0]?.toLowerCase()}</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-white/80 text-xs">Potential collaboration opportunities</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-white/80 text-xs">Professional network expansion</p>
          </div>
        </div>
      </div>

      {/* Quick Conversation Starter */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          Conversation Starter
        </h4>
        <div className="glass-card p-4 rounded-xl border-l-4 border-blue-400">
          <p className="text-white/90 text-sm leading-relaxed">
            "{match.icebreakers[0] || `I noticed we both have experience with ${match.whatYouShare[0]?.toLowerCase()}. I'd love to hear your perspective on it.`}"
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-blue-300 text-xs bg-blue-500/20 px-2 py-1 rounded-full">Professional opener</span>
          </div>
        </div>
      </div>

      {/* Enhanced Expanded Details */}
      {showDetails && (
        <div className="border-t border-white/10 pt-6 mt-6 space-y-6">
          {/* Skills Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{match.attendee.split(' ').map(n => n[0]).join('')}</span>
                </div>
                {match.attendee}'s Expertise
              </h5>
              <div className="flex flex-wrap gap-2">
                {match.attendeeProfile.skills.slice(0, 5).map((skill, index) => (
                  <span key={index} className="px-3 py-1 glass-card text-purple-300 rounded-lg text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{match.match.split(' ').map(n => n[0]).join('')}</span>
                </div>
                {match.match}'s Expertise
              </h5>
              <div className="flex flex-wrap gap-2">
                {match.matchProfile.skills.slice(0, 5).map((skill, index) => (
                  <span key={index} className="px-3 py-1 glass-card text-blue-300 rounded-lg text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Conversation Starters */}
          <div>
            <h5 className="font-semibold text-white mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              More Conversation Options
            </h5>
            <div className="space-y-3">
              {match.icebreakers.slice(1, 3).map((icebreaker, index) => (
                <div key={index} className="glass-card p-3 rounded-xl">
                  <p className="text-white/90 text-xs leading-relaxed">"{icebreaker}"</p>
                  <div className="mt-2">
                    <span className="text-blue-300 text-xs bg-blue-500/20 px-2 py-1 rounded-full">
                      {index === 0 ? 'Follow-up question' : 'Collaboration opener'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Match Insights */}
          <div>
            <h5 className="font-semibold text-white mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Strategic Insights
            </h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-3 rounded-xl text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                  {Math.round(match.matchScore * 100)}%
                </div>
                <div className="text-white/60 text-xs">Compatibility</div>
              </div>
              <div className="glass-card p-3 rounded-xl text-center">
                <div className={`text-2xl font-bold mb-1 ${
                  match.matchConfidence === 'High' ? 'text-green-400' :
                  match.matchConfidence === 'Medium' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {match.matchConfidence}
                </div>
                <div className="text-white/60 text-xs">Confidence</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onRematch?.(match.attendee)}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-xs font-medium transition-colors"
        >
          🔄 Rematch
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-xs font-medium transition-colors">
          📱 QR Profile
        </button>
      </div>
    </div>
  );
};
