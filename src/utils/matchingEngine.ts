import { Profile, Match, MatchingFactors } from '@/types';
import { OpenAIAgent } from './openaiAgent';
import { PDFParser } from './pdfParser';

export class MatchingEngine {
  private openaiAgent: OpenAIAgent;
  private pdfParser: PDFParser;

  constructor(openaiApiKey?: string, resumesPath?: string) {
    this.openaiAgent = new OpenAIAgent(openaiApiKey);
    this.pdfParser = new PDFParser(resumesPath);
  }

  async processAllResumes(): Promise<Profile[]> {
    console.log('🔄 Starting resume processing...');
    
    // Parse all PDF files
    const rawResumes = await this.pdfParser.parseAllResumes();
    console.log(`📄 Parsed ${rawResumes.length} PDF files`);

    // Convert to structured profiles using AI
    const profiles: Profile[] = [];
    for (const resume of rawResumes) {
      try {
        const profile = await this.openaiAgent.parseResumeToProfile(resume);
        profiles.push(profile);
        console.log(`✅ Processed profile: ${profile.name}`);
      } catch (error) {
        console.error(`❌ Failed to process ${resume.filename}:`, error);
      }
    }

    return profiles;
  }

  async generateOptimalMatches(profiles: Profile[]): Promise<Match[]> {
    console.log('🤝 Generating optimal matches...');
    
    if (profiles.length < 2) {
      throw new Error('Need at least 2 profiles to generate matches');
    }

    // Use AI to generate intelligent matches
    const matches = await this.openaiAgent.generateMatches(profiles);
    
    // Validate matches
    this.validateMatches(matches, profiles);
    
    console.log(`✅ Generated ${matches.length} high-quality matches`);
    return matches;
  }

  private validateMatches(matches: Match[], profiles: Profile[]): void {
    // Check for duplicates
    const attendeeNames = matches.map(m => m.attendee);
    const uniqueAttendees = new Set(attendeeNames);
    
    if (attendeeNames.length !== uniqueAttendees.size) {
      throw new Error('Duplicate attendees found in matches');
    }

    // Check that all profiles are referenced
    const allNames = profiles.map(p => p.name);
    const matchedNames = new Set([
      ...matches.map(m => m.attendee),
      ...matches.map(m => m.match)
    ]);

    const unmatchedProfiles = allNames.filter(name => !matchedNames.has(name));
    if (unmatchedProfiles.length > 0) {
      console.warn(`⚠️ Unmatched profiles: ${unmatchedProfiles.join(', ')}`);
    }

    // Validate match scores
    const lowScoreMatches = matches.filter(m => m.matchScore < 0.6);
    if (lowScoreMatches.length > 0) {
      console.warn(`⚠️ ${lowScoreMatches.length} matches have low scores (<0.6)`);
    }
  }

  // Advanced Multi-Dimensional Compatibility Algorithm
  calculateCompatibilityScore(profile1: Profile, profile2: Profile): number {
    const factors = this.calculateMatchingFactors(profile1, profile2);

    // Dynamic weight adjustment based on profile characteristics
    const weights = this.calculateDynamicWeights(profile1, profile2);

    // Apply non-linear scoring with diminishing returns
    let totalScore = 0;
    Object.entries(factors).forEach(([key, value]) => {
      const weight = weights[key as keyof typeof weights];
      // Apply sigmoid function for non-linear scoring
      const normalizedScore = this.applySigmoidTransform(value, 0.5, 2.0);
      totalScore += normalizedScore * weight;
    });

    // Apply network effect bonus for highly connected profiles
    const networkBonus = this.calculateNetworkEffectBonus(profile1, profile2);
    totalScore += networkBonus;

    // Apply temporal relevance factor
    const temporalFactor = this.calculateTemporalRelevance(profile1, profile2);
    totalScore *= temporalFactor;

    return Math.min(1.0, Math.max(0.0, totalScore));
  }

  // Dynamic weight calculation based on profile characteristics
  private calculateDynamicWeights(profile1: Profile, profile2: Profile): Record<string, number> {
    const baseWeights = {
      domainOverlap: 0.25,
      roleComplementarity: 0.20,
      skillsAlignment: 0.20,
      goalCompatibility: 0.15,
      locationBonus: 0.05,
      certificationOverlap: 0.10,
      experienceRelevance: 0.05
    };

    // Adjust weights based on seniority levels
    const seniorityAdjustment = this.calculateSeniorityAdjustment(profile1, profile2);

    // Adjust weights based on industry focus
    const industryAdjustment = this.calculateIndustryAdjustment(profile1, profile2);

    // Apply adjustments
    const adjustedWeights = { ...baseWeights };
    adjustedWeights.roleComplementarity *= seniorityAdjustment;
    adjustedWeights.domainOverlap *= industryAdjustment;
    adjustedWeights.skillsAlignment *= (1 + (seniorityAdjustment - 1) * 0.5);

    // Normalize weights to sum to 1
    const totalWeight = Object.values(adjustedWeights).reduce((sum, weight) => sum + weight, 0);
    Object.keys(adjustedWeights).forEach(key => {
      adjustedWeights[key as keyof typeof adjustedWeights] /= totalWeight;
    });

    return adjustedWeights;
  }

  // Sigmoid transformation for non-linear scoring
  private applySigmoidTransform(value: number, midpoint: number = 0.5, steepness: number = 2.0): number {
    return 1 / (1 + Math.exp(-steepness * (value - midpoint)));
  }

  // Network effect bonus calculation
  private calculateNetworkEffectBonus(profile1: Profile, profile2: Profile): number {
    const mutualConnections = this.estimateMutualConnections(profile1, profile2);
    const networkDiversity = this.calculateNetworkDiversity(profile1, profile2);

    return Math.min(0.1, mutualConnections * 0.02 + networkDiversity * 0.05);
  }

  // Temporal relevance factor
  private calculateTemporalRelevance(profile1: Profile, profile2: Profile): number {
    // Boost matches between people at similar career stages
    const careerStageAlignment = this.calculateCareerStageAlignment(profile1, profile2);

    // Consider current market trends and hot skills
    const trendAlignment = this.calculateTrendAlignment(profile1, profile2);

    return 0.8 + (careerStageAlignment * 0.15) + (trendAlignment * 0.05);
  }

  private calculateMatchingFactors(profile1: Profile, profile2: Profile): MatchingFactors {
    return {
      domainOverlap: this.calculateDomainOverlap(profile1, profile2),
      roleComplementarity: this.calculateRoleComplementarity(profile1, profile2),
      skillsAlignment: this.calculateSkillsAlignment(profile1, profile2),
      goalCompatibility: this.calculateGoalCompatibility(profile1, profile2),
      locationBonus: this.calculateLocationBonus(profile1, profile2),
      certificationOverlap: this.calculateCertificationOverlap(profile1, profile2),
      experienceRelevance: this.calculateExperienceRelevance(profile1, profile2)
    };
  }

  private calculateDomainOverlap(p1: Profile, p2: Profile): number {
    const domains1 = this.extractDomains(p1);
    const domains2 = this.extractDomains(p2);
    const intersection = domains1.filter(d => domains2.includes(d));
    const union = [...new Set([...domains1, ...domains2])];
    return union.length > 0 ? intersection.length / union.length : 0;
  }

  private calculateRoleComplementarity(p1: Profile, p2: Profile): number {
    const complementaryPairs = [
      ['founder', 'engineer'], ['ceo', 'cto'], ['sales', 'technical'],
      ['student', 'senior'], ['junior', 'senior'], ['recruiter', 'candidate']
    ];
    
    const title1 = p1.title.toLowerCase();
    const title2 = p2.title.toLowerCase();
    
    return complementaryPairs.some(([a, b]) => 
      (title1.includes(a) && title2.includes(b)) || 
      (title1.includes(b) && title2.includes(a))
    ) ? 1.0 : 0.0;
  }

  private calculateSkillsAlignment(p1: Profile, p2: Profile): number {
    const skills1 = p1.skills.map(s => s.toLowerCase());
    const skills2 = p2.skills.map(s => s.toLowerCase());
    const intersection = skills1.filter(s => skills2.includes(s));
    const union = [...new Set([...skills1, ...skills2])];
    return union.length > 0 ? intersection.length / union.length : 0;
  }

  private calculateGoalCompatibility(p1: Profile, p2: Profile): number {
    const goal1 = p1.goal.toLowerCase();
    const goal2 = p2.goal.toLowerCase();
    
    // Compatible goal pairs
    const compatibleGoals = [
      ['find clients', 'generate leads'],
      ['mentorship', 'learn'],
      ['hiring', 'job'],
      ['partnership', 'collaboration']
    ];
    
    return compatibleGoals.some(([a, b]) => 
      (goal1.includes(a) && goal2.includes(b)) || 
      (goal1.includes(b) && goal2.includes(a))
    ) ? 1.0 : goal1 === goal2 ? 0.8 : 0.2;
  }

  private calculateLocationBonus(p1: Profile, p2: Profile): number {
    const loc1 = p1.location.toLowerCase();
    const loc2 = p2.location.toLowerCase();
    
    if (loc1 === loc2) return 1.0;
    
    // Same state/region bonus
    const state1 = loc1.split(',')[1]?.trim();
    const state2 = loc2.split(',')[1]?.trim();
    if (state1 && state2 && state1 === state2) return 0.5;
    
    return 0.0;
  }

  private calculateCertificationOverlap(p1: Profile, p2: Profile): number {
    const certs1 = p1.certifications.map(c => c.toLowerCase());
    const certs2 = p2.certifications.map(c => c.toLowerCase());
    const intersection = certs1.filter(c => certs2.includes(c));
    const union = [...new Set([...certs1, ...certs2])];
    return union.length > 0 ? intersection.length / union.length : 0;
  }

  private calculateExperienceRelevance(p1: Profile, p2: Profile): number {
    // Simple keyword matching in experience
    const exp1 = p1.experience.join(' ').toLowerCase();
    const exp2 = p2.experience.join(' ').toLowerCase();
    
    const keywords1 = exp1.split(/\s+/);
    const keywords2 = exp2.split(/\s+/);
    const intersection = keywords1.filter(k => keywords2.includes(k) && k.length > 3);
    
    return Math.min(1.0, intersection.length / 10); // Normalize to 0-1
  }

  private extractDomains(profile: Profile): string[] {
    const text = `${profile.title} ${profile.company} ${profile.skills.join(' ')} ${profile.interests.join(' ')}`.toLowerCase();

    const domains = [];
    if (text.includes('tech') || text.includes('software') || text.includes('engineer')) domains.push('technology');
    if (text.includes('ai') || text.includes('machine learning') || text.includes('data')) domains.push('ai/ml');
    if (text.includes('sales') || text.includes('marketing') || text.includes('business')) domains.push('business');
    if (text.includes('finance') || text.includes('accounting') || text.includes('investment')) domains.push('finance');
    if (text.includes('health') || text.includes('medical') || text.includes('bio')) domains.push('healthcare');
    if (text.includes('education') || text.includes('teaching') || text.includes('academic')) domains.push('education');

    return domains.length > 0 ? domains : ['general'];
  }

  // Advanced algorithm helper methods
  private calculateSeniorityAdjustment(profile1: Profile, profile2: Profile): number {
    const seniority1 = this.estimateSeniorityLevel(profile1);
    const seniority2 = this.estimateSeniorityLevel(profile2);

    // Boost complementary seniority levels (senior + junior)
    const seniorityDiff = Math.abs(seniority1 - seniority2);
    if (seniorityDiff >= 2) return 1.3; // Mentorship potential
    if (seniorityDiff === 1) return 1.1; // Good balance
    return 1.0; // Peer level
  }

  private calculateIndustryAdjustment(profile1: Profile, profile2: Profile): number {
    const industries1 = this.extractIndustries(profile1);
    const industries2 = this.extractIndustries(profile2);

    const overlap = industries1.filter(ind => industries2.includes(ind)).length;
    const total = new Set([...industries1, ...industries2]).size;

    return 0.8 + (overlap / total) * 0.4;
  }

  private estimateMutualConnections(profile1: Profile, profile2: Profile): number {
    // Estimate based on company size, industry, and location
    let connections = 0;

    if (profile1.location === profile2.location) connections += 2;
    if (this.extractIndustries(profile1).some(ind => this.extractIndustries(profile2).includes(ind))) connections += 3;
    if (profile1.company.toLowerCase().includes('startup') && profile2.company.toLowerCase().includes('startup')) connections += 2;

    return connections;
  }

  private calculateNetworkDiversity(profile1: Profile, profile2: Profile): number {
    const skills1 = new Set(profile1.skills.map(s => s.toLowerCase()));
    const skills2 = new Set(profile2.skills.map(s => s.toLowerCase()));

    const uniqueSkills = new Set([...skills1, ...skills2]);
    const sharedSkills = [...skills1].filter(skill => skills2.has(skill));

    // Higher diversity score for complementary skill sets
    return (uniqueSkills.size - sharedSkills.length) / uniqueSkills.size;
  }

  private calculateCareerStageAlignment(profile1: Profile, profile2: Profile): number {
    const stage1 = this.inferCareerStage(profile1);
    const stage2 = this.inferCareerStage(profile2);

    // Boost matches between complementary career stages
    const stageCompatibility = {
      'early-senior': 0.9,
      'early-mid': 0.7,
      'mid-senior': 0.8,
      'early-early': 0.6,
      'mid-mid': 0.7,
      'senior-senior': 0.5
    };

    const key = `${stage1}-${stage2}` as keyof typeof stageCompatibility;
    const reverseKey = `${stage2}-${stage1}` as keyof typeof stageCompatibility;

    return stageCompatibility[key] || stageCompatibility[reverseKey] || 0.5;
  }

  private calculateTrendAlignment(profile1: Profile, profile2: Profile): number {
    const trendingSkills = ['ai', 'machine learning', 'blockchain', 'cloud', 'devops', 'react', 'python'];

    const skills1 = profile1.skills.map(s => s.toLowerCase());
    const skills2 = profile2.skills.map(s => s.toLowerCase());

    const trendingCount1 = skills1.filter(skill =>
      trendingSkills.some(trend => skill.includes(trend))
    ).length;

    const trendingCount2 = skills2.filter(skill =>
      trendingSkills.some(trend => skill.includes(trend))
    ).length;

    return Math.min(1.0, (trendingCount1 + trendingCount2) / 6);
  }

  private estimateSeniorityLevel(profile: Profile): number {
    const title = profile.title.toLowerCase();

    if (title.includes('ceo') || title.includes('founder') || title.includes('president')) return 4;
    if (title.includes('vp') || title.includes('director') || title.includes('head')) return 3;
    if (title.includes('senior') || title.includes('lead') || title.includes('manager')) return 2;
    if (title.includes('junior') || title.includes('associate') || title.includes('intern')) return 0;
    return 1; // Mid-level
  }

  private extractIndustries(profile: Profile): string[] {
    const text = `${profile.company} ${profile.title} ${profile.experience.join(' ')}`.toLowerCase();
    const industries = [];

    if (text.includes('tech') || text.includes('software') || text.includes('saas')) industries.push('technology');
    if (text.includes('finance') || text.includes('bank') || text.includes('investment')) industries.push('finance');
    if (text.includes('health') || text.includes('medical') || text.includes('pharma')) industries.push('healthcare');
    if (text.includes('retail') || text.includes('ecommerce') || text.includes('consumer')) industries.push('retail');
    if (text.includes('media') || text.includes('advertising') || text.includes('marketing')) industries.push('media');

    return industries.length > 0 ? industries : ['general'];
  }

  private inferCareerStage(profile: Profile): 'early' | 'mid' | 'senior' {
    const seniorityLevel = this.estimateSeniorityLevel(profile);

    if (seniorityLevel >= 3) return 'senior';
    if (seniorityLevel >= 1) return 'mid';
    return 'early';
  }
}
