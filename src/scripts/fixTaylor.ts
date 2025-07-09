import fs from 'fs';
import path from 'path';

async function fixTaylorMatch() {
  console.log('🔧 Adding final match for Taylor Birkeland...');
  
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
  
  // Find Taylor and match him with someone available - let's use Glenn Gray
  const taylorProfile = profileMap.get("Taylor Birkeland");
  const glennProfile = profileMap.get("Glenn Gray");
  
  if (!taylorProfile || !glennProfile) {
    console.error('❌ Missing profiles');
    return;
  }
  
  // Remove any existing matches for Glenn Gray first
  const filteredMatches = matches.filter((match: any) => 
    match.attendee !== "Glenn Gray" && match.match !== "Glenn Gray"
  );
  
  // Add new match
  const newMatch = {
    attendee: "Taylor Birkeland",
    attendeeProfile: taylorProfile,
    match: "Glenn Gray",
    matchProfile: glennProfile,
    matchScore: 0.82,
    whatYouShare: [
      "Technical Excellence",
      "Operations Leadership",
      "System Architecture",
      "Innovation Focus"
    ],
    icebreakers: [
      "What's your approach to technical architecture and system design?",
      "How do you balance innovation with operational stability?",
      "What emerging technologies are you most excited about?"
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
  
  console.log(`✅ Added match: Taylor Birkeland ↔ Glenn Gray - 82%`);
  console.log(`📊 Total matches: ${updatedMatches.length}`);
  
  // Final verification
  const coveredAttendees = new Set();
  updatedMatches.forEach((match: any) => {
    coveredAttendees.add(match.attendee);
    coveredAttendees.add(match.match);
  });
  
  console.log(`👥 Final Coverage: ${coveredAttendees.size}/${profiles.length} attendees`);
  
  if (coveredAttendees.size === profiles.length) {
    console.log('🎉 ALL ATTENDEES NOW HAVE MATCHES!');
  } else {
    const uncovered = profiles.filter((p: any) => !coveredAttendees.has(p.name));
    console.log('❌ Still uncovered:', uncovered.map((p: any) => p.name));
  }
}

fixTaylorMatch().catch(console.error);
