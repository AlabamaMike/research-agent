export interface FiveForces {
    competitiveRivalry: {
        intensity: 'low' | 'moderate' | 'high';
        factors: string[];
        assessment: string;
    };
    supplierPower: {
        level: 'low' | 'moderate' | 'high';
        factors: string[];
        assessment: string;
    };
    buyerPower: {
        level: 'low' | 'moderate' | 'high';
        factors: string[];
        assessment: string;
    };
    threatOfSubstitutes: {
        level: 'low' | 'moderate' | 'high';
        factors: string[];
        assessment: string;
    };
    threatOfNewEntrants: {
        level: 'low' | 'moderate' | 'high';
        barriers: string[];
        assessment: string;
    };
    overallAttractiveness: 'very low' | 'low' | 'moderate' | 'high' | 'very high';
    strategicRecommendations: string[];
}
export declare class PortersFiveForces {
    analyze(company: string, analysisText: string): Promise<FiveForces>;
    private parseForces;
    private identifySections;
    private parseCompetitiveRivalry;
    private parseSupplierPower;
    private parseBuyerPower;
    private parseThreatOfSubstitutes;
    private parseThreatOfNewEntrants;
    private detectIntensity;
    private extractFactors;
    private generateAssessment;
    private calculateAttractiveness;
    private generateRecommendations;
    formatAsMarkdown(analysis: FiveForces, company: string): string;
}
//# sourceMappingURL=PortersFiveForces.d.ts.map