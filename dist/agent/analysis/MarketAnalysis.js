"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketAnalysis = void 0;
class MarketAnalysis {
    async analyzeMarket(industry, region, analysisText) {
        return {
            marketSize: this.extractMarketSize(analysisText),
            growthRate: this.extractGrowthRate(analysisText),
            keyTrends: this.extractKeyTrends(analysisText),
            customerSegments: this.extractCustomerSegments(analysisText),
            entryBarriers: this.extractEntryBarriers(analysisText),
            opportunities: this.extractOpportunities(analysisText),
            risks: this.extractRisks(analysisText),
            recommendedStrategy: this.deriveStrategy(analysisText, industry, region)
        };
    }
    extractMarketSize(text) {
        const patterns = [
            /market size.*?(\$[\d.,]+\s*[BMT])/i,
            /valued at.*?(\$[\d.,]+\s*[BMT])/i,
            /market.*?worth.*?(\$[\d.,]+\s*[BMT])/i
        ];
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match)
                return match[1];
        }
        return 'Data not specified';
    }
    extractGrowthRate(text) {
        const patterns = [
            /CAGR.*?([\d.]+%)/i,
            /growth rate.*?([\d.]+%)/i,
            /growing at.*?([\d.]+%)/i,
            /annual growth.*?([\d.]+%)/i
        ];
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match)
                return match[1];
        }
        return 'Data not specified';
    }
    extractKeyTrends(text) {
        const trends = [];
        const keywords = [
            'digital transformation',
            'sustainability',
            'automation',
            'ai adoption',
            'customer experience',
            'consolidation',
            'regulation',
            'innovation'
        ];
        const lines = text.split('\n');
        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            if (lowerLine.includes('trend') || keywords.some(k => lowerLine.includes(k))) {
                const trimmed = line.trim();
                if (trimmed.length > 20 && trimmed.length < 200) {
                    trends.push(this.cleanExtractedText(trimmed));
                }
            }
        }
        return trends.slice(0, 5);
    }
    extractCustomerSegments(text) {
        const segments = [];
        const lines = text.split('\n');
        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            if (lowerLine.includes('segment') || lowerLine.includes('customer') ||
                lowerLine.includes('market') || lowerLine.includes('demographic')) {
                const trimmed = this.cleanExtractedText(line.trim());
                if (trimmed.length > 10 && trimmed.length < 100) {
                    segments.push(trimmed);
                }
            }
        }
        return segments.slice(0, 5);
    }
    extractEntryBarriers(text) {
        const barriers = [];
        const keywords = [
            'capital requirement',
            'regulation',
            'brand loyalty',
            'economies of scale',
            'distribution',
            'technology',
            'patent',
            'licensing'
        ];
        const lines = text.split('\n');
        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            if (lowerLine.includes('barrier') || keywords.some(k => lowerLine.includes(k))) {
                const trimmed = this.cleanExtractedText(line.trim());
                if (trimmed.length > 10) {
                    barriers.push(trimmed);
                }
            }
        }
        return barriers.slice(0, 5);
    }
    extractOpportunities(text) {
        const opportunities = [];
        const lines = text.split('\n');
        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            if (lowerLine.includes('opportunity') || lowerLine.includes('potential') ||
                lowerLine.includes('growth') || lowerLine.includes('expand')) {
                const trimmed = this.cleanExtractedText(line.trim());
                if (trimmed.length > 15) {
                    opportunities.push(trimmed);
                }
            }
        }
        return opportunities.slice(0, 5);
    }
    extractRisks(text) {
        const risks = [];
        const lines = text.split('\n');
        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            if (lowerLine.includes('risk') || lowerLine.includes('threat') ||
                lowerLine.includes('challenge') || lowerLine.includes('concern')) {
                const trimmed = this.cleanExtractedText(line.trim());
                if (trimmed.length > 15) {
                    risks.push(trimmed);
                }
            }
        }
        return risks.slice(0, 5);
    }
    deriveStrategy(text, industry, region) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('high growth') && lowerText.includes('low competition')) {
            return 'Aggressive market entry with rapid scaling';
        }
        else if (lowerText.includes('mature market')) {
            return 'Differentiation through innovation or niche targeting';
        }
        else if (lowerText.includes('high competition')) {
            return 'Cost leadership or focused differentiation strategy';
        }
        else if (lowerText.includes('emerging market')) {
            return 'Phased entry with local partnerships';
        }
        return 'Balanced approach with careful market testing';
    }
    cleanExtractedText(text) {
        return text
            .replace(/^[-•*\d.]+\s*/, '')
            .replace(/^\w+:\s*/, '')
            .trim();
    }
}
exports.MarketAnalysis = MarketAnalysis;
//# sourceMappingURL=MarketAnalysis.js.map