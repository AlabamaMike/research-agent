#!/usr/bin/env node

/**
 * Example usage of the Strategy Consulting Agent
 * Run with: npx ts-node example.ts
 */

import { StrategyConsultant } from './src/agent/StrategyConsultant';

async function main() {
  console.log('🎯 Strategy Consulting Agent - Example Usage\n');
  
  const consultant = new StrategyConsultant();
  
  try {
    // Example 1: SWOT Analysis
    console.log('📊 Running SWOT Analysis for Tesla...\n');
    const swotResult = await consultant.analyzeCompany('Tesla', {
      framework: 'swot',
      depth: 'standard'
    });
    
    console.log('SWOT Analysis Results:');
    console.log('Framework:', swotResult.framework);
    console.log('Company:', swotResult.company);
    console.log('\nKey Insights:');
    if (swotResult.analysis.keyInsights) {
      swotResult.analysis.keyInsights.forEach((insight: string) => {
        console.log(`  - ${insight}`);
      });
    }
    console.log('\nRecommendations:');
    swotResult.recommendations.forEach((rec: string) => {
      console.log(`  - ${rec}`);
    });
    
    // Generate executive summary
    const summary = await consultant.generateExecutiveSummary(swotResult);
    console.log('\n📝 Executive Summary:');
    console.log(summary);
    
  } catch (error) {
    console.error('❌ Error running analysis:', error);
  }
}

// Run the example
main().catch(console.error);