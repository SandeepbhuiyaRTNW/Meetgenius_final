'use client';

import React, { useState, useEffect } from 'react';
import { Profile, ConversationSuggestion } from '@/types';

interface AIConversationCoachProps {
  profile1: Profile;
  profile2: Profile;
  isActive?: boolean;
}

export default function AIConversationCoach({ profile1, profile2, isActive = false }: AIConversationCoachProps) {
  const [suggestions, setSuggestions] = useState<ConversationSuggestion[]>([]);
  const [currentSuggestion, setCurrentSuggestion] = useState<ConversationSuggestion | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [conversationPhase, setConversationPhase] = useState<'opening' | 'mid-conversation' | 'relationship-building' | 'closing'>('opening');

  useEffect(() => {
    if (isActive) {
      loadConversationSuggestions();
    }
  }, [isActive, conversationPhase]);

  const loadConversationSuggestions = async () => {
    // Simulate AI conversation analysis
    const mockSuggestions: ConversationSuggestion[] = [
      {
        type: 'icebreaker',
        suggestion: `Ask ${profile2.name} about their experience with ${profile2.skills[0]} at ${profile2.company}`,
        reasoning: "Both have technical backgrounds and can share insights",
        confidence: 0.92,
        timing: 'opening'
      },
      {
        type: 'follow-up',
        suggestion: "Share your perspective on AI trends in the industry",
        reasoning: "Creates mutual value exchange on shared interests",
        confidence: 0.88,
        timing: 'mid-conversation'
      },
      {
        type: 'connection',
        suggestion: `Mention your mutual interest in ${profile1.interests.find(i => profile2.interests.includes(i)) || 'innovation'}`,
        reasoning: "Builds personal connection beyond professional topics",
        confidence: 0.85,
        timing: 'relationship-building'
      }
    ];

    const phaseSuggestions = mockSuggestions.filter(s => s.timing === conversationPhase);
    setSuggestions(phaseSuggestions);
    
    if (phaseSuggestions.length > 0) {
      setCurrentSuggestion(phaseSuggestions[0]);
    }
  };

  const nextPhase = () => {
    const phases: Array<'opening' | 'mid-conversation' | 'relationship-building' | 'closing'> = 
      ['opening', 'mid-conversation', 'relationship-building', 'closing'];
    const currentIndex = phases.indexOf(conversationPhase);
    if (currentIndex < phases.length - 1) {
      setConversationPhase(phases[currentIndex + 1]);
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'opening': return '👋';
      case 'mid-conversation': return '💬';
      case 'relationship-building': return '🤝';
      case 'closing': return '📝';
      default: return '💡';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400';
    if (confidence >= 0.8) return 'text-yellow-400';
    return 'text-orange-400';
  };

  if (!isActive) {
    return (
      <div className="glass-card p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/60">AI Conversation Coach</h3>
            <p className="text-xs text-white/40">Start conversation to activate</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-xl border border-purple-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI Conversation Coach</h3>
            <p className="text-xs text-white/60">Real-time guidance</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsListening(!isListening)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
            isListening 
              ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
              : 'bg-green-500/20 text-green-300 border border-green-500/30'
          }`}
        >
          {isListening ? '🔴 Listening' : '🎤 Start'}
        </button>
      </div>

      {/* Conversation Phase Indicator */}
      <div className="flex gap-2 mb-4 p-2 bg-white/5 rounded-lg">
        {['opening', 'mid-conversation', 'relationship-building', 'closing'].map((phase) => (
          <div
            key={phase}
            className={`flex-1 text-center py-1 px-2 rounded text-xs transition-all duration-200 ${
              conversationPhase === phase
                ? 'bg-purple-500/30 text-purple-200'
                : 'text-white/40'
            }`}
          >
            <div>{getPhaseIcon(phase)}</div>
            <div className="capitalize text-xs mt-1">{phase.replace('-', ' ')}</div>
          </div>
        ))}
      </div>

      {/* Current Suggestion */}
      {currentSuggestion && (
        <div className="mb-4 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-purple-300 uppercase tracking-wide">
              {currentSuggestion.type}
            </span>
            <span className={`text-xs font-medium ${getConfidenceColor(currentSuggestion.confidence)}`}>
              {Math.round(currentSuggestion.confidence * 100)}% confidence
            </span>
          </div>
          
          <p className="text-sm text-white/90 mb-2 font-medium">
            💡 {currentSuggestion.suggestion}
          </p>
          
          <p className="text-xs text-white/60 mb-3">
            {currentSuggestion.reasoning}
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                // Mark as used and get next suggestion
                const nextSuggestionIndex = suggestions.findIndex(s => s === currentSuggestion) + 1;
                if (nextSuggestionIndex < suggestions.length) {
                  setCurrentSuggestion(suggestions[nextSuggestionIndex]);
                } else {
                  nextPhase();
                }
              }}
              className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs hover:bg-green-500/30 transition-colors"
            >
              ✓ Used
            </button>
            <button
              onClick={() => {
                const nextSuggestionIndex = suggestions.findIndex(s => s === currentSuggestion) + 1;
                if (nextSuggestionIndex < suggestions.length) {
                  setCurrentSuggestion(suggestions[nextSuggestionIndex]);
                }
              }}
              className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-xs hover:bg-white/20 transition-colors"
            >
              → Next
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wide">Quick Actions</h4>
        
        <div className="grid grid-cols-2 gap-2">
          <button className="p-2 bg-white/5 rounded-lg text-xs text-white/70 hover:bg-white/10 transition-colors">
            🎯 Get Topic Ideas
          </button>
          <button className="p-2 bg-white/5 rounded-lg text-xs text-white/70 hover:bg-white/10 transition-colors">
            🤝 Transition Help
          </button>
          <button className="p-2 bg-white/5 rounded-lg text-xs text-white/70 hover:bg-white/10 transition-colors">
            📝 Follow-up Plan
          </button>
          <button className="p-2 bg-white/5 rounded-lg text-xs text-white/70 hover:bg-white/10 transition-colors">
            ⚡ Emergency Exit
          </button>
        </div>
      </div>

      {/* Real-time Feedback */}
      {isListening && (
        <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-blue-300">Analyzing conversation...</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-white/60">Energy Level</span>
              <span className="text-green-400">High ✓</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/60">Engagement</span>
              <span className="text-green-400">Excellent ✓</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/60">Topic Relevance</span>
              <span className="text-yellow-400">Good</span>
            </div>
          </div>
        </div>
      )}

      {/* Success Metrics */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex justify-between items-center">
          <span className="text-xs text-white/60">Conversation Success</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1 bg-white/10 rounded-full">
              <div className="w-3/4 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
            </div>
            <span className="text-xs text-white/80">75%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
