# 🤖 MeetGenius AI Matchmaker

**AI-Powered Networking for AI Demo Night - July 9, 2025**

MeetGenius is an intelligent matchmaking system that parses LinkedIn-style resumes, understands professional backgrounds and networking goals, and produces high-quality matches for live networking events.

## 🌟 Features

- **AI Resume Parsing**: Extracts structured profiles from PDF resumes using OpenAI GPT-4
- **Intelligent Matching**: Multi-factor compatibility scoring based on skills, goals, and experience
- **Dark Theme UI**: Sleek, modern interface optimized for demo presentations
- **Real-time Presence**: Simulated live event status for attendees
- **Interactive Match Cards**: Detailed match explanations with conversation starters

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- OpenAI API Key
- PDF resume files in the parent directory

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set your OpenAI API key**:
   ```bash
   export OPENAI_API_KEY="your-openai-api-key-here"
   ```

3. **Process the resumes** (this will parse PDFs and generate matches):
   ```bash
   npm run process-resumes
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open the app**: Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
meetgenius-matcher/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/matches/     # API route for matches data
│   │   └── page.tsx         # Main application page
│   ├── components/          # React components
│   │   ├── Header.tsx       # Event header component
│   │   └── MatchCard.tsx    # Match display component
│   ├── utils/               # Utility functions
│   │   ├── pdfParser.ts     # PDF parsing logic
│   │   ├── openaiAgent.ts   # OpenAI integration
│   │   └── matchingEngine.ts # Matching algorithm
│   ├── types/               # TypeScript interfaces
│   ├── scripts/             # Processing scripts
│   └── data/                # Generated data files
└── ../Profile (*.pdf)       # Resume PDF files
```

## 🧠 How It Works

### 1. Resume Parsing
- Reads PDF files from the parent directory
- Uses OpenAI GPT-4 to extract structured data:
  - Name, title, company, location
  - Skills, certifications, experience
  - Inferred networking goals

### 2. Intelligent Matching
- Multi-factor compatibility scoring:
  - Domain/industry overlap
  - Complementary roles (founder ↔ engineer)
  - Shared skills and tools
  - Compatible networking goals
  - Location proximity bonus
  - Certification overlap

### 3. Match Generation
- Each attendee gets exactly one high-quality match
- AI generates conversation starters and shared topics
- Confidence scoring (Low/Medium/High)
- Simulated presence status

## 🎯 Demo Day Usage

Perfect for live demonstrations at networking events:

1. **Pre-event**: Process attendee resumes with `npm run process-resumes`
2. **During event**: Display matches on screens or individual devices
3. **Interactive**: Attendees can see their matches and conversation starters
4. **Real-time feel**: Simulated presence updates create live event atmosphere

## 🔧 Configuration

### Environment Variables
- `OPENAI_API_KEY`: Required for AI processing

### Customization
- Modify matching weights in `src/utils/matchingEngine.ts`
- Update event details in `src/app/page.tsx`
- Customize UI theme in `src/app/globals.css`

## 📊 Output Files

After running `npm run process-resumes`:
- `src/data/parsed_profiles.json`: Structured profile data
- `src/data/matches.json`: Generated matches with explanations

## 🎨 UI Components

- **Header**: Event branding with live status indicator
- **MatchCard**: Individual match display with:
  - Match score and confidence level
  - Attendee profiles with presence status
  - Shared interests and skills
  - AI-generated conversation starters
  - Expandable details view

## 🚀 Deployment

Ready for deployment on Vercel, Netlify, or any Node.js hosting platform:

```bash
npm run build
npm start
```

## 🤝 Contributing

Built for AI Demo Night 2025 - contributions welcome for future networking events!

## 📝 License

MIT License - Perfect for demo and educational use.
