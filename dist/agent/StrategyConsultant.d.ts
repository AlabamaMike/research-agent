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
export declare class StrategyConsultant {
    private options;
    private swotFramework;
    private portersFramework;
    private marketAnalysis;
    private competitiveAnalysis;
    constructor();
    analyzeCompany(company: string, options?: ConsultingOptions): Promise<AnalysisResult>;
    analyzeMarketEntry(industry: string, region: string, company?: string): Promise<AnalysisResult>;
    performCompetitiveAnalysis(company: string, competitors: string[]): Promise<AnalysisResult>;
    generateExecutiveSummary(analysis: AnalysisResult): Promise<string>;
    private buildAnalysisPrompt;
    private extractRecommendations;
}
//# sourceMappingURL=StrategyConsultant.d.ts.map