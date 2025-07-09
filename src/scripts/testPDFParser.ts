import { PDFParser } from '@/utils/pdfParser';

async function testPDFParser() {
  console.log('🔄 Testing PDF Parser...');
  
  const parser = new PDFParser('src');
  
  // Get the list of files that would be processed
  const files = (parser as any).getResumeFiles();
  
  console.log(`📄 Found ${files.length} unique PDF files to process:`);
  files.forEach((file: string, index: number) => {
    console.log(`   ${index + 1}. ${file}`);
  });
  
  console.log('\n✅ PDF Parser test complete');
}

testPDFParser().catch(console.error);
