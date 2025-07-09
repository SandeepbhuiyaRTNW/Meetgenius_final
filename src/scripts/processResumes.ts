#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { MatchingEngine } from '../utils/matchingEngine';
import { Profile, Match } from '../types';

async function main() {
  console.log('🚀 MeetGenius AI Matchmaker - Processing Resumes for AI Demo Night');
  console.log('📅 Event: July 9, 2025 @ 7:00 PM\n');

  try {
    // Initialize the matching engine
    const resumesPath = path.resolve(__dirname, '..');
    console.log('🔍 Looking for PDF files in:', resumesPath);
    const filesInDir = fs.readdirSync(resumesPath);
    console.log('📂 Files found:', filesInDir);
    const matchingEngine = new MatchingEngine(process.env.OPENAI_API_KEY, resumesPath);

    // Step 1: Process all resumes
    console.log('📄 Step 1: Processing PDF resumes...');
    const profiles = await matchingEngine.processAllResumes();
    
    if (profiles.length === 0) {
      throw new Error('No profiles were successfully processed');
    }

    console.log(`✅ Successfully processed ${profiles.length} profiles\n`);

    // Step 2: Generate matches
    console.log('🤝 Step 2: Generating optimal matches...');
    const matches = await matchingEngine.generateOptimalMatches(profiles);
    
    console.log(`✅ Generated ${matches.length} matches\n`);

    // Step 3: Save results
    console.log('💾 Step 3: Saving results...');
    
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save parsed profiles
    const profilesPath = path.join(dataDir, 'parsed_profiles.json');
    fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2));
    console.log(`✅ Saved profiles to: ${profilesPath}`);

    // Save matches
    const matchesPath = path.join(dataDir, 'matches.json');
    fs.writeFileSync(matchesPath, JSON.stringify(matches, null, 2));
    console.log(`✅ Saved matches to: ${matchesPath}`);

    // Step 4: Generate summary statistics
    console.log('\n📊 Summary Statistics:');
    console.log(`👥 Total Attendees: ${profiles.length}`);
    console.log(`🤝 Total Matches: ${matches.length}`);
    
    const avgScore = matches.reduce((sum, m) => sum + m.matchScore, 0) / matches.length;
    console.log(`📈 Average Match Score: ${avgScore.toFixed(2)}`);
    
    const confidenceCounts = matches.reduce((acc, m) => {
      acc[m.matchConfidence] = (acc[m.matchConfidence] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log(`🎯 Match Confidence Distribution:`);
    Object.entries(confidenceCounts).forEach(([level, count]) => {
      console.log(`   ${level}: ${count} matches`);
    });

    // Step 5: Show sample matches
    console.log('\n🌟 Sample Matches:');
    matches.slice(0, 3).forEach((match, index) => {
      console.log(`\n${index + 1}. ${match.attendee} ↔ ${match.match}`);
      console.log(`   Score: ${match.matchScore.toFixed(2)} (${match.matchConfidence})`);
      console.log(`   Shared: ${match.whatYouShare.slice(0, 2).join(', ')}`);
      console.log(`   Icebreaker: "${match.icebreakers[0]}"`);
    });

    console.log('\n🎉 Processing complete! Ready for AI Demo Night!');
    console.log('\nlhost:3000');
    console.log('   3. Demo the matc🚀 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Open: http://locahes at the event!');

  } catch (error) {
    console.error('❌ Error processing resumes:', error);
    process.exit(1);
  }
}

// Handle environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY environment variable is required');
  console.log('💡 Set it with: export OPENAI_API_KEY="your-api-key-here"');
  process.exit(1);
}

// Run the main function
main().catch(console.error);
