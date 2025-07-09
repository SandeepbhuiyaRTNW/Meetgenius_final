'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  icon: string;
}

const processingSteps: ProcessingStep[] = [
  {
    id: 'analyzing',
    title: 'Analyzing profiles...',
    description: '',
    duration: 1500,
    icon: 'document'
  },
  {
    id: 'similarity',
    title: 'Finding matches...',
    description: '',
    duration: 1500,
    icon: 'chart'
  },
  {
    id: 'conversations',
    title: 'Generating recommendations...',
    description: '',
    duration: 1500,
    icon: 'chat'
  },
  {
    id: 'finalizing',
    title: 'Finalizing results...',
    description: '',
    duration: 1500,
    icon: 'check'
  }
];

function LoadingContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = searchParams.get('event') || 'ride-the-next-wave-demo-night';

  useEffect(() => {
    let stepTimer: NodeJS.Timeout;

    const startStep = (stepIndex: number) => {
      if (stepIndex >= processingSteps.length) {
        setIsComplete(true);
        setTimeout(() => {
          try {
            router.push(`/overview?event=${eventId}`);
          } catch (error) {
            console.log('Router push failed, using window.location');
            window.location.href = `/overview?event=${eventId}`;
          }
        }, 1000);
        return;
      }

      setCurrentStep(stepIndex);
      const step = processingSteps[stepIndex];

      stepTimer = setTimeout(() => {
        startStep(stepIndex + 1);
      }, step.duration);
    };

    startStep(0);

    return () => {
      clearTimeout(stepTimer);
    };
  }, [router, eventId]);

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
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></div>
            <span className="text-white/80 text-xs font-medium">Processing</span>
          </div>
        </div>
      </nav>

      {/* Premium Main Content */}
      <div className="flex items-center justify-center min-h-screen pt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-blue-900/10"></div>
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">

          {/* Premium Header */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-4 mb-8 px-8 py-4 glass-card rounded-2xl animate-fade-in-up">
              <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></div>
              <span className="text-white/80 text-sm font-medium tracking-wide uppercase">
                AI Processing
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up animation-delay-200">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Analyzing Profiles
              </span>
            </h1>
            <p className="text-white/70 text-base max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
              Our advanced AI is processing attendee profiles to generate intelligent networking matches
            </p>
          </div>

          {/* Premium Processing Display */}
          {!isComplete && (
            <div className="text-center">
              <div className="glass-card glass-card-hover p-12 rounded-3xl mb-8 animate-fade-in-up animation-delay-600">
                <div className="flex items-center justify-center gap-6 mb-8">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-400/20 border-t-purple-400 shadow-lg shadow-purple-400/25"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-purple-400/40"></div>
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold text-lg mb-1">
                      {processingSteps[currentStep]?.title || 'Processing...'}
                    </div>
                    <div className="text-white/60 text-sm">
                      Step {currentStep + 1} of {processingSteps.length}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500 shadow-lg shadow-purple-500/25"
                    style={{ width: `${((currentStep + 1) / processingSteps.length) * 100}%` }}
                  ></div>
                </div>

                <div className="text-white/50 text-xs">
                  {Math.round(((currentStep + 1) / processingSteps.length) * 100)}% Complete
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoadingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>}>
      <LoadingContent />
    </Suspense>
  );
}
