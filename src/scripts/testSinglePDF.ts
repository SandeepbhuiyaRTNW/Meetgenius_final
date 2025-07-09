#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { PDFParser } from '../utils/pdfParser';
import { OpenAIAgent } from '../utils/openaiAgent';

async function testSinglePDF() {
  console.log('🧪 Testing PDF extraction with a single file...\n');

  try {
    // Check if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY environment variable is required');
      console.log('💡 Set it with: export OPENAI_API_KEY="your-api-key-here"');
      process.exit(1);
    }

    // Initialize components
    const resumesPath = path.resolve(__dirname, '../../..'); // Points to the parent directory with PDFs
    const pdfParser = new PDFParser(resumesPath);
    const openaiAgent = new OpenAIAgent(process.env.OPENAI_API_KEY);

    console.log(`🔍 Looking for PDFs in: ${resumesPath}`);

    // Get list of PDF files
    const files = fs.readdirSync(resumesPath)
      .filter(file => file.toLowerCase().endsWith('.pdf') && file.startsWith('Profile'))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\((\d+)\)/)?.[1] || '0');
        const numB = parseInt(b.match(/\((\d+)\)/)?.[1] || '0');
        return numA - numB;
      });

    if (files.length === 0) {
      console.error('❌ No PDF files found in the directory');
      process.exit(1);
    }

    console.log(`📁 Found ${files.length} PDF files:`);
    files.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });

    // Test with the first PDF file
    const testFile = files[0];
    console.log(`\n🔍 Testing with: ${testFile}`);

    // Parse the PDF
    console.log('📄 Parsing PDF...');
    const filePath = path.join(resumesPath, testFile);
    const dataBuffer = fs.readFileSync(filePath);
    
    const pdfParse = require('pdf-parse');
    const pdfData = await pdfParse(dataBuffer);
    
    console.log(`✅ PDF parsed successfully:`);
    console.log(`   Pages: ${pdfData.numpages}`);
    console.log(`   Text length: ${pdfData.text.length} characters`);
    
    // Show first 500 characters of extracted text
    console.log(`\n📝 Sample extracted text:`);
    console.log('─'.repeat(50));
    console.log(pdfData.text.substring(0, 500) + '...');
    console.log('─'.repeat(50));

    // Test AI parsing
    console.log('\n🤖 Testing AI profile extraction...');
    const rawResumeData = {
      filename: testFile,
      text: pdfData.text,
      pages: pdfData.numpages
    };

    const profile = await openaiAgent.parseResumeToProfile(rawResumeData);
    
    console.log('\n✅ AI Profile extraction successful!');
    console.log('📊 Extracted Profile:');
    console.log(JSON.stringify(profile, null, 2));

    // Save test result
    const testResultPath = path.join(__dirname, '../data/test-profile.json');
    const dataDir = path.dirname(testResultPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(testResultPath, JSON.stringify(profile, null, 2));
    console.log(`\n💾 Test result saved to: ${testResultPath}`);

    console.log('\n🎉 Single PDF test completed successfully!');
    console.log('✅ Ready to process all PDFs with: npm run process-resumes');

  } catch (error) {
    console.error('❌ Error during testing:', error);
    process.exit(1);
  }
}

// Run the test
testSinglePDF().catch(console.error);
