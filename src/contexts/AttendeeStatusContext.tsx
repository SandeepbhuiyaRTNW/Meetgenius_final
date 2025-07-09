'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile } from '@/types';

interface AttendeeStatusContextType {
  attendees: Profile[];
  updateAttendeeStatus: (profileId: string, newStatus: 'Present' | 'Not Arrived' | 'Checked Out', eventId?: string) => Promise<void>;
  refreshAttendees: () => Promise<void>;
  getAttendeeById: (profileId: string) => Profile | undefined;
  isLoading: boolean;
}

const AttendeeStatusContext = createContext<AttendeeStatusContextType | undefined>(undefined);

interface AttendeeStatusProviderProps {
  children: ReactNode;
}

export function AttendeeStatusProvider({ children }: AttendeeStatusProviderProps) {
  const [attendees, setAttendees] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAttendees = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/attendees/status');
      if (response.ok) {
        const data = await response.json();
        setAttendees(data.profiles || []);
      }
    } catch (error) {
      console.error('Error loading attendees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAttendeeStatus = async (
    profileId: string, 
    newStatus: 'Present' | 'Not Arrived' | 'Checked Out',
    eventId?: string
  ) => {
    try {
      const response = await fetch('/api/attendees/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId,
          status: newStatus,
          eventId: eventId || 'ride-the-next-wave-demo-night'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update local state immediately
        setAttendees(prev => prev.map(attendee => 
          attendee.id === profileId ? result.profile : attendee
        ));

        // Broadcast the change to other tabs/windows and components
        window.dispatchEvent(new CustomEvent('attendeeStatusChanged', {
          detail: { profileId, newStatus, profile: result.profile }
        }));

        // Also trigger a matches refresh event
        window.dispatchEvent(new CustomEvent('refreshMatches', {
          detail: { profileId, newStatus, profile: result.profile }
        }));
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating attendee status:', error);
      throw error;
    }
  };

  const refreshAttendees = async () => {
    await loadAttendees();
  };

  const getAttendeeById = (profileId: string): Profile | undefined => {
    return attendees.find(attendee => attendee.id === profileId);
  };

  // Listen for status changes from other tabs/windows
  useEffect(() => {
    const handleStatusChange = (event: CustomEvent) => {
      const { profileId, profile } = event.detail;
      setAttendees(prev => prev.map(attendee => 
        attendee.id === profileId ? profile : attendee
      ));
    };

    window.addEventListener('attendeeStatusChanged', handleStatusChange as EventListener);
    
    return () => {
      window.removeEventListener('attendeeStatusChanged', handleStatusChange as EventListener);
    };
  }, []);

  // Load attendees on mount
  useEffect(() => {
    loadAttendees();
  }, []);

  const value: AttendeeStatusContextType = {
    attendees,
    updateAttendeeStatus,
    refreshAttendees,
    getAttendeeById,
    isLoading
  };

  return (
    <AttendeeStatusContext.Provider value={value}>
      {children}
    </AttendeeStatusContext.Provider>
  );
}

export function useAttendeeStatus() {
  const context = useContext(AttendeeStatusContext);
  if (context === undefined) {
    throw new Error('useAttendeeStatus must be used within an AttendeeStatusProvider');
  }
  return context;
}
