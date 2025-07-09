export interface Profile {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  skills: string[];
  certifications: string[];
  experience: string[];
  interests: string[];
  goal: string;
  email?: string;
  linkedin?: string;
  image?: string;
  status?: 'Present' | 'Not Arrived' | 'Checked Out';
  checkedInAt?: string;
  lastUpdated?: string;
}

export interface Match {
  attendee: string;
  attendeeProfile: Profile;
  match: string;
  matchProfile: Profile;
  matchScore: number;
  whatYouShare: string[];
  icebreakers: string[];
  matchConfidence: 'Low' | 'Medium' | 'High';
  presenceStatus: {
    attendee: 'Present' | 'Just Arrived' | 'Arriving Soon' | 'Not Yet Arrived';
    match: 'Present' | 'Just Arrived' | 'Arriving Soon' | 'Not Yet Arrived';
  };
}

export interface CheckInResponse {
  success: boolean;
  profile: Profile;
  message: string;
  timestamp: string;
}

export interface StatusUpdateRequest {
  profileId: string;
  status: 'Present' | 'Not Arrived' | 'Checked Out';
  eventId?: string;
}

export interface MatchingFactors {
  domainOverlap: number;
  roleComplementarity: number;
  skillsAlignment: number;
  goalCompatibility: number;
  locationBonus: number;
  certificationOverlap: number;
  experienceRelevance: number;
}

export interface EventInfo {
  title: string;
  date: string;
  time: string;
  location: string;
  rsvpCount: number;
  description: string;
}