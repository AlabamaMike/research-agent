export interface SWOTAnalysis {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    keyInsights: string[];
    strategicImplications: string;
}
export declare class SWOTFramework {
    analyze(company: string, analysisText: string): Promise<SWOTAnalysis>;
    private parseSections;
    private extractPoints;
    private generateKeyInsights;
    private deriveStrategicImplications;
    formatAsMarkdown(analysis: SWOTAnalysis, company: string): string;
}
//# sourceMappingURL=SWOT.d.ts.map