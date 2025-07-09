#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { Profile, Match } from '../types';

function arrayToCSVString(arr: string[]): string {
  return `"${arr.join('; ')}"`;
}

function escapeCSV(str: string): string {
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function exportProfilesToCSV(profiles: Profile[]): string {
  const headers = [
    'ID',
    'Name',
    'Title',
    'Company',
    'Location',
    'Skills',
    'Certifications',
    'Experience',
    'Interests',
    'Goal'
  ];

  const rows = profiles.map(profile => [
    escapeCSV(profile.id),
    escapeCSV(profile.name),
    escapeCSV(profile.title),
    escapeCSV(profile.company),
    escapeCSV(profile.location),
    arrayToCSVString(profile.skills),
    arrayToCSVString(profile.certifications),
    arrayToCSVString(profile.experience),
    arrayToCSVString(profile.interests),
    escapeCSV(profile.goal)
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

function exportMatchesToCSV(matches: Match[]): string {
  const headers = [
    'Attendee',
    'Match',
    'Match_Score',
    'Confidence',
    'Shared_Interests',
    'Icebreaker_1',
    'Icebreaker_2',
    'Icebreaker_3',
    'Attendee_Title',
    'Attendee_Company',
    'Match_Title',
    'Match_Company',
    'Attendee_Status',
    'Match_Status'
  ];

  const rows = matches.map(match => [
    escapeCSV(match.attendee),
    escapeCSV(match.match),
    match.matchScore.toString(),
    escapeCSV(match.matchConfidence),
    arrayToCSVString(match.whatYouShare),
    escapeCSV(match.icebreakers[0] || ''),
    escapeCSV(match.icebreakers[1] || ''),
    escapeCSV(match.icebreakers[2] || ''),
    escapeCSV(match.attendeeProfile.title),
    escapeCSV(match.attendeeProfile.company),
    escapeCSV(match.matchProfile.title),
    escapeCSV(match.matchProfile.company),
    escapeCSV(match.presenceStatus.attendee),
    escapeCSV(match.presenceStatus.match)
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

async function main() {
  console.log('📊 Exporting data to CSV format...\n');

  try {
    const dataDir = path.join(__dirname, '../../data');
    
    // Read JSON files
    const profilesPath = path.join(dataDir, 'parsed_profiles.json');
    const matchesPath = path.join(dataDir, 'matches.json');

    if (!fs.existsSync(profilesPath)) {
      throw new Error('Profiles JSON file not found. Run npm run process-resumes first.');
    }

    if (!fs.existsSync(matchesPath)) {
      throw new Error('Matches JSON file not found. Run npm run process-resumes first.');
    }

    const profiles: Profile[] = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
    const matches: Match[] = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));

    console.log(`📄 Found ${profiles.length} profiles and ${matches.length} matches`);

    // Export profiles to CSV
    const profilesCSV = exportProfilesToCSV(profiles);
    const profilesCSVPath = path.join(dataDir, 'profiles.csv');
    fs.writeFileSync(profilesCSVPath, profilesCSV);
    console.log(`✅ Profiles exported to: ${profilesCSVPath}`);

    // Export matches to CSV
    const matchesCSV = exportMatchesToCSV(matches);
    const matchesCSVPath = path.join(dataDir, 'matches.csv');
    fs.writeFileSync(matchesCSVPath, matchesCSV);
    console.log(`✅ Matches exported to: ${matchesCSVPath}`);

    // Create a summary CSV with key statistics
    const summaryData = [
      ['Metric', 'Value'],
      ['Total Profiles', profiles.length.toString()],
      ['Total Matches', matches.length.toString()],
      ['Average Match Score', (matches.reduce((sum, m) => sum + m.matchScore, 0) / matches.length).toFixed(2)],
      ['High Confidence Matches', matches.filter(m => m.matchConfidence === 'High').length.toString()],
      ['Medium Confidence Matches', matches.filter(m => m.matchConfidence === 'Medium').length.toString()],
      ['Low Confidence Matches', matches.filter(m => m.matchConfidence === 'Low').length.toString()],
      ['Minneapolis Attendees', profiles.filter(p => p.location.includes('Minneapolis')).length.toString()],
      ['IT/Tech Professionals', profiles.filter(p => 
        p.title.toLowerCase().includes('it') || 
        p.title.toLowerCase().includes('tech') || 
        p.title.toLowerCase().includes('engineer') ||
        p.title.toLowerCase().includes('developer')
      ).length.toString()]
    ];

    const summaryCSV = summaryData.map(row => row.join(',')).join('\n');
    const summaryCSVPath = path.join(dataDir, 'summary.csv');
    fs.writeFileSync(summaryCSVPath, summaryCSV);
    console.log(`✅ Summary exported to: ${summaryCSVPath}`);

    console.log('\n🎉 CSV export completed successfully!');
    console.log('\n📁 Generated files:');
    console.log(`   • profiles.csv - All attendee profiles`);
    console.log(`   • matches.csv - All generated matches`);
    console.log(`   • summary.csv - Event statistics`);

  } catch (error) {
    console.error('❌ Error exporting to CSV:', error);
    process.exit(1);
  }
}

main().catch(console.error);
