import { AnalysisResult } from '../agent/StrategyConsultant';
export declare class ReportGenerator {
    private swotFramework;
    private portersFramework;
    constructor();
    generateReport(analysis: AnalysisResult): Promise<string>;
    private generateHeader;
    private generateExecutiveSummary;
    private formatMainAnalysis;
    private formatSWOTAnalysis;
    private formatPortersAnalysis;
    private formatMarketAnalysis;
    private formatCompetitiveAnalysis;
    private formatGenericAnalysis;
    private formatRecommendations;
    private generateActionItems;
    private formatFrameworkName;
    private generateFooter;
}
//# sourceMappingURL=ReportGenerator.d.ts.map