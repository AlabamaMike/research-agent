export interface MarketAnalysisResult {
    marketSize: string;
    growthRate: string;
    keyTrends: string[];
    customerSegments: string[];
    entryBarriers: string[];
    opportunities: string[];
    risks: string[];
    recommendedStrategy: string;
}
export declare class MarketAnalysis {
    analyzeMarket(industry: string, region: string, analysisText: string): Promise<MarketAnalysisResult>;
    private extractMarketSize;
    private extractGrowthRate;
    private extractKeyTrends;
    private extractCustomerSegments;
    private extractEntryBarriers;
    private extractOpportunities;
    private extractRisks;
    private deriveStrategy;
    private cleanExtractedText;
}
//# sourceMappingURL=MarketAnalysis.d.ts.map