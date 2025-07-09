import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Profile } from '@/types';

export async function GET() {
  try {
    // Always try to load real matches first from the data directory
    const realMatchesPath = path.join(process.cwd(), 'data', 'matches.json');
    const fallbackMatchesPath = path.join(process.cwd(), 'src', 'data', 'matches.json');
    const demoMatchesPath = path.join(process.cwd(), 'src', 'data', 'demo-matches.json');

    let matchesData: string;
    let isDemo = false;

    if (fs.existsSync(realMatchesPath)) {
      // Use real matches from data directory
      matchesData = fs.readFileSync(realMatchesPath, 'utf8');
    } else if (fs.existsSync(fallbackMatchesPath)) {
      // Use real matches from src/data directory
      matchesData = fs.readFileSync(fallbackMatchesPath, 'utf8');
    } else if (fs.existsSync(demoMatchesPath)) {
      // Fall back to demo data only if no real matches exist
      matchesData = fs.readFileSync(demoMatchesPath, 'utf8');
      isDemo = true;
    } else {
      return NextResponse.json(
        { error: 'No matches found. Please run the resume processing script first.' },
        { status: 404 }
      );
    }

    const matches = JSON.parse(matchesData);

    // Load current attendee status from parsed_profiles.json to ensure sync
    const dataDir = path.join(process.cwd(), 'data');
    const profilesPath = path.join(dataDir, 'parsed_profiles.json');

    if (fs.existsSync(profilesPath)) {
      const profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
      const profilesMap = new Map(profiles.map((p: any) => [p.id || p.name, p]));

      // Update matches with current attendee status
      matches.forEach((match: any) => {
        const attendeeProfile = profilesMap.get(match.attendeeProfile.id || match.attendeeProfile.name);
        const matchProfile = profilesMap.get(match.matchProfile.id || match.matchProfile.name);

        if (attendeeProfile) {
          match.attendeeProfile = { ...match.attendeeProfile, ...attendeeProfile };
        }
        if (matchProfile) {
          match.matchProfile = { ...match.matchProfile, ...matchProfile };
        }
      });
    }

    return NextResponse.json({
      matches,
      isDemo,
      message: isDemo ? 'Showing demo data. Run npm run enhance-matches to generate real matches.' : 'Real matches from Ride the Next Wave Demo Night loaded successfully.'
    });
  } catch (error) {
    console.error('Error loading matches:', error);
    return NextResponse.json(
      { error: 'Failed to load matches' },
      { status: 500 }
    );
  }
}
