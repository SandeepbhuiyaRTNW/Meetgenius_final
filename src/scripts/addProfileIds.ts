import fs from 'fs';
import path from 'path';
import { Profile } from '@/types';

function generateId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

async function addProfileIds() {
  const dataDir = path.join(process.cwd(), 'data');
  const profilesPath = path.join(dataDir, 'parsed_profiles.json');
  
  if (!fs.existsSync(profilesPath)) {
    console.error('❌ parsed_profiles.json not found');
    return;
  }

  const profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
  
  // Add IDs to profiles that don't have them
  const updatedProfiles = profiles.map((profile: any) => {
    if (!profile.id) {
      profile.id = generateId(profile.name);
    }
    return profile;
  });

  // Write back to file
  fs.writeFileSync(profilesPath, JSON.stringify(updatedProfiles, null, 2));
  
  console.log(`✅ Added IDs to ${updatedProfiles.length} profiles`);
  updatedProfiles.forEach((profile: Profile) => {
    console.log(`   ${profile.name} → ${profile.id}`);
  });
}

addProfileIds().catch(console.error);
