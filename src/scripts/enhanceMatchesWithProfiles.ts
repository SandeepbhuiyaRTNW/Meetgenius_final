import fs from 'fs';
import path from 'path';
import { Profile, Match } from '@/types';

async function enhanceMatchesWithProfiles() {
  console.log('🔄 Enhancing matches with full profile data...');
  
  const dataDir = path.join(process.cwd(), 'data');
  const profilesPath = path.join(dataDir, 'parsed_profiles.json');
  const matchesPath = path.join(dataDir, 'matches.json');
  
  if (!fs.existsSync(profilesPath) || !fs.existsSync(matchesPath)) {
    console.error('❌ Required files not found');
    return;
  }

  const profiles: Profile[] = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
  const matches = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));
  
  // Create a map for quick profile lookup
  const profileMap = new Map<string, Profile>();
  profiles.forEach(profile => {
    profileMap.set(profile.name, profile);
  });
  
  // Enhance matches with full profile data
  const enhancedMatches: Match[] = matches.map((match: any) => {
    const attendeeProfile = profileMap.get(match.attendee);
    const matchProfile = profileMap.get(match.match);
    
    if (!attendeeProfile || !matchProfile) {
      console.warn(`⚠️ Missing profile for match: ${match.attendee} ↔ ${match.match}`);
      return null;
    }
    
    return {
      attendee: match.attendee,
      attendeeProfile,
      match: match.match,
      matchProfile,
      matchScore: match.matchScore,
      whatYouShare: match.whatYouShare,
      icebreakers: match.icebreakers,
      matchConfidence: match.matchConfidence,
      presenceStatus: match.presenceStatus
    };
  }).filter(Boolean);
  
  // Save enhanced matches
  fs.writeFileSync(matchesPath, JSON.stringify(enhancedMatches, null, 2));
  
  console.log(`✅ Enhanced ${enhancedMatches.length} matches with full profile data`);
  
  // Print summary
  console.log('\n📋 Enhanced Matches Summary:');
  enhancedMatches.forEach((match: Match) => {
    console.log(`   ${match.attendee} (${match.attendeeProfile.title}) ↔ ${match.match} (${match.matchProfile.title}) - ${Math.round(match.matchScore * 100)}%`);
  });
}

enhanceMatchesWithProfiles().catch(console.error);
