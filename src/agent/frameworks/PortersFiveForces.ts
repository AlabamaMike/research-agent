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

export class PortersFiveForces {
  async analyze(company: string, analysisText: string): Promise<FiveForces> {
    const forces = this.parseForces(analysisText);
    const overallAttractiveness = this.calculateAttractiveness(forces);
    const recommendations = this.generateRecommendations(forces, company);

    return {
      ...forces,
      overallAttractiveness,
      strategicRecommendations: recommendations
    };
  }

  private parseForces(text: string): Omit<FiveForces, 'overallAttractiveness' | 'strategicRecommendations'> {
    const sections = this.identifySections(text);
    
    return {
      competitiveRivalry: this.parseCompetitiveRivalry(sections.rivalry || text),
      supplierPower: this.parseSupplierPower(sections.supplier || text),
      buyerPower: this.parseBuyerPower(sections.buyer || text),
      threatOfSubstitutes: this.parseThreatOfSubstitutes(sections.substitutes || text),
      threatOfNewEntrants: this.parseThreatOfNewEntrants(sections.newEntrants || text)
    };
  }

  private identifySections(text: string): Record<string, string> {
    const sections: Record<string, string> = {};
    const lines = text.split('\n');
    let currentSection = '';
    let sectionContent: string[] = [];

    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('competitive rivalry') || lowerLine.includes('rivalry among')) {
        if (currentSection) sections[currentSection] = sectionContent.join('\n');
        currentSection = 'rivalry';
        sectionContent = [];
      } else if (lowerLine.includes('supplier power') || lowerLine.includes('bargaining power of supplier')) {
        if (currentSection) sections[currentSection] = sectionContent.join('\n');
        currentSection = 'supplier';
        sectionContent = [];
      } else if (lowerLine.includes('buyer power') || lowerLine.includes('bargaining power of buyer')) {
        if (currentSection) sections[currentSection] = sectionContent.join('\n');
        currentSection = 'buyer';
        sectionContent = [];
      } else if (lowerLine.includes('threat of substitute')) {
        if (currentSection) sections[currentSection] = sectionContent.join('\n');
        currentSection = 'substitutes';
        sectionContent = [];
      } else if (lowerLine.includes('threat of new') || lowerLine.includes('barriers to entry')) {
        if (currentSection) sections[currentSection] = sectionContent.join('\n');
        currentSection = 'newEntrants';
        sectionContent = [];
      } else if (currentSection) {
        sectionContent.push(line);
      }
    }

    if (currentSection) sections[currentSection] = sectionContent.join('\n');
    return sections;
  }

  private parseCompetitiveRivalry(text: string): FiveForces['competitiveRivalry'] {
    const intensity = this.detectIntensity(text);
    const factors = this.extractFactors(text, [
      'number of competitors',
      'market growth',
      'fixed costs',
      'product differentiation',
      'switching costs',
      'exit barriers',
      'industry concentration'
    ]);

    return {
      intensity,
      factors,
      assessment: this.generateAssessment('competitive rivalry', intensity, factors)
    };
  }

  private parseSupplierPower(text: string): FiveForces['supplierPower'] {
    const level = this.detectIntensity(text);
    const factors = this.extractFactors(text, [
      'supplier concentration',
      'switching costs',
      'unique inputs',
      'forward integration threat',
      'importance of volume',
      'input differentiation'
    ]);

    return {
      level,
      factors,
      assessment: this.generateAssessment('supplier power', level, factors)
    };
  }

  private parseBuyerPower(text: string): FiveForces['buyerPower'] {
    const level = this.detectIntensity(text);
    const factors = this.extractFactors(text, [
      'buyer concentration',
      'buyer volume',
      'switching costs',
      'backward integration',
      'price sensitivity',
      'product importance'
    ]);

    return {
      level,
      factors,
      assessment: this.generateAssessment('buyer power', level, factors)
    };
  }

  private parseThreatOfSubstitutes(text: string): FiveForces['threatOfSubstitutes'] {
    const level = this.detectIntensity(text);
    const factors = this.extractFactors(text, [
      'substitute availability',
      'price-performance ratio',
      'switching costs',
      'buyer propensity to substitute',
      'technological change'
    ]);

    return {
      level,
      factors,
      assessment: this.generateAssessment('threat of substitutes', level, factors)
    };
  }

  private parseThreatOfNewEntrants(text: string): FiveForces['threatOfNewEntrants'] {
    const level = this.detectIntensity(text);
    const barriers = this.extractFactors(text, [
      'capital requirements',
      'economies of scale',
      'brand loyalty',
      'government regulations',
      'access to distribution',
      'proprietary technology',
      'learning curve'
    ]);

    return {
      level,
      barriers,
      assessment: this.generateAssessment('threat of new entrants', level, barriers)
    };
  }

  private detectIntensity(text: string): 'low' | 'moderate' | 'high' {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('very high') || lowerText.includes('intense') || 
        lowerText.includes('strong') || lowerText.includes('significant')) {
      return 'high';
    } else if (lowerText.includes('low') || lowerText.includes('weak') || 
               lowerText.includes('minimal') || lowerText.includes('limited')) {
      return 'low';
    }
    
    return 'moderate';
  }

  private extractFactors(text: string, keywords: string[]): string[] {
    const factors: string[] = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.match(/^\d+\./)) {
        const factor = trimmedLine.replace(/^[-•\d.]+\s*/, '').trim();
        if (factor.length > 10) {
          factors.push(factor);
        }
      }
    }

    for (const keyword of keywords) {
      if (text.toLowerCase().includes(keyword) && !factors.some(f => f.toLowerCase().includes(keyword))) {
        factors.push(`${keyword} impact identified`);
      }
    }

    return factors.slice(0, 7);
  }

  private generateAssessment(force: string, level: string, factors: string[]): string {
    const factorCount = factors.length;
    const impact = level === 'high' ? 'significant' : level === 'low' ? 'minimal' : 'moderate';
    
    return `${force} shows ${impact} impact with ${factorCount} key factors identified`;
  }

  private calculateAttractiveness(
    forces: Omit<FiveForces, 'overallAttractiveness' | 'strategicRecommendations'>
  ): FiveForces['overallAttractiveness'] {
    const scores = {
      low: 3,
      moderate: 2,
      high: 1
    };

    const totalScore = 
      scores[forces.competitiveRivalry.intensity] +
      scores[forces.supplierPower.level] +
      scores[forces.buyerPower.level] +
      scores[forces.threatOfSubstitutes.level] +
      scores[forces.threatOfNewEntrants.level];

    if (totalScore >= 13) return 'very high';
    if (totalScore >= 11) return 'high';
    if (totalScore >= 9) return 'moderate';
    if (totalScore >= 7) return 'low';
    return 'very low';
  }

  private generateRecommendations(
    forces: Omit<FiveForces, 'overallAttractiveness' | 'strategicRecommendations'>,
    company: string
  ): string[] {
    const recommendations: string[] = [];

    if (forces.competitiveRivalry.intensity === 'high') {
      recommendations.push('Differentiate through innovation or unique value propositions');
    }

    if (forces.supplierPower.level === 'high') {
      recommendations.push('Diversify supplier base or consider backward integration');
    }

    if (forces.buyerPower.level === 'high') {
      recommendations.push('Increase switching costs and build customer loyalty programs');
    }

    if (forces.threatOfSubstitutes.level === 'high') {
      recommendations.push('Enhance product features and improve price-performance ratio');
    }

    if (forces.threatOfNewEntrants.level === 'high') {
      recommendations.push('Build strong brand equity and establish economies of scale');
    }

    if (recommendations.length === 0) {
      recommendations.push('Maintain current strategic position while monitoring market dynamics');
    }

    return recommendations;
  }

  formatAsMarkdown(analysis: FiveForces, company: string): string {
    return `# Porter's Five Forces Analysis: ${company}

## Industry Attractiveness: ${analysis.overallAttractiveness}

### 1. Competitive Rivalry (${analysis.competitiveRivalry.intensity})
${analysis.competitiveRivalry.factors.map(f => `- ${f}`).join('\n')}
**Assessment:** ${analysis.competitiveRivalry.assessment}

### 2. Supplier Power (${analysis.supplierPower.level})
${analysis.supplierPower.factors.map(f => `- ${f}`).join('\n')}
**Assessment:** ${analysis.supplierPower.assessment}

### 3. Buyer Power (${analysis.buyerPower.level})
${analysis.buyerPower.factors.map(f => `- ${f}`).join('\n')}
**Assessment:** ${analysis.buyerPower.assessment}

### 4. Threat of Substitutes (${analysis.threatOfSubstitutes.level})
${analysis.threatOfSubstitutes.factors.map(f => `- ${f}`).join('\n')}
**Assessment:** ${analysis.threatOfSubstitutes.assessment}

### 5. Threat of New Entrants (${analysis.threatOfNewEntrants.level})
**Entry Barriers:**
${analysis.threatOfNewEntrants.barriers.map(b => `- ${b}`).join('\n')}
**Assessment:** ${analysis.threatOfNewEntrants.assessment}

## Strategic Recommendations
${analysis.strategicRecommendations.map(r => `- ${r}`).join('\n')}
`;
  }
}