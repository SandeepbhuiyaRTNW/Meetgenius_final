import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

export interface RawResumeData {
  filename: string;
  text: string;
  pages: number;
}

export class PDFParser {
  private resumesPath: string;

  constructor(resumesPath: string = '../../..') {
    this.resumesPath = resumesPath;
  }

  async parseAllResumes(): Promise<RawResumeData[]> {
    const resumeFiles = this.getResumeFiles();
    const parsedResumes: RawResumeData[] = [];

    for (const filename of resumeFiles) {
      try {
        const resumeData = await this.parseSingleResume(filename);
        parsedResumes.push(resumeData);
        console.log(`✅ Parsed: ${filename}`);
      } catch (error) {
        console.error(`❌ Failed to parse ${filename}:`, error);
      }
    }

    return parsedResumes;
  }

  private getResumeFiles(): string[] {
    const fullPath = path.resolve(this.resumesPath);
    const files = fs.readdirSync(fullPath);

    // Get all PDF files
    const allPdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));

    // Remove duplicates by extracting the base name
    const uniqueFiles = new Map<string, string>();

    allPdfFiles.forEach(file => {
      // Extract base name (remove Profile_ prefix and .pdf extension)
      let baseName = file.replace(/^Profile_/, '').replace(/\.pdf$/, '');

      // Handle special cases like "Ben Theis.pdf.pdf"
      baseName = baseName.replace(/\.pdf$/, '');

      // Prefer files without Profile_ prefix if both exist
      if (!uniqueFiles.has(baseName) || !file.startsWith('Profile_')) {
        uniqueFiles.set(baseName, file);
      }
    });

    // Sort files alphabetically for consistent processing
    return Array.from(uniqueFiles.values()).sort((a, b) => a.localeCompare(b));
  }

  private async parseSingleResume(filename: string): Promise<RawResumeData> {
    const filePath = path.join(this.resumesPath, filename);
    const dataBuffer = fs.readFileSync(filePath);
    
    const pdfData = await pdfParse(dataBuffer);
    
    return {
      filename,
      text: pdfData.text,
      pages: pdfData.numpages
    };
  }

  // Clean and normalize text for better AI processing
  static cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
      .replace(/[^\w\s\n.,@()-]/g, '') // Remove special characters except basic punctuation
      .trim();
  }

  // Extract potential contact information
  static extractContactInfo(text: string): { email?: string; phone?: string; linkedin?: string } {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
    const linkedinRegex = /linkedin\.com\/in\/([a-zA-Z0-9-]+)/g;

    const emails = text.match(emailRegex);
    const phones = text.match(phoneRegex);
    const linkedins = text.match(linkedinRegex);

    return {
      email: emails?.[0],
      phone: phones?.[0],
      linkedin: linkedins?.[0]
    };
  }
}
