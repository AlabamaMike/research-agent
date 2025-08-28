"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyConsultant = void 0;
const claude_code_1 = require("@anthropic-ai/claude-code");
const SWOT_1 = require("./frameworks/SWOT");
const PortersFiveForces_1 = require("./frameworks/PortersFiveForces");
const MarketAnalysis_1 = require("./analysis/MarketAnalysis");
const CompetitiveAnalysis_1 = require("./analysis/CompetitiveAnalysis");
class StrategyConsultant {
    options;
    swotFramework;
    portersFramework;
    marketAnalysis;
    competitiveAnalysis;
    constructor() {
        this.options = {
            customSystemPrompt: `You are an elite strategy consultant with expertise in:
        - Business strategy and competitive analysis
        - Market entry and expansion strategies
        - Digital transformation and innovation
        - Financial analysis and valuation
        - Organizational design and change management
        
        Apply structured thinking using established frameworks like SWOT, Porter's Five Forces, 
        BCG Matrix, and PESTEL. Provide data-driven insights and actionable recommendations.
        
        When analyzing companies or markets:
        1. Start with context and industry overview
        2. Apply relevant frameworks systematically
        3. Identify key insights and patterns
        4. Provide specific, actionable recommendations
        5. Consider risks and mitigation strategies`,
            maxTurns: 10,
            allowedTools: ["WebSearch", "Read", "Write"]
        };
        this.swotFramework = new SWOT_1.SWOTFramework();
        this.portersFramework = new PortersFiveForces_1.PortersFiveForces();
        this.marketAnalysis = new MarketAnalysis_1.MarketAnalysis();
        this.competitiveAnalysis = new CompetitiveAnalysis_1.CompetitiveAnalysis();
    }
    async analyzeCompany(company, options = {}) {
        const framework = options.framework || 'swot';
        const depth = options.depth || 'standard';
        let analysisPrompt = this.buildAnalysisPrompt(company, framework, depth);
        let analysisResult = {};
        let recommendations = [];
        const messages = [];
        try {
            for await (const message of (0, claude_code_1.query)({
                prompt: analysisPrompt,
                options: this.options
            })) {
                if (message.type === 'assistant') {
                    const assistantMessage = message;
                    if (assistantMessage.message && assistantMessage.message.content) {
                        const content = assistantMessage.message.content;
                        if (typeof content === 'string') {
                            messages.push(content);
                        }
                        else if (Array.isArray(content)) {
                            for (const block of content) {
                                if (block.type === 'text') {
                                    messages.push(block.text);
                                }
                            }
                        }
                    }
                }
            }
            const fullResponse = messages.join('\n');
            switch (framework) {
                case 'swot':
                    analysisResult = await this.swotFramework.analyze(company, fullResponse);
                    break;
                case 'porters-five-forces':
                    analysisResult = await this.portersFramework.analyze(company, fullResponse);
                    break;
                default:
                    analysisResult = { raw: fullResponse };
            }
            recommendations = this.extractRecommendations(fullResponse);
        }
        catch (error) {
            console.error('Analysis failed:', error);
            throw new Error(`Failed to analyze ${company}: ${error}`);
        }
        return {
            framework,
            company,
            analysis: analysisResult,
            recommendations,
            timestamp: new Date()
        };
    }
    async analyzeMarketEntry(industry, region, company) {
        const prompt = `Analyze market entry opportunities for ${company || 'a new entrant'} 
                    in the ${industry} industry in ${region}. 
                    Consider market size, growth potential, competitive landscape, 
                    regulatory environment, and entry barriers.`;
        const messages = [];
        for await (const message of (0, claude_code_1.query)({ prompt, options: this.options })) {
            if (message.type === 'assistant') {
                const assistantMessage = message;
                if (assistantMessage.message && assistantMessage.message.content) {
                    const content = assistantMessage.message.content;
                    if (typeof content === 'string') {
                        messages.push(content);
                    }
                    else if (Array.isArray(content)) {
                        for (const block of content) {
                            if (block.type === 'text') {
                                messages.push(block.text);
                            }
                        }
                    }
                }
            }
        }
        const analysis = await this.marketAnalysis.analyzeMarket(industry, region, messages.join('\n'));
        return {
            framework: 'market-entry',
            industry,
            analysis,
            recommendations: this.extractRecommendations(messages.join('\n')),
            timestamp: new Date()
        };
    }
    async performCompetitiveAnalysis(company, competitors) {
        const prompt = `Perform a competitive analysis for ${company} against ${competitors.join(', ')}.
                    Analyze competitive positioning, market share, strengths/weaknesses,
                    strategic moves, and differentiation opportunities.`;
        const messages = [];
        for await (const message of (0, claude_code_1.query)({ prompt, options: this.options })) {
            if (message.type === 'assistant') {
                const assistantMessage = message;
                if (assistantMessage.message && assistantMessage.message.content) {
                    const content = assistantMessage.message.content;
                    if (typeof content === 'string') {
                        messages.push(content);
                    }
                    else if (Array.isArray(content)) {
                        for (const block of content) {
                            if (block.type === 'text') {
                                messages.push(block.text);
                            }
                        }
                    }
                }
            }
        }
        const analysis = await this.competitiveAnalysis.analyze(company, competitors, messages.join('\n'));
        return {
            framework: 'competitive-analysis',
            company,
            analysis,
            recommendations: this.extractRecommendations(messages.join('\n')),
            timestamp: new Date()
        };
    }
    async generateExecutiveSummary(analysis) {
        const prompt = `Generate an executive summary for the following analysis:
                    Framework: ${analysis.framework}
                    Company: ${analysis.company || 'N/A'}
                    Key Findings: ${JSON.stringify(analysis.analysis)}
                    
                    Format as a concise 1-page executive summary with:
                    - Situation Overview
                    - Key Findings (3-5 bullet points)
                    - Strategic Recommendations (3-5 actionable items)
                    - Next Steps`;
        const messages = [];
        for await (const message of (0, claude_code_1.query)({
            prompt,
            options: { ...this.options, maxTurns: 1 }
        })) {
            if (message.type === 'assistant') {
                const assistantMessage = message;
                if (assistantMessage.message && assistantMessage.message.content) {
                    const content = assistantMessage.message.content;
                    if (typeof content === 'string') {
                        messages.push(content);
                    }
                    else if (Array.isArray(content)) {
                        for (const block of content) {
                            if (block.type === 'text') {
                                messages.push(block.text);
                            }
                        }
                    }
                }
            }
        }
        return messages.join('\n');
    }
    buildAnalysisPrompt(company, framework, depth) {
        const depthInstructions = {
            quick: 'Provide a high-level analysis with key points only.',
            standard: 'Provide a balanced analysis with moderate detail.',
            comprehensive: 'Provide an in-depth analysis with extensive detail and examples.'
        };
        const frameworkPrompts = {
            'swot': `Conduct a SWOT analysis for ${company}. 
               Identify internal Strengths and Weaknesses, 
               and external Opportunities and Threats.`,
            'porters-five-forces': `Analyze ${company} using Porter's Five Forces framework.
                              Assess: Competitive Rivalry, Supplier Power, Buyer Power,
                              Threat of Substitution, and Threat of New Entry.`,
            'bcg-matrix': `Analyze ${company}'s product portfolio using the BCG Matrix.
                     Categorize products/business units as Stars, Cash Cows, 
                     Question Marks, or Dogs based on market growth and market share.`,
            'pestel': `Conduct a PESTEL analysis for ${company}.
                 Examine Political, Economic, Social, Technological, 
                 Environmental, and Legal factors affecting the business.`
        };
        return `${frameworkPrompts[framework] || frameworkPrompts['swot']}
            ${depthInstructions[depth] || depthInstructions['standard']}
            Include specific data points where possible and provide actionable insights.`;
    }
    extractRecommendations(response) {
        const recommendations = [];
        const lines = response.split('\n');
        let inRecommendations = false;
        for (const line of lines) {
            if (line.toLowerCase().includes('recommend') ||
                line.toLowerCase().includes('suggestion') ||
                line.toLowerCase().includes('action')) {
                inRecommendations = true;
            }
            if (inRecommendations && line.trim().startsWith('-')) {
                recommendations.push(line.trim().substring(1).trim());
            }
            if (recommendations.length >= 5)
                break;
        }
        if (recommendations.length === 0) {
            recommendations.push('Further analysis recommended');
        }
        return recommendations;
    }
}
exports.StrategyConsultant = StrategyConsultant;
//# sourceMappingURL=StrategyConsultant.js.map