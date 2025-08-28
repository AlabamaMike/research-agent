export interface ConsultingOptions {
    framework?: 'swot' | 'porters-five-forces' | 'bcg-matrix' | 'pestel';
    depth?: 'quick' | 'standard' | 'comprehensive';
    outputFormat?: 'markdown' | 'json' | 'executive-summary';
}
export interface AnalysisResult {
    framework: string;
    company?: string;
    industry?: string;
    analysis: any;
    recommendations: string[];
    timestamp: Date;
}
/**
 * Demonstration version of StrategyConsultant that works without Claude Code API
 * This version provides mock analysis data for testing purposes
 */
export declare class StrategyConsultantDemo {
    private swotFramework;
    private portersFramework;
    private marketAnalysis;
    private competitiveAnalysis;
    constructor();
    analyzeCompany(company: string, options?: ConsultingOptions): Promise<AnalysisResult>;
    analyzeMarketEntry(industry: string, region: string, company?: string): Promise<AnalysisResult>;
    performCompetitiveAnalysis(company: string, competitors: string[]): Promise<AnalysisResult>;
    generateExecutiveSummary(analysis: AnalysisResult): Promise<string>;
    private generateMockAnalysis;
    private generateMockMarketAnalysis;
    private generateMockCompetitiveAnalysis;
    private extractRecommendations;
    private formatFrameworkName;
    private formatKeyFindings;
    private simulateDelay;
}
//# sourceMappingURL=StrategyConsultantDemo.d.ts.map