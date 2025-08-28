"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompetitiveAnalysis = void 0;
class CompetitiveAnalysis {
    async analyze(company, competitors, analysisText) {
        const mainCompany = this.analyzeCompany(company, analysisText);
        const competitorAnalysis = competitors.map(comp => this.analyzeCompany(comp, analysisText));
        return {
            mainCompany,
            competitors: competitorAnalysis,
            competitiveDynamics: this.assessDynamics(analysisText),
            differentiationOpportunities: this.identifyDifferentiation(analysisText),
            strategicMoves: this.extractStrategicMoves(analysisText),
            recommendations: this.generateRecommendations(mainCompany, competitorAnalysis)
        };
    }
    analyzeCompany(company, text) {
        const companySection = this.extractCompanySection(company, text);
        return {
            company,
            marketShare: this.extractMarketShare(company, companySection),
            strengths: this.extractStrengths(companySection),
            weaknesses: this.extractWeaknesses(companySection),
            strategy: this.identifyStrategy(companySection)
        };
    }
    extractCompanySection(company, text) {
        const lines = text.split('\n');
        const companyLines = [];
        let capturing = false;
        for (const line of lines) {
            if (line.toLowerCase().includes(company.toLowerCase())) {
                capturing = true;
            }
            if (capturing) {
                companyLines.push(line);
                if (companyLines.length > 20)
                    break;
            }
        }
        return companyLines.length > 0 ? companyLines.join('\n') : text;
    }
    extractMarketShare(company, text) {
        const patterns = [
            new RegExp(`${company}.*?(\\d+(?:\\.\\d+)?%)`, 'i'),
            /market share.*?(\\d+(?:\\.\\d+)?%)/i,
            /(\\d+(?:\\.\\d+)?%)\s*market/i
        ];
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match)
                return match[1];
        }
        return 'Not specified';
    }
    extractStrengths(text) {
        const strengths = [];
        const positiveKeywords = [
            'strong', 'leading', 'advantage', 'superior',
            'innovative', 'efficient', 'dominant', 'excellent'
        ];
        const lines = text.split('\n');
        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            if (positiveKeywords.some(keyword => lowerLine.includes(keyword))) {
                const cleaned = this.cleanText(line);
                if (cleaned.length > 10) {
                    strengths.push(cleaned);
                }
            }
        }
        return strengths.slice(0, 4);
    }
    extractWeaknesses(text) {
        const weaknesses = [];
        const negativeKeywords = [
            'weak', 'challenge', 'lack', 'limited',
            'behind', 'struggle', 'disadvantage', 'gap'
        ];
        const lines = text.split('\n');
        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            if (negativeKeywords.some(keyword => lowerLine.includes(keyword))) {
                const cleaned = this.cleanText(line);
                if (cleaned.length > 10) {
                    weaknesses.push(cleaned);
                }
            }
        }
        return weaknesses.slice(0, 4);
    }
    identifyStrategy(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('low cost') || lowerText.includes('price leader')) {
            return 'Cost leadership';
        }
        else if (lowerText.includes('premium') || lowerText.includes('differentiat')) {
            return 'Differentiation';
        }
        else if (lowerText.includes('niche') || lowerText.includes('focus')) {
            return 'Focus/Niche';
        }
        else if (lowerText.includes('innovation') || lowerText.includes('disrupt')) {
            return 'Innovation-driven';
        }
        return 'Hybrid strategy';
    }
    assessDynamics(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('intense competition') || lowerText.includes('price war')) {
            return 'Highly competitive with price pressure';
        }
        else if (lowerText.includes('consolidat')) {
            return 'Market consolidation underway';
        }
        else if (lowerText.includes('fragment')) {
            return 'Fragmented market with opportunities';
        }
        else if (lowerText.includes('oligopol')) {
            return 'Oligopolistic with few dominant players';
        }
        return 'Stable competitive environment';
    }
    identifyDifferentiation(text) {
        const opportunities = [];
        const keywords = [
            'customer experience',
            'technology',
            'sustainability',
            'service quality',
            'innovation',
            'brand',
            'distribution',
            'partnership'
        ];
        for (const keyword of keywords) {
            if (text.toLowerCase().includes(keyword)) {
                opportunities.push(`Enhance ${keyword} capabilities`);
            }
        }
        return opportunities.slice(0, 5);
    }
    extractStrategicMoves(text) {
        const moves = [];
        const actionKeywords = [
            'expand', 'acquire', 'partner', 'launch',
            'invest', 'develop', 'enter', 'exit'
        ];
        const lines = text.split('\n');
        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            if (actionKeywords.some(keyword => lowerLine.includes(keyword))) {
                const cleaned = this.cleanText(line);
                if (cleaned.length > 15) {
                    moves.push(cleaned);
                }
            }
        }
        return moves.slice(0, 5);
    }
    generateRecommendations(mainCompany, competitors) {
        const recommendations = [];
        if (mainCompany.strengths.length > mainCompany.weaknesses.length) {
            recommendations.push('Leverage core strengths to expand market position');
        }
        else {
            recommendations.push('Address key weaknesses to improve competitive standing');
        }
        const avgCompetitorStrengths = competitors.reduce((sum, c) => sum + c.strengths.length, 0) / (competitors.length || 1);
        if (mainCompany.strengths.length < avgCompetitorStrengths) {
            recommendations.push('Invest in capability building to match competitor strengths');
        }
        if (mainCompany.strategy === 'Cost leadership') {
            recommendations.push('Optimize operations to maintain cost advantage');
        }
        else if (mainCompany.strategy === 'Differentiation') {
            recommendations.push('Continue innovation to justify premium positioning');
        }
        recommendations.push('Monitor competitor moves and respond strategically');
        return recommendations.slice(0, 5);
    }
    cleanText(text) {
        return text
            .replace(/^[-•*\d.]+\s*/, '')
            .replace(/^\w+:\s*/, '')
            .trim();
    }
}
exports.CompetitiveAnalysis = CompetitiveAnalysis;
//# sourceMappingURL=CompetitiveAnalysis.js.map