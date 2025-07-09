import fs from 'fs';
import path from 'path';
import { Profile } from '@/types';
import { QRCodeGenerator } from '@/utils/qrGenerator';

async function generateQRCodes() {
  console.log('🔄 Generating QR codes for all attendees...');
  
  const dataDir = path.join(process.cwd(), 'data');
  const profilesPath = path.join(dataDir, 'parsed_profiles.json');
  
  if (!fs.existsSync(profilesPath)) {
    console.error('❌ parsed_profiles.json not found');
    return;
  }

  const profiles: Profile[] = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
  const qrGenerator = new QRCodeGenerator('http://localhost:3000');
  
  // Create QR codes directory
  const qrDir = path.join(process.cwd(), 'public', 'qr-codes');
  if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir, { recursive: true });
  }

  const qrResults = [];
  
  for (const profile of profiles) {
    try {
      // Generate check-in QR code
      const checkInQR = await qrGenerator.generateCheckInQR(profile, 'ride-the-next-wave-demo-night', {
        size: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      // Save QR code as file
      const qrFileName = `checkin-${profile.id}.png`;
      const qrFilePath = path.join(qrDir, qrFileName);
      
      // Convert data URL to buffer and save
      const base64Data = checkInQR.replace(/^data:image\/png;base64,/, '');
      fs.writeFileSync(qrFilePath, base64Data, 'base64');
      
      qrResults.push({
        profile: {
          id: profile.id,
          name: profile.name,
          title: profile.title,
          company: profile.company
        },
        qrCode: `/qr-codes/${qrFileName}`,
        checkInUrl: `http://localhost:3000/checkin?attendee=${encodeURIComponent(profile.id)}&event=ride-the-next-wave-demo-night&name=${encodeURIComponent(profile.name)}`
      });
      
      console.log(`✅ Generated QR code for: ${profile.name}`);
    } catch (error) {
      console.error(`❌ Failed to generate QR code for ${profile.name}:`, error);
    }
  }
  
  // Save QR codes metadata
  const qrMetadataPath = path.join(dataDir, 'qr_codes.json');
  fs.writeFileSync(qrMetadataPath, JSON.stringify(qrResults, null, 2));
  
  console.log(`\n🎉 Generated ${qrResults.length} QR codes successfully!`);
  console.log(`📁 QR codes saved to: ${qrDir}`);
  console.log(`📄 Metadata saved to: ${qrMetadataPath}`);
  
  // Print summary
  console.log('\n📋 QR Code Summary:');
  qrResults.forEach(result => {
    console.log(`   ${result.profile.name} → ${result.checkInUrl}`);
  });
}

generateQRCodes().catch(console.error);
