# Strategy Consulting Agent

An AI-powered strategy consulting agent built with the Claude Code SDK. This agent provides professional-grade strategic analysis using established business frameworks like SWOT, Porter's Five Forces, and more.

## Features

- 🎯 **Multiple Strategic Frameworks**
  - SWOT Analysis
  - Porter's Five Forces
  - Market Entry Analysis
  - Competitive Analysis
  - BCG Matrix (coming soon)
  - PESTEL Analysis (coming soon)

- 📊 **Comprehensive Analysis**
  - Company strategic assessment
  - Market opportunity evaluation
  - Competitive landscape mapping
  - Industry attractiveness analysis

- 📝 **Professional Reports**
  - Executive summaries
  - Detailed framework analysis
  - Actionable recommendations
  - Markdown and JSON output formats

## Installation

### Prerequisites

- Node.js 18+ 
- Claude Code SDK (@anthropic-ai/claude-code)
- Valid Anthropic API key or OAUTH token

### Setup

1. Clone this repository:
```bash
git clone https://github.com/yourusername/strategy-consulting-agent.git
cd strategy-consulting-agent
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Set up your Anthropic API key:
```bash
export ANTHROPIC_API_KEY=your-api-key-here
# OR
export CLAUDE_CODE_OAUTH_TOKEN=your-oauth-token-here
```

5. Run the agent:
```bash
npm start
# or directly:
node dist/cli.js
```

## Usage

### Interactive Mode

Start the agent without any arguments for an interactive experience:

```bash
strategy-agent
```

### Command Line Interface

#### Company Analysis
Analyze a company using strategic frameworks:

```bash
# SWOT Analysis
strategy-agent analyze --company "Tesla" --framework swot

# Porter's Five Forces
strategy-agent analyze --company "Apple" --framework porters-five-forces --depth comprehensive

# Save to file
strategy-agent analyze --company "Microsoft" --framework swot --output analysis.md
```

#### Market Entry Analysis
Evaluate market entry opportunities:

```bash
# Basic market analysis
strategy-agent market-entry --industry "renewable energy" --region "Europe"

# With specific company context
strategy-agent market-entry --industry "electric vehicles" --region "Southeast Asia" --company "BYD"
```

#### Competitive Analysis
Perform competitive landscape assessment:

```bash
# Compare against competitors
strategy-agent competitive-analysis --company "Netflix" --competitors "Disney+,HBO Max,Amazon Prime"

# Save detailed report
strategy-agent competitive-analysis --company "Spotify" --competitors "Apple Music,YouTube Music" --output competitive-report.md
```

### Options

- `--framework, -f`: Analysis framework (swot, porters-five-forces, bcg-matrix, pestel)
- `--depth, -d`: Analysis depth (quick, standard, comprehensive)
- `--output, -o`: Output file path for saving reports
- `--company, -c`: Company name to analyze
- `--competitors, -p`: Comma-separated list of competitors
- `--industry, -i`: Industry for market analysis
- `--region, -r`: Geographic region for market entry

## Programmatic Usage

You can also use the agent programmatically in your TypeScript/JavaScript projects:

```typescript
import { StrategyConsultant } from 'strategy-consulting-agent';

const consultant = new StrategyConsultant();

// Perform SWOT analysis
const swotAnalysis = await consultant.analyzeCompany('Tesla', {
  framework: 'swot',
  depth: 'comprehensive'
});

// Market entry analysis
const marketAnalysis = await consultant.analyzeMarketEntry(
  'renewable energy',
  'Europe',
  'NewEnergyCo'
);

// Generate executive summary
const summary = await consultant.generateExecutiveSummary(swotAnalysis);
console.log(summary);
```

## Examples

### Example 1: Tech Company SWOT Analysis
```bash
strategy-agent analyze --company "OpenAI" --framework swot --depth comprehensive
```

This generates a comprehensive SWOT analysis including:
- Internal strengths and weaknesses
- External opportunities and threats
- Strategic implications
- Key recommendations

### Example 2: Industry Attractiveness Assessment
```bash
strategy-agent analyze --company "Uber" --framework porters-five-forces
```

Evaluates industry attractiveness by analyzing:
- Competitive rivalry intensity
- Supplier and buyer bargaining power
- Threat of new entrants and substitutes
- Overall market attractiveness rating

### Example 3: Market Entry Strategy
```bash
strategy-agent market-entry --industry "cloud computing" --region "Latin America" --company "AWS"
```

Provides insights on:
- Market size and growth potential
- Key market trends
- Customer segments
- Entry barriers and risks
- Recommended entry strategy

## Project Structure

```
strategy-consulting-agent/
├── src/
│   ├── agent/
│   │   ├── StrategyConsultant.ts    # Main agent orchestrator
│   │   ├── frameworks/              # Strategic framework implementations
│   │   │   ├── SWOT.ts
│   │   │   └── PortersFiveForces.ts
│   │   └── analysis/                # Analysis modules
│   │       ├── MarketAnalysis.ts
│   │       └── CompetitiveAnalysis.ts
│   ├── tools/
│   │   └── ReportGenerator.ts      # Report generation utilities
│   ├── cli.ts                      # CLI interface
│   └── index.ts                    # Main exports
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Building
```bash
npm run build
```

### Development Mode
```bash
npm run dev  # Watch mode for development
```

### Testing
```bash
npm test  # Run test suite (when implemented)
```

### Linting
```bash
npm run lint      # Check for linting issues
npm run typecheck # TypeScript type checking
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Areas for contribution:

- Additional strategic frameworks (BCG Matrix, PESTEL, Ansoff Matrix)
- Enhanced data integration capabilities
- Visualization support
- Additional output formats (PDF, HTML)
- Test coverage
- Performance optimizations

## Troubleshooting

### API Key Issues
If you see an error about missing API key:
1. Ensure your `ANTHROPIC_API_KEY` or `CLAUDE_CODE_OAUTH_TOKEN` is set
2. Check that the Claude Code SDK is properly installed globally
3. Verify your API key has sufficient permissions

### Build Errors
1. Make sure you have Node.js 18+ installed
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. Ensure TypeScript is installed: `npm install -g typescript`

## License

MIT

## Acknowledgments

Built with the [Claude Code SDK](https://docs.anthropic.com/claude-code) by Anthropic
