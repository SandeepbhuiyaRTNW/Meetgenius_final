import QRCode from 'qrcode';
import { Profile } from '@/types';

export interface QRCodeOptions {
  size?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

export class QRCodeGenerator {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Generate QR code for attendee check-in
   * QR code will contain URL that leads to check-in page for specific attendee
   */
  async generateCheckInQR(
    profile: Profile, 
    eventId: string = 'ride-the-next-wave-demo-night',
    options: QRCodeOptions = {}
  ): Promise<string> {
    const checkInUrl = `${this.baseUrl}/checkin?attendee=${encodeURIComponent(profile.id)}&event=${encodeURIComponent(eventId)}&name=${encodeURIComponent(profile.name)}`;
    
    const qrOptions = {
      width: options.size || 300,
      margin: options.margin || 2,
      color: {
        dark: options.color?.dark || '#000000',
        light: options.color?.light || '#FFFFFF'
      },
      errorCorrectionLevel: 'M' as const
    };

    try {
      const qrCodeDataURL = await QRCode.toDataURL(checkInUrl, qrOptions);
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate QR code for viewing attendee matches
   */
  async generateMatchesQR(
    profile: Profile,
    eventId: string = 'ride-the-next-wave-demo-night',
    options: QRCodeOptions = {}
  ): Promise<string> {
    const matchesUrl = `${this.baseUrl}/matches?event=${encodeURIComponent(eventId)}&attendee=${encodeURIComponent(profile.id)}`;
    
    const qrOptions = {
      width: options.size || 300,
      margin: options.margin || 2,
      color: {
        dark: options.color?.dark || '#000000',
        light: options.color?.light || '#FFFFFF'
      },
      errorCorrectionLevel: 'M' as const
    };

    try {
      const qrCodeDataURL = await QRCode.toDataURL(matchesUrl, qrOptions);
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating matches QR code:', error);
      throw new Error('Failed to generate matches QR code');
    }
  }

  /**
   * Generate QR code for attendee profile
   */
  async generateProfileQR(
    profile: Profile,
    eventId: string = 'ride-the-next-wave-demo-night',
    options: QRCodeOptions = {}
  ): Promise<string> {
    const profileUrl = `${this.baseUrl}/profile?attendee=${encodeURIComponent(profile.id)}&event=${encodeURIComponent(eventId)}`;
    
    const qrOptions = {
      width: options.size || 300,
      margin: options.margin || 2,
      color: {
        dark: options.color?.dark || '#000000',
        light: options.color?.light || '#FFFFFF'
      },
      errorCorrectionLevel: 'M' as const
    };

    try {
      const qrCodeDataURL = await QRCode.toDataURL(profileUrl, qrOptions);
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating profile QR code:', error);
      throw new Error('Failed to generate profile QR code');
    }
  }

  /**
   * Generate batch QR codes for all attendees
   */
  async generateBatchCheckInQRs(
    profiles: Profile[],
    eventId: string = 'ride-the-next-wave-demo-night',
    options: QRCodeOptions = {}
  ): Promise<Array<{ profile: Profile; qrCode: string }>> {
    const results = [];
    
    for (const profile of profiles) {
      try {
        const qrCode = await this.generateCheckInQR(profile, eventId, options);
        results.push({ profile, qrCode });
        console.log(`✅ Generated QR code for: ${profile.name}`);
      } catch (error) {
        console.error(`❌ Failed to generate QR code for ${profile.name}:`, error);
      }
    }
    
    return results;
  }

  /**
   * Extract attendee info from QR code URL
   */
  static parseCheckInUrl(url: string): { attendeeId?: string; eventId?: string; name?: string } | null {
    try {
      const urlObj = new URL(url);
      
      if (!urlObj.pathname.includes('/checkin')) {
        return null;
      }
      
      const attendeeId = urlObj.searchParams.get('attendee');
      const eventId = urlObj.searchParams.get('event');
      const name = urlObj.searchParams.get('name');
      
      return {
        attendeeId: attendeeId || undefined,
        eventId: eventId || undefined,
        name: name || undefined
      };
    } catch (error) {
      console.error('Error parsing check-in URL:', error);
      return null;
    }
  }
}

// Export singleton instance
export const qrGenerator = new QRCodeGenerator();

// Export utility functions
export const generateCheckInQR = (profile: Profile, eventId?: string, options?: QRCodeOptions) => 
  qrGenerator.generateCheckInQR(profile, eventId, options);

export const generateMatchesQR = (profile: Profile, eventId?: string, options?: QRCodeOptions) => 
  qrGenerator.generateMatchesQR(profile, eventId, options);

export const generateProfileQR = (profile: Profile, eventId?: string, options?: QRCodeOptions) => 
  qrGenerator.generateProfileQR(profile, eventId, options);
