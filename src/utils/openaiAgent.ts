import OpenAI from 'openai';
import { Profile, Match, PersonalityInsights, ConversationSuggestion, NetworkingStrategy } from '@/types';
import { RawResumeData } from './pdfParser';

export class OpenAIAgent {
  private client: OpenAI;
  private conversationAgent: ConversationAIAgent;
  private personalityAgent: PersonalityAnalysisAgent;
  private strategyAgent: NetworkingStrategyAgent;
  private predictionAgent: PredictionAgent;

  constructor(apiKey?: string) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });

    // Initialize specialized AI agents
    this.conversationAgent = new ConversationAIAgent(this.client);
    this.personalityAgent = new PersonalityAnalysisAgent(this.client);
    this.strategyAgent = new NetworkingStrategyAgent(this.client);
    this.predictionAgent = new PredictionAgent(this.client);
  }

  async parseResumeToProfile(resumeData: RawResumeData): Promise<Profile> {
    const prompt = `
You are the MeetGenius Advanced AI Resume Parser with deep psychological and professional analysis capabilities.

Extract comprehensive structured data from this resume and perform advanced analysis.

Resume Text:
${resumeData.text}

Return ONLY this enhanced JSON structure:
{
  "name": "Full Name",
  "title": "Current Job Title",
  "company": "Current Company",
  "location": "City, State/Country",
  "skills": ["skill1", "skill2", "skill3"],
  "certifications": ["cert1", "cert2"],
  "experience": ["Previous Role 1", "Previous Role 2"],
  "interests": ["interest1", "interest2"],
  "goal": "What they want to achieve through networking",
  "email": "email@domain.com",
  "linkedin": "linkedin.com/in/username",
  "personalityTraits": {
    "communicationStyle": "Direct/Collaborative/Analytical/Creative",
    "workStyle": "Independent/Team-oriented/Leadership/Supportive",
    "energyLevel": "High/Medium/Calm",
    "innovationLevel": "Cutting-edge/Progressive/Practical/Traditional",
    "careerStage": "Student/Early-career/Mid-level/Senior/Executive"
  },
  "networkingPreferences": {
    "preferredTopics": ["topic1", "topic2", "topic3"],
    "conversationStyle": "Technical/Business/Casual/Formal",
    "meetingPreference": "One-on-one/Small groups/Large networking/Virtual",
    "followUpStyle": "Immediate/Planned/Casual/Formal"
  },
  "aiInsights": {
    "strengthAreas": ["strength1", "strength2"],
    "growthOpportunities": ["opportunity1", "opportunity2"],
    "idealMatchProfile": "Description of ideal networking match",
    "conversationStarters": ["starter1", "starter2", "starter3"],
    "uniqueValue": "What makes this person unique for networking"
  }
}

Advanced Analysis Guidelines:
- Analyze communication patterns from resume language
- Infer personality traits from career choices and descriptions
- Identify networking preferences from professional background
- Generate AI-powered insights about networking potential
- Create personalized conversation starters
- Assess career trajectory and growth patterns
- Focus on psychological compatibility factors`;

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      // Remove Markdown code block markers if present
      const cleanedContent = content.replace(/^```json\s*|^```\s*|```$/gim, '').trim();

      const profile = JSON.parse(cleanedContent) as Profile;
      profile.id = `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Generate additional AI insights using specialized agents
      const personalityInsights = await this.personalityAgent.analyzePersonality(profile);
      profile.personalityInsights = personalityInsights;

      return profile;
    } catch (error) {
      console.error('Error parsing resume:', error);
      throw error;
    }
  }

  async generateMatches(profiles: Profile[]): Promise<Match[]> {
    const batchSize = 5;
    let allMatches: Match[] = [];
    for (let i = 0; i < profiles.length; i += batchSize) {
      const batch = profiles.slice(i, i + batchSize);
      const prompt = `
You are the MeetGenius Matching Agent for AI DEMO NIGHT on July 9, 2025.

Create optimal matches for these ${batch.length} attendees. Each person should get exactly ONE high-quality match.

Profiles:
${JSON.stringify(batch, null, 2)}

Matching Criteria:
1. Domain/industry overlap (same field = good)
2. Complementary roles (founder ↔ engineer, student ↔ mentor)
3. Shared skills or tools
4. Compatible networking goals
5. Location similarity (bonus points)
6. Shared certifications/education
7. Common interests or volunteer work

For each attendee, find their BEST match and generate:
- Match score (0.0 to 1.0)
- 3-5 things they share
- 3 conversation starters/icebreakers
- Confidence level (Low/Medium/High)
- Simulated presence status

IMPORTANT: 
- Each person appears exactly once as "attendee"
- No duplicate pairings (if A matches B, don't also have B match A)
- Ensure high-quality matches with scores > 0.7

Return ONLY a JSON array of match objects in this format:
[
  {
    "attendee": "Person A Name",
    "match": "Person B Name", 
    "matchScore": 0.85,
    "whatYouShare": ["skill1", "interest1", "goal similarity"],
    "icebreakers": ["question1", "question2", "question3"],
    "matchConfidence": "High",
    "presenceStatus": {
      "attendee": "Present",
      "match": "Just Arrived"
    }
  }
]`;
      try {
        const response = await this.client.chat.completions.create({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.4,
          max_tokens: 3000,
        });
        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error('No response from OpenAI');
        const rawMatches = JSON.parse(content);
        // Enrich matches with full profile data
        const enrichedMatches: Match[] = rawMatches.map((match: any) => {
          const attendeeProfile = batch.find(p => p.name === match.attendee);
          const matchProfile = batch.find(p => p.name === match.match);
          if (!attendeeProfile || !matchProfile) {
            throw new Error(`Profile not found for match: ${match.attendee} <-> ${match.match}`);
          }
          return {
            ...match,
            attendeeProfile,
            matchProfile
          };
        });
        allMatches = allMatches.concat(enrichedMatches);
      } catch (error) {
        console.error('Error generating matches for batch:', error);
        throw error;
      }
    }
    return allMatches;
  }

  // 🧠 AI-POWERED CONVERSATION ASSISTANCE
  async getConversationSuggestions(profile1: Profile, profile2: Profile, context: string): Promise<ConversationSuggestion[]> {
    return this.conversationAgent.generateSuggestions(profile1, profile2, context);
  }

  // 🎯 NETWORKING STRATEGY RECOMMENDATIONS
  async getNetworkingStrategy(profile: Profile): Promise<NetworkingStrategy> {
    return this.strategyAgent.generateStrategy(profile);
  }

  // 🔮 CONVERSATION SUCCESS PREDICTION
  async predictConversationSuccess(profile1: Profile, profile2: Profile): Promise<number> {
    return this.predictionAgent.predictSuccess(profile1, profile2);
  }

  // 💬 SMART ICEBREAKER GENERATION
  async generateSmartIcebreakers(profile1: Profile, profile2: Profile, eventContext: string): Promise<string[]> {
    return this.conversationAgent.generateIcebreakers(profile1, profile2, eventContext);
  }
}

// 🤖 SPECIALIZED AI AGENT CLASSES

class PersonalityAnalysisAgent {
  private client: OpenAI;

  constructor(client: OpenAI) {
    this.client = client;
  }

  async analyzePersonality(profile: Profile): Promise<PersonalityInsights> {
    const prompt = `
You are an advanced AI personality analyst specializing in professional networking compatibility.

Analyze this professional profile and provide deep personality insights:

Profile:
${JSON.stringify(profile, null, 2)}

Return ONLY this JSON structure:
{
  "bigFiveTraits": {
    "openness": 0.8,
    "conscientiousness": 0.7,
    "extraversion": 0.6,
    "agreeableness": 0.9,
    "neuroticism": 0.2
  },
  "communicationStyle": {
    "primary": "Analytical",
    "secondary": "Collaborative",
    "preferredChannels": ["Email", "Video calls", "In-person"],
    "responseSpeed": "Thoughtful",
    "formalityLevel": "Professional-casual"
  },
  "workingStyle": {
    "decisionMaking": "Data-driven",
    "problemSolving": "Systematic",
    "teamRole": "Facilitator",
    "leadershipStyle": "Servant leader",
    "conflictResolution": "Diplomatic"
  },
  "networkingPersonality": {
    "approachStyle": "Warm and professional",
    "energyLevel": "Steady and engaging",
    "conversationPreference": "Deep and meaningful",
    "followUpStyle": "Consistent and thoughtful",
    "relationshipBuilding": "Long-term focused"
  },
  "compatibilityFactors": {
    "idealPartnerTraits": ["Innovative", "Collaborative", "Growth-minded"],
    "conversationTriggers": ["Technology trends", "Industry insights", "Career growth"],
    "potentialChallenges": ["Time management", "Technical depth"],
    "strengthAreas": ["Strategic thinking", "Team collaboration"]
  }
}

Analyze based on:
- Language patterns in their background
- Career progression and choices
- Skills and interests alignment
- Professional goals and aspirations
- Industry and role characteristics`;

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      // Remove Markdown code block markers if present
      const cleanedContent = content.replace(/^```json\s*|^```\s*|```$/gim, '').trim();

      return JSON.parse(cleanedContent) as PersonalityInsights;
    } catch (error) {
      console.error('Error analyzing personality:', error);
      throw error;
    }
  }
}

class ConversationAIAgent {
  private client: OpenAI;

  constructor(client: OpenAI) {
    this.client = client;
  }

  async generateSuggestions(profile1: Profile, profile2: Profile, context: string): Promise<ConversationSuggestion[]> {
    const prompt = `
You are an AI conversation coach specializing in professional networking.

Generate real-time conversation suggestions for these two professionals:

Person 1: ${JSON.stringify(profile1, null, 2)}
Person 2: ${JSON.stringify(profile2, null, 2)}
Context: ${context}

Return ONLY this JSON array:
[
  {
    "type": "icebreaker",
    "suggestion": "Ask about their experience with [specific technology/project]",
    "reasoning": "Both have experience in this area",
    "confidence": 0.9,
    "timing": "opening"
  },
  {
    "type": "follow-up",
    "suggestion": "Share your perspective on [relevant topic]",
    "reasoning": "Creates mutual value exchange",
    "confidence": 0.8,
    "timing": "mid-conversation"
  },
  {
    "type": "connection",
    "suggestion": "Mention your mutual interest in [shared interest]",
    "reasoning": "Builds personal connection",
    "confidence": 0.85,
    "timing": "relationship-building"
  }
]

Focus on:
- Shared professional interests
- Complementary skills and experience
- Mutual networking goals
- Cultural and communication compatibility
- Actionable conversation starters`;

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      return JSON.parse(content) as ConversationSuggestion[];
    } catch (error) {
      console.error('Error generating conversation suggestions:', error);
      throw error;
    }
  }

  async generateIcebreakers(profile1: Profile, profile2: Profile, eventContext: string): Promise<string[]> {
    const prompt = `
You are an expert networking conversation starter generator.

Create 5 highly personalized icebreakers for these professionals at this event:

Person 1: ${JSON.stringify(profile1, null, 2)}
Person 2: ${JSON.stringify(profile2, null, 2)}
Event: ${eventContext}

Return ONLY a JSON array of strings:
[
  "Personalized icebreaker 1",
  "Personalized icebreaker 2",
  "Personalized icebreaker 3",
  "Personalized icebreaker 4",
  "Personalized icebreaker 5"
]

Make each icebreaker:
- Specific to their backgrounds and interests
- Relevant to the event context
- Natural and conversational
- Professional but engaging
- Likely to lead to meaningful dialogue`;

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 800,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      return JSON.parse(content) as string[];
    } catch (error) {
      console.error('Error generating icebreakers:', error);
      throw error;
    }
  }
}

class NetworkingStrategyAgent {
  private client: OpenAI;

  constructor(client: OpenAI) {
    this.client = client;
  }

  async generateStrategy(profile: Profile): Promise<NetworkingStrategy> {
    const prompt = `
You are an AI networking strategist and career coach.

Create a personalized networking strategy for this professional:

Profile: ${JSON.stringify(profile, null, 2)}

Return ONLY this JSON structure:
{
  "primaryGoals": ["goal1", "goal2", "goal3"],
  "targetConnections": {
    "idealProfiles": ["profile type 1", "profile type 2"],
    "industries": ["industry1", "industry2"],
    "roles": ["role1", "role2"],
    "companies": ["company type 1", "company type 2"]
  },
  "conversationTopics": {
    "expertise": ["topic1", "topic2"],
    "learning": ["topic1", "topic2"],
    "trends": ["trend1", "trend2"]
  },
  "actionPlan": {
    "immediate": ["action1", "action2"],
    "shortTerm": ["action1", "action2"],
    "longTerm": ["action1", "action2"]
  },
  "valueProposition": "What unique value they bring to networking",
  "personalBrand": "How they should position themselves",
  "followUpStrategy": "Best practices for maintaining connections"
}

Analyze their:
- Career stage and trajectory
- Skills and expertise areas
- Professional goals and aspirations
- Industry and market position
- Networking personality and preferences`;

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 1200,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      return JSON.parse(content) as NetworkingStrategy;
    } catch (error) {
      console.error('Error generating networking strategy:', error);
      throw error;
    }
  }
}

class PredictionAgent {
  private client: OpenAI;

  constructor(client: OpenAI) {
    this.client = client;
  }

  async predictSuccess(profile1: Profile, profile2: Profile): Promise<number> {
    const prompt = `
You are an AI prediction engine specializing in professional relationship success.

Analyze these two profiles and predict the likelihood of a successful networking connection:

Person 1: ${JSON.stringify(profile1, null, 2)}
Person 2: ${JSON.stringify(profile2, null, 2)}

Consider:
- Personality compatibility
- Professional complementarity
- Communication style alignment
- Mutual value potential
- Career stage compatibility
- Industry relevance
- Geographic factors
- Networking goal alignment

Return ONLY a number between 0.0 and 1.0 representing the success probability.
Example: 0.85`;

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 50,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      const score = parseFloat(content.trim());
      return isNaN(score) ? 0.5 : Math.max(0, Math.min(1, score));
    } catch (error) {
      console.error('Error predicting success:', error);
      return 0.5; // Default neutral prediction
    }
  }
}
