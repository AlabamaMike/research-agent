export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  keyInsights: string[];
  strategicImplications: string;
}

export class SWOTFramework {
  async analyze(company: string, analysisText: string): Promise<SWOTAnalysis> {
    const swotAnalysis: SWOTAnalysis = {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
      keyInsights: [],
      strategicImplications: ''
    };

    const sections = this.parseSections(analysisText);
    
    swotAnalysis.strengths = this.extractPoints(sections.strengths || analysisText, 'strength');
    swotAnalysis.weaknesses = this.extractPoints(sections.weaknesses || analysisText, 'weakness');
    swotAnalysis.opportunities = this.extractPoints(sections.opportunities || analysisText, 'opportunity');
    swotAnalysis.threats = this.extractPoints(sections.threats || analysisText, 'threat');
    
    swotAnalysis.keyInsights = this.generateKeyInsights(swotAnalysis);
    swotAnalysis.strategicImplications = this.deriveStrategicImplications(swotAnalysis);

    return swotAnalysis;
  }

  private parseSections(text: string): Record<string, string> {
    const sections: Record<string, string> = {};
    const lines = text.split('\n');
    let currentSection = '';
    let sectionContent: string[] = [];

    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('strength')) {
        if (currentSection && sectionContent.length > 0) {
          sections[currentSection] = sectionContent.join('\n');
        }
        currentSection = 'strengths';
        sectionContent = [];
      } else if (lowerLine.includes('weakness')) {
        if (currentSection && sectionContent.length > 0) {
          sections[currentSection] = sectionContent.join('\n');
        }
        currentSection = 'weaknesses';
        sectionContent = [];
      } else if (lowerLine.includes('opportunit')) {
        if (currentSection && sectionContent.length > 0) {
          sections[currentSection] = sectionContent.join('\n');
        }
        currentSection = 'opportunities';
        sectionContent = [];
      } else if (lowerLine.includes('threat')) {
        if (currentSection && sectionContent.length > 0) {
          sections[currentSection] = sectionContent.join('\n');
        }
        currentSection = 'threats';
        sectionContent = [];
      } else if (currentSection) {
        sectionContent.push(line);
      }
    }

    if (currentSection && sectionContent.length > 0) {
      sections[currentSection] = sectionContent.join('\n');
    }

    return sections;
  }

  private extractPoints(text: string, category: string): string[] {
    const points: string[] = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.startsWith('*')) {
        const point = trimmedLine.substring(1).trim();
        if (point.length > 10) {
          points.push(point);
        }
      } else if (trimmedLine.match(/^\d+\./)) {
        const point = trimmedLine.replace(/^\d+\./, '').trim();
        if (point.length > 10) {
          points.push(point);
        }
      } else if (category && trimmedLine.toLowerCase().includes(category) && trimmedLine.length > 20) {
        const colonIndex = trimmedLine.indexOf(':');
        if (colonIndex > 0 && colonIndex < trimmedLine.length - 1) {
          const point = trimmedLine.substring(colonIndex + 1).trim();
          if (point.length > 10) {
            points.push(point);
          }
        }
      }
    }

    return points.slice(0, 10);
  }

  private generateKeyInsights(analysis: SWOTAnalysis): string[] {
    const insights: string[] = [];

    if (analysis.strengths.length > analysis.weaknesses.length) {
      insights.push('Strong internal capabilities position the company well for growth');
    } else if (analysis.weaknesses.length > analysis.strengths.length) {
      insights.push('Internal weaknesses require immediate attention to maintain competitiveness');
    }

    if (analysis.opportunities.length > analysis.threats.length) {
      insights.push('Favorable external environment presents multiple growth avenues');
    } else if (analysis.threats.length > analysis.opportunities.length) {
      insights.push('Challenging external environment requires defensive strategies');
    }

    if (analysis.strengths.length > 0 && analysis.opportunities.length > 0) {
      insights.push('Leverage strengths to capitalize on market opportunities');
    }

    if (analysis.weaknesses.length > 0 && analysis.threats.length > 0) {
      insights.push('Address critical vulnerabilities to mitigate external risks');
    }

    return insights;
  }

  private deriveStrategicImplications(analysis: SWOTAnalysis): string {
    const implications: string[] = [];

    if (analysis.strengths.length >= 3 && analysis.opportunities.length >= 3) {
      implications.push('SO Strategy: Aggressive growth and expansion recommended');
    }

    if (analysis.strengths.length >= 3 && analysis.threats.length >= 3) {
      implications.push('ST Strategy: Diversification to mitigate risks while leveraging strengths');
    }

    if (analysis.weaknesses.length >= 3 && analysis.opportunities.length >= 3) {
      implications.push('WO Strategy: Strategic partnerships or acquisitions to address gaps');
    }

    if (analysis.weaknesses.length >= 3 && analysis.threats.length >= 3) {
      implications.push('WT Strategy: Defensive positioning and operational excellence focus');
    }

    return implications.join('. ') || 'Balanced approach recommended with focus on core competencies';
  }

  formatAsMarkdown(analysis: SWOTAnalysis, company: string): string {
    return `# SWOT Analysis: ${company}

## Strengths
${analysis.strengths.map(s => `- ${s}`).join('\n')}

## Weaknesses
${analysis.weaknesses.map(w => `- ${w}`).join('\n')}

## Opportunities
${analysis.opportunities.map(o => `- ${o}`).join('\n')}

## Threats
${analysis.threats.map(t => `- ${t}`).join('\n')}

## Key Insights
${analysis.keyInsights.map(i => `- ${i}`).join('\n')}

## Strategic Implications
${analysis.strategicImplications}
`;
  }
}