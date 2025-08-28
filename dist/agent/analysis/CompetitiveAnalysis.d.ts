export interface CompetitivePosition {
    company: string;
    marketShare: string;
    strengths: string[];
    weaknesses: string[];
    strategy: string;
}
export interface CompetitiveAnalysisResult {
    mainCompany: CompetitivePosition;
    competitors: CompetitivePosition[];
    competitiveDynamics: string;
    differentiationOpportunities: string[];
    strategicMoves: string[];
    recommendations: string[];
}
export declare class CompetitiveAnalysis {
    analyze(company: string, competitors: string[], analysisText: string): Promise<CompetitiveAnalysisResult>;
    private analyzeCompany;
    private extractCompanySection;
    private extractMarketShare;
    private extractStrengths;
    private extractWeaknesses;
    private identifyStrategy;
    private assessDynamics;
    private identifyDifferentiation;
    private extractStrategicMoves;
    private generateRecommendations;
    private cleanText;
}
//# sourceMappingURL=CompetitiveAnalysis.d.ts.map