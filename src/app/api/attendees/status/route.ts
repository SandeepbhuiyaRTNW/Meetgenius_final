import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Profile, CheckInResponse, StatusUpdateRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: StatusUpdateRequest = await request.json();
    const { profileId, status, eventId } = body;

    if (!profileId || !status) {
      return NextResponse.json(
        { error: 'Profile ID and status are required' },
        { status: 400 }
      );
    }

    // Load current profiles
    const dataDir = path.join(process.cwd(), 'data');
    const profilesPath = path.join(dataDir, 'parsed_profiles.json');
    
    if (!fs.existsSync(profilesPath)) {
      return NextResponse.json(
        { error: 'Profiles data not found' },
        { status: 404 }
      );
    }

    const profiles: Profile[] = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
    
    // Find and update the profile
    const profileIndex = profiles.findIndex(p => p.id === profileId);
    if (profileIndex === -1) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    const updatedProfile = {
      ...profiles[profileIndex],
      status,
      lastUpdated: new Date().toISOString(),
      ...(status === 'Present' && { checkedInAt: new Date().toISOString() })
    };

    profiles[profileIndex] = updatedProfile;

    // Save updated profiles
    fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2));

    // Also update matches if they exist
    const matchesPath = path.join(dataDir, 'matches.json');
    if (fs.existsSync(matchesPath)) {
      const matches = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));
      
      // Update profile references in matches
      matches.forEach((match: any) => {
        if (match.attendeeProfile.id === profileId) {
          match.attendeeProfile = updatedProfile;
        }
        if (match.matchProfile.id === profileId) {
          match.matchProfile = updatedProfile;
        }
      });

      fs.writeFileSync(matchesPath, JSON.stringify(matches, null, 2));
    }

    const response: CheckInResponse = {
      success: true,
      profile: updatedProfile,
      message: `Status updated to ${status} successfully`,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error updating attendee status:', error);
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    // Load current profiles
    const dataDir = path.join(process.cwd(), 'data');
    const profilesPath = path.join(dataDir, 'parsed_profiles.json');
    
    if (!fs.existsSync(profilesPath)) {
      return NextResponse.json(
        { error: 'Profiles data not found' },
        { status: 404 }
      );
    }

    const profiles: Profile[] = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
    
    // Add default status if not present
    const profilesWithStatus = profiles.map(profile => ({
      ...profile,
      status: profile.status || 'Not Arrived' as const,
      lastUpdated: profile.lastUpdated || new Date().toISOString()
    }));

    // Calculate status summary
    const statusSummary = profilesWithStatus.reduce((acc, profile) => {
      const status = profile.status || 'Not Arrived';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      profiles: profilesWithStatus,
      summary: statusSummary,
      total: profilesWithStatus.length,
      eventId
    });

  } catch (error) {
    console.error('Error fetching attendee status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendee status' },
      { status: 500 }
    );
  }
}