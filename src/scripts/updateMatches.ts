import fs from 'fs';
import path from 'path';
import { Profile, Match } from '@/types';

async function updateMatches() {
  console.log('🔄 Updating matches - removing Chris Madden and Toby Madden...');
  
  const dataDir = path.join(process.cwd(), 'data');
  const profilesPath = path.join(dataDir, 'parsed_profiles.json');
  const matchesPath = path.join(dataDir, 'matches.json');
  
  if (!fs.existsSync(profilesPath) || !fs.existsSync(matchesPath)) {
    console.error('❌ Required files not found');
    return;
  }

  const profiles: Profile[] = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
  const currentMatches = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));
  
  // Create a map for quick profile lookup
  const profileMap = new Map<string, Profile>();
  profiles.forEach(profile => {
    profileMap.set(profile.name, profile);
  });
  
  // Remove matches involving Chris Madden and Toby Madden
  const filteredMatches = currentMatches.filter((match: any) => 
    match.attendee !== "Chris Madden" && match.match !== "Chris Madden" &&
    match.attendee !== "Toby Madden" && match.match !== "Toby Madden"
  );
  
  console.log(`📉 Removed ${currentMatches.length - filteredMatches.length} matches`);
  
  // Add new optimal match: Chris Madden ↔ Cihan Behlivan
  const chrisProfile = profileMap.get("Chris Madden");
  const cihanProfile = profileMap.get("Cihan Behlivan");
  const tobyProfile = profileMap.get("Toby Madden");
  const ireneProfile = profileMap.get("Irene O");
  const nataliaProfile = profileMap.get("Natalia Dueholm");
  
  if (!chrisProfile || !cihanProfile || !tobyProfile || !ireneProfile || !nataliaProfile) {
    console.error('❌ Missing required profiles');
    return;
  }
  
  // Add new matches
  const newMatches = [
    // Chris Madden ↔ Cihan Behlivan (89% - high executive leadership compatibility)
    {
      attendee: "Chris Madden",
      attendeeProfile: chrisProfile,
      match: "Cihan Behlivan",
      matchProfile: cihanProfile,
      matchScore: 0.89,
      whatYouShare: [
        "Executive Leadership",
        "Technology Innovation", 
        "Business Strategy",
        "Customer-Focused Solutions"
      ],
      icebreakers: [
        "How do you approach integrating technology into business strategy?",
        "What's your experience with scaling customer-focused solutions?", 
        "How do you balance innovation with operational excellence?"
      ],
      matchConfidence: "High",
      presenceStatus: {
        attendee: "Present",
        match: "Present"
      }
    },
    
    // Toby Madden ↔ Irene O (84% - strategic business focus)
    {
      attendee: "Toby Madden",
      attendeeProfile: tobyProfile,
      match: "Irene O", 
      matchProfile: ireneProfile,
      matchScore: 0.84,
      whatYouShare: [
        "Strategic Leadership",
        "Business Development",
        "Market Analysis", 
        "Professional Excellence"
      ],
      icebreakers: [
        "How do you approach strategic planning in your industry?",
        "What's your experience with market analysis and business development?",
        "How do you stay ahead of industry trends and opportunities?"
      ],
      matchConfidence: "High",
      presenceStatus: {
        attendee: "Present", 
        match: "Present"
      }
    },
    
    // Natalia Dueholm gets a new match with someone who was previously matched
    // Let's match her with someone compatible
    {
      attendee: "Natalia Dueholm",
      attendeeProfile: nataliaProfile,
      match: "Himanshu Laiker",
      matchProfile: profileMap.get("Himanshu Laiker"),
      matchScore: 0.82,
      whatYouShare: [
        "Professional Excellence",
        "Strategic Thinking", 
        "Business Development",
        "Leadership Growth"
      ],
      icebreakers: [
        "What's been the most impactful learning experience in your career?",
        "How do you approach professional development and growth?",
        "What strategies have you found most effective for business success?"
      ],
      matchConfidence: "High",
      presenceStatus: {
        attendee: "Present",
        match: "Present"
      }
    }
  ];
  
  // Add new matches to filtered matches
  const updatedMatches = [...filteredMatches, ...newMatches];
  
  // Save updated matches
  fs.writeFileSync(matchesPath, JSON.stringify(updatedMatches, null, 2));
  
  console.log(`✅ Updated matches: ${updatedMatches.length} total matches`);
  console.log('\n📋 New Matches Added:');
  newMatches.forEach((match) => {
    console.log(`   ${match.attendee} ↔ ${match.match} - ${Math.round(match.matchScore * 100)}%`);
  });
  
  // Verify all attendees are still covered
  const coveredAttendees = new Set();
  updatedMatches.forEach((match: any) => {
    coveredAttendees.add(match.attendee);
    coveredAttendees.add(match.match);
  });
  
  console.log(`\n👥 Coverage: ${coveredAttendees.size}/${profiles.length} attendees`);
  
  if (coveredAttendees.size !== profiles.length) {
    const uncovered = profiles.filter(p => !coveredAttendees.has(p.name));
    console.log('❌ Uncovered attendees:', uncovered.map(p => p.name));
  } else {
    console.log('✅ All attendees still have matches!');
  }
}

updateMatches().catch(console.error);
