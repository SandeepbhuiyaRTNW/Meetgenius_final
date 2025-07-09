'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
}

const processingSteps: ProcessingStep[] = [
  {
    id: 'parsing',
    title: 'Parsing Attendee Profiles',
    description: 'Extracting structured data from resumes and LinkedIn profiles using advanced NLP',
    duration: 3000,
    completed: false
  },
  {
    id: 'analysis',
    title: 'Analyzing Professional Backgrounds',
    description: 'Understanding skills, experience levels, and career trajectories',
    duration: 2500,
    completed: false
  },
  {
    id: 'goals',
    title: 'Inferring Networking Goals',
    description: 'Determining what each attendee hopes to achieve from networking',
    duration: 2000,
    completed: false
  },
  {
    id: 'compatibility',
    title: 'Computing Compatibility Matrix',
    description: 'Running advanced algorithms to calculate multi-dimensional compatibility scores',
    duration: 3500,
    completed: false
  },
  {
    id: 'optimization',
    title: 'Optimizing Match Pairings',
    description: 'Finding the globally optimal matching configuration using constraint satisfaction',
    duration: 2800,
    completed: false
  },
  {
    id: 'insights',
    title: 'Generating Conversation Insights',
    description: 'Creating personalized icebreakers and discussion topics for each match',
    duration: 2200,
    completed: false
  },
  {
    id: 'validation',
    title: 'Validating Match Quality',
    description: 'Ensuring all matches meet our high-quality standards and confidence thresholds',
    duration: 1500,
    completed: false
  }
];

function ProcessingContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState(processingSteps);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('event');

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        // Mark current step as completed
        setSteps(prev => prev.map((step, index) => 
          index === currentStep ? { ...step, completed: true } : step
        ));
        
        // Move to next step
        setCurrentStep(prev => prev + 1);
        setProgress(((currentStep + 1) / steps.length) * 100);
      }, steps[currentStep].duration);

      return () => clearTimeout(timer);
    } else {
      // All steps completed, redirect to matches
      setTimeout(() => {
        router.push(`/matches?event=${eventId}`);
      }, 1000);
    }
  }, [currentStep, steps, router, eventId]);

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

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Navigation */}
      <nav className="border-b border-gray-800 py-4 px-6 fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 transform hover:scale-105 transition-transform duration-200">
            <Image
              src="/meetgenius-logo.png"
              alt="MeetGenius Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              MeetGenius
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">Processing</span>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </nav>

      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Header */}
          <div className="mb-12">
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-purple-400">AI Processing</span> in Progress
          </h1>
          <p className="text-base text-gray-300 mb-2">
            Analyzing attendees for <span className="text-white font-semibold">{getEventName(eventId)}</span>
          </p>
          <p className="text-gray-400 text-sm">
            Our advanced algorithms are creating perfect matches...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">Processing Progress</span>
            <span className="text-xs text-purple-400 font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Processing Steps */}
        <div className="space-y-6 mb-12">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-start gap-4 p-6 rounded-xl border transition-all duration-500 ${
                index === currentStep
                  ? 'bg-purple-900/20 border-purple-500'
                  : step.completed
                  ? 'bg-green-900/20 border-green-500'
                  : 'bg-gray-900/50 border-gray-700'
              }`}
            >
              {/* Step Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                step.completed
                  ? 'bg-green-500'
                  : index === currentStep
                  ? 'bg-purple-500'
                  : 'bg-gray-600'
              }`}>
                {step.completed ? (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : index === currentStep ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 text-left">
                <h3 className={`text-lg font-semibold mb-1 ${
                  step.completed
                    ? 'text-green-400'
                    : index === currentStep
                    ? 'text-purple-400'
                    : 'text-gray-400'
                }`}>
                  {step.title}
                </h3>
                <p className="text-gray-300 text-xs">
                  {step.description}
                </p>
                {index === currentStep && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-purple-400">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span>Processing...</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Algorithm Details */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-4">Advanced Matching Algorithm</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <h4 className="font-semibold text-purple-400 mb-2 text-sm">Multi-Factor Analysis</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• Professional skill overlap detection</li>
                <li>• Industry domain compatibility</li>
                <li>• Career level complementarity</li>
                <li>• Geographic proximity weighting</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2 text-sm">AI-Powered Insights</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• Natural language goal inference</li>
                <li>• Personality trait extraction</li>
                <li>• Conversation topic generation</li>
                <li>• Confidence scoring algorithms</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400">
          <p className="text-xs">
            This process typically takes 15-30 seconds depending on event size
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>}>
      <ProcessingContent />
    </Suspense>
  );
}
