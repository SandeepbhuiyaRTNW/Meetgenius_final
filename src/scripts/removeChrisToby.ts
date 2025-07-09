import fs from 'fs';
import path from 'path';
import { Profile, Match } from '@/types';

async function removeChrisAndToby() {
  console.log('🗑️ Removing Chris Madden and Toby Madden from the system...');
  
  const dataDir = path.join(process.cwd(), 'data');
  const profilesPath = path.join(dataDir, 'parsed_profiles.json');
  const matchesPath = path.join(dataDir, 'matches.json');
  
  if (!fs.existsSync(profilesPath) || !fs.existsSync(matchesPath)) {
    console.error('❌ Required files not found');
    return;
  }

  // Load current data
  const profiles: Profile[] = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
  const currentMatches = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));
  
  console.log(`📊 Before: ${profiles.length} profiles, ${currentMatches.length} matches`);
  
  // Remove Chris Madden and Toby Madden from profiles
  const filteredProfiles = profiles.filter(profile => 
    profile.name !== "Chris Madden" && profile.name !== "Toby Madden"
  );
  
  console.log(`👥 Removed ${profiles.length - filteredProfiles.length} profiles`);
  
  // Create a map for quick profile lookup
  const profileMap = new Map<string, Profile>();
  filteredProfiles.forEach(profile => {
    profileMap.set(profile.name, profile);
  });
  
  // Remove matches involving Chris Madden and Toby Madden
  const filteredMatches = currentMatches.filter((match: any) => 
    match.attendee !== "Chris Madden" && match.match !== "Chris Madden" &&
    match.attendee !== "Toby Madden" && match.match !== "Toby Madden"
  );
  
  console.log(`🤝 Removed ${currentMatches.length - filteredMatches.length} matches`);
  
  // Get the profiles that need new matches
  const ireneProfile = profileMap.get("Irene O");
  const nataliaProfile = profileMap.get("Natalia Dueholm");
  const cihanProfile = profileMap.get("Cihan Behlivan");
  
  if (!ireneProfile || !nataliaProfile || !cihanProfile) {
    console.error('❌ Missing required profiles for new matches');
    return;
  }
  
  // Create new matches with Cihan
  const newMatches = [
    // Irene O ↔ Cihan Behlivan (high compatibility - both are leaders with strategic focus)
    {
      attendee: "Irene O",
      attendeeProfile: ireneProfile,
      match: "Cihan Behlivan",
      matchProfile: cihanProfile,
      matchScore: 0.87,
      whatYouShare: [
        "Strategic Leadership",
        "Customer Experience Focus",
        "Business Innovation",
        "Market Understanding"
      ],
      icebreakers: [
        "How do you approach building customer-centric strategies?",
        "What's your experience with leading strategic initiatives?",
        "How do you balance innovation with customer needs?"
      ],
      matchConfidence: "High",
      presenceStatus: {
        attendee: "Present",
        match: "Present"
      }
    },
    
    // Natalia Dueholm gets matched with someone else since Cihan is now with Irene
    // Let's match her with someone who was previously matched but can be reassigned
    {
      attendee: "Natalia Dueholm",
      attendeeProfile: nataliaProfile,
      match: "Steve Stark",
      matchProfile: profileMap.get("Steve Stark"),
      matchScore: 0.81,
      whatYouShare: [
        "Professional Excellence",
        "Business Development",
        "Strategic Thinking",
        "Industry Expertise"
      ],
      icebreakers: [
        "What's been the most valuable learning experience in your career?",
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
  
  // Remove any existing matches for people we're reassigning
  const finalFilteredMatches = filteredMatches.filter((match: any) => 
    match.attendee !== "Irene O" && match.match !== "Irene O" &&
    match.attendee !== "Natalia Dueholm" && match.match !== "Natalia Dueholm" &&
    match.attendee !== "Steve Stark" && match.match !== "Steve Stark" &&
    match.attendee !== "Himanshu Laiker" && match.match !== "Himanshu Laiker"
  );
  
  // Add new matches
  const updatedMatches = [...finalFilteredMatches, ...newMatches];
  
  // Save updated data
  fs.writeFileSync(profilesPath, JSON.stringify(filteredProfiles, null, 2));
  fs.writeFileSync(matchesPath, JSON.stringify(updatedMatches, null, 2));
  
  console.log(`✅ Updated: ${filteredProfiles.length} profiles, ${updatedMatches.length} matches`);
  console.log('\n📋 New Matches Created:');
  newMatches.forEach((match) => {
    console.log(`   ${match.attendee} ↔ ${match.match} - ${Math.round(match.matchScore * 100)}%`);
  });
  
  // Verify coverage
  const coveredAttendees = new Set();
  updatedMatches.forEach((match: any) => {
    coveredAttendees.add(match.attendee);
    coveredAttendees.add(match.match);
  });
  
  console.log(`\n👥 Coverage: ${coveredAttendees.size}/${filteredProfiles.length} attendees`);
  
  if (coveredAttendees.size !== filteredProfiles.length) {
    const uncovered = filteredProfiles.filter(p => !coveredAttendees.has(p.name));
    console.log('❌ Uncovered attendees:', uncovered.map(p => p.name));
  } else {
    console.log('✅ All remaining attendees have matches!');
  }
  
  console.log('\n🗑️ Removed from system:');
  console.log('   - Chris Madden');
  console.log('   - Toby Madden');
}

removeChrisAndToby().catch(console.error);
