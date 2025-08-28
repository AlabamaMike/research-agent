import { AnalysisResult } from '../agent/StrategyConsultant';
import { SWOTFramework } from '../agent/frameworks/SWOT';
import { PortersFiveForces } from '../agent/frameworks/PortersFiveForces';

export class ReportGenerator {
  private swotFramework: SWOTFramework;
  private portersFramework: PortersFiveForces;

  constructor() {
    this.swotFramework = new SWOTFramework();
    this.portersFramework = new PortersFiveForces();
  }

  async generateReport(analysis: AnalysisResult): Promise<string> {
    const header = this.generateHeader(analysis);
    const executiveSummary = await this.generateExecutiveSummary(analysis);
    const mainAnalysis = this.formatMainAnalysis(analysis);
    const recommendations = this.formatRecommendations(analysis.recommendations);
    const footer = this.generateFooter();

    return `${header}\n${executiveSummary}\n${mainAnalysis}\n${recommendations}\n${footer}`;
  }

  private generateHeader(analysis: AnalysisResult): string {
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `# Strategic Analysis Report

**Date:** ${date}  
**Company:** ${analysis.company || 'N/A'}  
**Industry:** ${analysis.industry || 'N/A'}  
**Framework:** ${this.formatFrameworkName(analysis.framework)}  

---
`;
  }

  private async generateExecutiveSummary(analysis: AnalysisResult): Promise<string> {
    let summary = '## Executive Summary\n\n';
    
    if (analysis.company) {
      summary += `This report presents a comprehensive strategic analysis of ${analysis.company} `;
    } else if (analysis.industry) {
      summary += `This report analyzes market entry opportunities in the ${analysis.industry} industry `;
    } else {
      summary += 'This strategic analysis ';
    }
    
    summary += `using the ${this.formatFrameworkName(analysis.framework)} framework.\n\n`;
    
    summary += '### Key Findings\n';
    
    if (analysis.framework === 'swot' && analysis.analysis.strengths) {
      const topStrengths = analysis.analysis.strengths.slice(0, 2);
      const topWeaknesses = analysis.analysis.weaknesses.slice(0, 2);
      
      if (topStrengths.length > 0) {
        summary += `- **Key Strengths:** ${topStrengths.join('; ')}\n`;
      }
      if (topWeaknesses.length > 0) {
        summary += `- **Main Challenges:** ${topWeaknesses.join('; ')}\n`;
      }
    } else if (analysis.framework === 'porters-five-forces' && analysis.analysis.overallAttractiveness) {
      summary += `- **Industry Attractiveness:** ${analysis.analysis.overallAttractiveness}\n`;
      summary += `- **Competitive Intensity:** ${analysis.analysis.competitiveRivalry?.intensity || 'moderate'}\n`;
    } else if (analysis.framework === 'market-entry') {
      if (analysis.analysis.marketSize) {
        summary += `- **Market Size:** ${analysis.analysis.marketSize}\n`;
      }
      if (analysis.analysis.growthRate) {
        summary += `- **Growth Rate:** ${analysis.analysis.growthRate}\n`;
      }
    }
    
    summary += '\n### Strategic Direction\n';
    if (analysis.recommendations && analysis.recommendations.length > 0) {
      summary += analysis.recommendations[0] + '\n';
    }
    
    return summary + '\n---\n';
  }

  private formatMainAnalysis(analysis: AnalysisResult): string {
    let formatted = '## Detailed Analysis\n\n';
    
    switch (analysis.framework) {
      case 'swot':
        formatted += this.formatSWOTAnalysis(analysis.analysis, analysis.company || '');
        break;
      
      case 'porters-five-forces':
        formatted += this.formatPortersAnalysis(analysis.analysis, analysis.company || '');
        break;
      
      case 'market-entry':
        formatted += this.formatMarketAnalysis(analysis.analysis);
        break;
      
      case 'competitive-analysis':
        formatted += this.formatCompetitiveAnalysis(analysis.analysis);
        break;
      
      default:
        formatted += this.formatGenericAnalysis(analysis.analysis);
    }
    
    return formatted;
  }

  private formatSWOTAnalysis(analysis: any, company: string): string {
    if (!analysis.strengths) {
      return this.formatGenericAnalysis(analysis);
    }
    
    return this.swotFramework.formatAsMarkdown(analysis, company);
  }

  private formatPortersAnalysis(analysis: any, company: string): string {
    if (!analysis.competitiveRivalry) {
      return this.formatGenericAnalysis(analysis);
    }
    
    return this.portersFramework.formatAsMarkdown(analysis, company);
  }

  private formatMarketAnalysis(analysis: any): string {
    let formatted = '### Market Overview\n\n';
    
    if (analysis.marketSize) {
      formatted += `**Market Size:** ${analysis.marketSize}\n\n`;
    }
    if (analysis.growthRate) {
      formatted += `**Growth Rate:** ${analysis.growthRate}\n\n`;
    }
    
    if (analysis.keyTrends && analysis.keyTrends.length > 0) {
      formatted += '### Key Market Trends\n';
      analysis.keyTrends.forEach((trend: string) => {
        formatted += `- ${trend}\n`;
      });
      formatted += '\n';
    }
    
    if (analysis.customerSegments && analysis.customerSegments.length > 0) {
      formatted += '### Customer Segments\n';
      analysis.customerSegments.forEach((segment: string) => {
        formatted += `- ${segment}\n`;
      });
      formatted += '\n';
    }
    
    if (analysis.entryBarriers && analysis.entryBarriers.length > 0) {
      formatted += '### Entry Barriers\n';
      analysis.entryBarriers.forEach((barrier: string) => {
        formatted += `- ${barrier}\n`;
      });
      formatted += '\n';
    }
    
    if (analysis.opportunities && analysis.opportunities.length > 0) {
      formatted += '### Market Opportunities\n';
      analysis.opportunities.forEach((opp: string) => {
        formatted += `- ${opp}\n`;
      });
      formatted += '\n';
    }
    
    if (analysis.risks && analysis.risks.length > 0) {
      formatted += '### Market Risks\n';
      analysis.risks.forEach((risk: string) => {
        formatted += `- ${risk}\n`;
      });
      formatted += '\n';
    }
    
    if (analysis.recommendedStrategy) {
      formatted += `### Recommended Market Entry Strategy\n${analysis.recommendedStrategy}\n\n`;
    }
    
    return formatted;
  }

  private formatCompetitiveAnalysis(analysis: any): string {
    let formatted = '### Competitive Landscape\n\n';
    
    if (analysis.competitiveDynamics) {
      formatted += `**Market Dynamics:** ${analysis.competitiveDynamics}\n\n`;
    }
    
    if (analysis.mainCompany) {
      formatted += `### ${analysis.mainCompany.company} Position\n`;
      if (analysis.mainCompany.marketShare !== 'Not specified') {
        formatted += `**Market Share:** ${analysis.mainCompany.marketShare}\n`;
      }
      if (analysis.mainCompany.strategy) {
        formatted += `**Strategy:** ${analysis.mainCompany.strategy}\n`;
      }
      
      if (analysis.mainCompany.strengths.length > 0) {
        formatted += '\n**Strengths:**\n';
        analysis.mainCompany.strengths.forEach((s: string) => {
          formatted += `- ${s}\n`;
        });
      }
      
      if (analysis.mainCompany.weaknesses.length > 0) {
        formatted += '\n**Weaknesses:**\n';
        analysis.mainCompany.weaknesses.forEach((w: string) => {
          formatted += `- ${w}\n`;
        });
      }
      formatted += '\n';
    }
    
    if (analysis.competitors && analysis.competitors.length > 0) {
      formatted += '### Competitor Analysis\n';
      analysis.competitors.forEach((comp: any) => {
        formatted += `\n#### ${comp.company}\n`;
        if (comp.marketShare !== 'Not specified') {
          formatted += `**Market Share:** ${comp.marketShare}\n`;
        }
        if (comp.strategy) {
          formatted += `**Strategy:** ${comp.strategy}\n`;
        }
        if (comp.strengths.length > 0) {
          formatted += `**Key Strengths:** ${comp.strengths.slice(0, 2).join(', ')}\n`;
        }
      });
      formatted += '\n';
    }
    
    if (analysis.differentiationOpportunities && analysis.differentiationOpportunities.length > 0) {
      formatted += '### Differentiation Opportunities\n';
      analysis.differentiationOpportunities.forEach((opp: string) => {
        formatted += `- ${opp}\n`;
      });
      formatted += '\n';
    }
    
    if (analysis.strategicMoves && analysis.strategicMoves.length > 0) {
      formatted += '### Recommended Strategic Moves\n';
      analysis.strategicMoves.forEach((move: string) => {
        formatted += `- ${move}\n`;
      });
      formatted += '\n';
    }
    
    return formatted;
  }

  private formatGenericAnalysis(analysis: any): string {
    let formatted = '';
    
    if (typeof analysis === 'object') {
      Object.keys(analysis).forEach(key => {
        const value = analysis[key];
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        
        if (Array.isArray(value)) {
          formatted += `### ${formattedKey}\n`;
          value.forEach(item => {
            formatted += `- ${item}\n`;
          });
          formatted += '\n';
        } else if (typeof value === 'object') {
          formatted += `### ${formattedKey}\n`;
          formatted += JSON.stringify(value, null, 2) + '\n\n';
        } else {
          formatted += `**${formattedKey}:** ${value}\n\n`;
        }
      });
    } else {
      formatted += `${analysis}\n\n`;
    }
    
    return formatted;
  }

  private formatRecommendations(recommendations: string[]): string {
    if (!recommendations || recommendations.length === 0) {
      return '';
    }
    
    let formatted = '## Strategic Recommendations\n\n';
    
    recommendations.forEach((rec, index) => {
      formatted += `${index + 1}. **${rec}**\n`;
      formatted += '   ' + this.generateActionItems(rec) + '\n\n';
    });
    
    return formatted;
  }

  private generateActionItems(recommendation: string): string {
    const lowerRec = recommendation.toLowerCase();
    
    if (lowerRec.includes('differentiat')) {
      return 'Conduct customer research, develop unique value propositions, invest in R&D';
    } else if (lowerRec.includes('cost')) {
      return 'Optimize operations, negotiate with suppliers, implement lean processes';
    } else if (lowerRec.includes('expand')) {
      return 'Identify target markets, develop entry strategy, allocate resources';
    } else if (lowerRec.includes('partner')) {
      return 'Identify potential partners, evaluate synergies, structure agreements';
    } else if (lowerRec.includes('invest')) {
      return 'Assess ROI, secure funding, develop implementation roadmap';
    }
    
    return 'Develop detailed action plan with timelines and KPIs';
  }

  private formatFrameworkName(framework: string): string {
    const names: Record<string, string> = {
      'swot': 'SWOT Analysis',
      'porters-five-forces': "Porter's Five Forces",
      'bcg-matrix': 'BCG Matrix',
      'pestel': 'PESTEL Analysis',
      'market-entry': 'Market Entry Analysis',
      'competitive-analysis': 'Competitive Analysis'
    };
    
    return names[framework] || framework;
  }

  private generateFooter(): string {
    return `---

*This report was generated using the Strategy Consulting Agent powered by Claude Code SDK.*  
*For questions or additional analysis, please run the agent with different parameters or frameworks.*
`;
  }
}