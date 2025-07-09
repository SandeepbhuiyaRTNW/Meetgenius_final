import fs from 'fs';
import path from 'path';

async function fixChristiMatch() {
  console.log('🔧 Adding match for Christi Kmecik...');
  
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
  
  // Find Christi and match her with Michael Hands
  const christiProfile = profileMap.get("Christi Kmecik");
  const michaelProfile = profileMap.get("Michael Hands");
  
  if (!christiProfile || !michaelProfile) {
    console.error('❌ Missing profiles');
    return;
  }
  
  // Remove any existing matches for Michael Hands first
  const filteredMatches = matches.filter((match: any) => 
    match.attendee !== "Michael Hands" && match.match !== "Michael Hands"
  );
  
  // Add new match
  const newMatch = {
    attendee: "Christi Kmecik",
    attendeeProfile: christiProfile,
    match: "Michael Hands",
    matchProfile: michaelProfile,
    matchScore: 0.85,
    whatYouShare: [
      "Leadership Development",
      "Professional Excellence",
      "Team Building",
      "Strategic Growth"
    ],
    icebreakers: [
      "What's your approach to developing high-performing teams?",
      "How do you foster leadership growth in your organization?",
      "What strategies have been most effective for professional development?"
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
  
  console.log(`✅ Added match: Christi Kmecik ↔ Michael Hands - 85%`);
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
  } else {
    const uncovered = profiles.filter((p: any) => !coveredAttendees.has(p.name));
    console.log('❌ Still uncovered:', uncovered.map((p: any) => p.name));
  }
}

fixChristiMatch().catch(console.error);
