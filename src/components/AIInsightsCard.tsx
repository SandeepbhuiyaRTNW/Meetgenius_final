'use client';

import React, { useState, useEffect } from 'react';
import { Profile, PersonalityInsights, ConversationSuggestion, NetworkingStrategy } from '@/types';

interface AIInsightsCardProps {
  profile1: Profile;
  profile2: Profile;
  matchScore: number;
}

export default function AIInsightsCard({ profile1, profile2, matchScore }: AIInsightsCardProps) {
  const [insights, setInsights] = useState<{
    personalityInsights?: PersonalityInsights;
    conversationSuggestions?: ConversationSuggestion[];
    networkingStrategy?: NetworkingStrategy;
    successPrediction?: number;
    smartIcebreakers?: string[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'personality' | 'conversation' | 'strategy' | 'prediction'>('personality');

  useEffect(() => {
    loadAIInsights();
  }, [profile1, profile2]);

  const loadAIInsights = async () => {
    try {
      setLoading(true);
      
      // Simulate AI processing (in real implementation, call OpenAI agents)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI insights for demo
      setInsights({
        personalityInsights: {
          bigFiveTraits: {
            openness: 0.8,
            conscientiousness: 0.7,
            extraversion: 0.6,
            agreeableness: 0.9,
            neuroticism: 0.2
          },
          communicationStyle: {
            primary: "Analytical",
            secondary: "Collaborative",
            preferredChannels: ["Video calls", "In-person", "Email"],
            responseSpeed: "Thoughtful",
            formalityLevel: "Professional-casual"
          },
          workingStyle: {
            decisionMaking: "Data-driven",
            problemSolving: "Systematic",
            teamRole: "Facilitator",
            leadershipStyle: "Servant leader",
            conflictResolution: "Diplomatic"
          },
          networkingPersonality: {
            approachStyle: "Warm and professional",
            energyLevel: "Steady and engaging",
            conversationPreference: "Deep and meaningful",
            followUpStyle: "Consistent and thoughtful",
            relationshipBuilding: "Long-term focused"
          },
          compatibilityFactors: {
            idealPartnerTraits: ["Innovative", "Collaborative", "Growth-minded"],
            conversationTriggers: ["AI trends", "Startup insights", "Tech innovation"],
            potentialChallenges: ["Time management", "Technical depth"],
            strengthAreas: ["Strategic thinking", "Team collaboration"]
          }
        },
        conversationSuggestions: [
          {
            type: 'icebreaker',
            suggestion: `Ask ${profile2.name} about their experience with AI in ${profile2.company}`,
            reasoning: "Both have AI/tech backgrounds and can share insights",
            confidence: 0.9,
            timing: 'opening'
          },
          {
            type: 'follow-up',
            suggestion: "Share your perspective on the future of AI in enterprise",
            reasoning: "Creates mutual value exchange on shared interests",
            confidence: 0.85,
            timing: 'mid-conversation'
          }
        ],
        successPrediction: 0.87,
        smartIcebreakers: [
          `I noticed you work at ${profile2.company} - how are you finding the AI landscape there?`,
          `Your background in ${profile2.skills[0]} is fascinating - I'd love to hear your thoughts on where it's heading`,
          `I see we both have experience with ${profile1.skills.find(s => profile2.skills.includes(s)) || 'technology'} - what's been your biggest learning recently?`
        ]
      });
    } catch (error) {
      console.error('Error loading AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">AI Analyzing Match...</h3>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-white/10 rounded animate-pulse"></div>
          <div className="h-4 bg-white/10 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-white/10 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">AI Match Insights</h3>
          <p className="text-sm text-white/60">Deep compatibility analysis</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl">
        {[
          { id: 'personality', label: 'Personality', icon: '🧠' },
          { id: 'conversation', label: 'Conversation', icon: '💬' },
          { id: 'strategy', label: 'Strategy', icon: '🎯' },
          { id: 'prediction', label: 'Success', icon: '🔮' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'personality' && insights.personalityInsights && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-white/80 mb-2">Communication Style</h4>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                  {insights.personalityInsights.communicationStyle.primary}
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                  {insights.personalityInsights.communicationStyle.secondary}
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white/80 mb-2">Compatibility Factors</h4>
              <div className="space-y-2">
                {insights.personalityInsights.compatibilityFactors.idealPartnerTraits.map((trait, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-white/70">{trait}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'conversation' && insights.conversationSuggestions && (
          <div className="space-y-4">
            {insights.conversationSuggestions.map((suggestion, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-purple-300 uppercase tracking-wide">
                    {suggestion.type}
                  </span>
                  <span className="text-xs text-white/60">
                    {Math.round(suggestion.confidence * 100)}% confidence
                  </span>
                </div>
                <p className="text-sm text-white/80 mb-2">{suggestion.suggestion}</p>
                <p className="text-xs text-white/50">{suggestion.reasoning}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-white/80 mb-2">Recommended Approach</h4>
              <p className="text-sm text-white/70">
                Start with technical discussion, then explore collaboration opportunities. 
                Both profiles show high innovation potential and complementary skills.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white/80 mb-2">Follow-up Strategy</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-white/70">Connect on LinkedIn within 24 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-white/70">Schedule follow-up coffee meeting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-white/70">Share relevant industry articles</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prediction' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {Math.round((insights.successPrediction || 0) * 100)}%
              </div>
              <p className="text-sm text-white/60">Success Probability</p>
            </div>
            
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(insights.successPrediction || 0) * 100}%` }}
              ></div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white/80 mb-2">Success Factors</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-white/70">Strong professional alignment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-white/70">Complementary skill sets</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-white/70">Similar communication styles</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Smart Icebreakers */}
      {insights.smartIcebreakers && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <h4 className="text-sm font-semibold text-white/80 mb-3">🎯 AI-Generated Icebreakers</h4>
          <div className="space-y-2">
            {insights.smartIcebreakers.slice(0, 2).map((icebreaker, index) => (
              <div key={index} className="p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                <p className="text-sm text-white/80">"{icebreaker}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
