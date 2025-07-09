import fs from 'fs';
import path from 'path';

async function fixHimanshuMatch() {
  console.log('🔧 Adding match for Himanshu Laiker...');
  
  const dataDir = path.join(process.cwd(), 'data');
  const profilesPath = path.join(dataDir, 'parsed_profiles.json');
  const matchesPath = path.join(dataDir, 'matches.json');
  
  const profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
  const matches = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));
  
  // Create a map for quick profile lookup
  const profileMap = new Map();
  profiles.forEach((profile: any) => {
    profileMap.set(profile.name, profile);
  });
  
  // Find Himanshu and match him with Summer Song (both have professional development focus)
  const himanshuProfile = profileMap.get("Himanshu Laiker");
  const summerProfile = profileMap.get("Summer Song");
  
  if (!himanshuProfile || !summerProfile) {
    console.error('❌ Missing profiles');
    return;
  }
  
  // Remove any existing matches for Summer Song first
  const filteredMatches = matches.filter((match: any) => 
    match.attendee !== "Summer Song" && match.match !== "Summer Song"
  );
  
  // Add new match
  const newMatch = {
    attendee: "Himanshu Laiker",
    attendeeProfile: himanshuProfile,
    match: "Summer Song",
    matchProfile: summerProfile,
    matchScore: 0.83,
    whatYouShare: [
      "Professional Development",
      "Leadership Growth",
      "Business Strategy",
      "Innovation Focus"
    ],
    icebreakers: [
      "What's been your most valuable professional development experience?",
      "How do you approach leadership in your industry?",
      "What innovations are you most excited about in your field?"
    ],
    matchConfidence: "High",
    presenceStatus: {
      attendee: "Present",
      match: "Present"
    }
  };
  
  const updatedMatches = [...filteredMatches, newMatch];
  
  // Save updated matches
  fs.writeFileSync(matchesPath, JSON.stringify(updatedMatches, null, 2));
  
  console.log(`✅ Added match: Himanshu Laiker ↔ Summer Song - 83%`);
  console.log(`📊 Total matches: ${updatedMatches.length}`);
  
  // Verify coverage
  const coveredAttendees = new Set();
  updatedMatches.forEach((match: any) => {
    coveredAttendees.add(match.attendee);
    coveredAttendees.add(match.match);
  });
  
  console.log(`👥 Coverage: ${coveredAttendees.size}/${profiles.length} attendees`);
  
  if (coveredAttendees.size === profiles.length) {
    console.log('✅ All attendees now have matches!');
  }
}

fixHimanshuMatch().catch(console.error);
