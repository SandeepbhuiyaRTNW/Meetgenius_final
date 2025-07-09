import fs from 'fs';
import path from 'path';
import { Profile } from '@/types';

async function resetAttendeeStatus() {
  console.log('🔄 Resetting all attendee statuses to "Not Arrived"...');
  
  const dataDir = path.join(process.cwd(), 'data');
  const profilesPath = path.join(dataDir, 'parsed_profiles.json');
  
  if (!fs.existsSync(profilesPath)) {
    console.error('❌ Profiles file not found');
    return;
  }

  // Load current profiles
  const profiles: Profile[] = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
  
  console.log(`📊 Processing ${profiles.length} profiles...`);
  
  // Reset all statuses to "Not Arrived" and remove check-in timestamps
  const updatedProfiles = profiles.map(profile => {
    const updated = {
      ...profile,
      status: 'Not Arrived' as const,
      lastUpdated: new Date().toISOString()
    };

    // Remove check-in timestamp since they're not arrived
    if (updated.checkedInAt) {
      delete updated.checkedInAt;
    }

    return updated;
  });
  
  // Count how many were changed
  const changedCount = profiles.filter((profile, index) => 
    profile.status !== updatedProfiles[index].status
  ).length;
  
  // Save updated profiles
  fs.writeFileSync(profilesPath, JSON.stringify(updatedProfiles, null, 2));
  
  console.log(`✅ Reset complete!`);
  console.log(`   - Total profiles: ${profiles.length}`);
  console.log(`   - Status changed: ${changedCount}`);
  console.log(`   - All attendees now default to "Not Arrived"`);
  console.log(`   - They will change to "Present" when they check in on the attendees page`);
}

resetAttendeeStatus().catch(console.error);
