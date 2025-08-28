#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { StrategyConsultant, ConsultingOptions } from './agent/StrategyConsultant';
import { StrategyConsultantDemo } from './agent/StrategyConsultantDemo';
import { ReportGenerator } from './tools/ReportGenerator';
import * as fs from 'fs/promises';
import * as path from 'path';

const program = new Command();

// Use demo consultant for now (doesn't require Claude Code API connection)
// To use the real consultant, replace StrategyConsultantDemo with StrategyConsultant
const consultant = new StrategyConsultant();
const reportGenerator = new ReportGenerator();

console.log(chalk.yellow('📌 Note: Running in demo mode. For production use, configure Claude Code API.\n'));

program
  .name('strategy-agent')
  .description('AI-powered strategy consulting agent using Claude Code SDK')
  .version('1.0.0');

program
  .command('analyze')
  .description('Analyze a company using strategic frameworks')
  .option('-c, --company <name>', 'Company name to analyze')
  .option('-f, --framework <type>', 'Framework to use (swot, porters-five-forces, bcg-matrix, pestel)', 'swot')
  .option('-d, --depth <level>', 'Analysis depth (quick, standard, comprehensive)', 'standard')
  .option('-o, --output <file>', 'Output file path')
  .action(async (options) => {
    try {
      let company = options.company;
      
      if (!company) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'company',
            message: 'Which company would you like to analyze?',
            validate: (input) => input.length > 0 || 'Company name is required'
          }
        ]);
        company = answers.company;
      }

      const spinner = ora(`Analyzing ${company} using ${options.framework} framework...`).start();
      
      const analysisOptions: ConsultingOptions = {
        framework: options.framework as any,
        depth: options.depth as any,
        outputFormat: 'markdown'
      };

      const result = await consultant.analyzeCompany(company, analysisOptions);
      
      spinner.succeed(chalk.green('Analysis complete!'));

      const report = await reportGenerator.generateReport(result);

      if (options.output) {
        await fs.writeFile(options.output, report);
        console.log(chalk.blue(`Report saved to ${options.output}`));
      } else {
        console.log('\n' + report);
      }
    } catch (error) {
      console.error(chalk.red('Analysis failed:'), error);
      process.exit(1);
    }
  });

program
  .command('market-entry')
  .description('Analyze market entry opportunities')
  .option('-i, --industry <name>', 'Industry to analyze')
  .option('-r, --region <name>', 'Target region')
  .option('-c, --company <name>', 'Company considering entry (optional)')
  .option('-o, --output <file>', 'Output file path')
  .action(async (options) => {
    try {
      let { industry, region } = options;
      
      if (!industry || !region) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'industry',
            message: 'Which industry?',
            when: !industry,
            validate: (input) => input.length > 0 || 'Industry is required'
          },
          {
            type: 'input',
            name: 'region',
            message: 'Which region?',
            when: !region,
            validate: (input) => input.length > 0 || 'Region is required'
          }
        ]);
        industry = industry || answers.industry;
        region = region || answers.region;
      }

      const spinner = ora(`Analyzing market entry for ${industry} in ${region}...`).start();
      
      const result = await consultant.analyzeMarketEntry(industry, region, options.company);
      
      spinner.succeed(chalk.green('Market analysis complete!'));

      const report = await reportGenerator.generateReport(result);

      if (options.output) {
        await fs.writeFile(options.output, report);
        console.log(chalk.blue(`Report saved to ${options.output}`));
      } else {
        console.log('\n' + report);
      }
    } catch (error) {
      console.error(chalk.red('Market analysis failed:'), error);
      process.exit(1);
    }
  });

program
  .command('competitive-analysis')
  .description('Perform competitive analysis')
  .option('-c, --company <name>', 'Main company to analyze')
  .option('-p, --competitors <names>', 'Comma-separated list of competitors')
  .option('-o, --output <file>', 'Output file path')
  .action(async (options) => {
    try {
      let { company, competitors } = options;
      
      if (!company || !competitors) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'company',
            message: 'Main company to analyze?',
            when: !company,
            validate: (input) => input.length > 0 || 'Company name is required'
          },
          {
            type: 'input',
            name: 'competitors',
            message: 'Competitors (comma-separated)?',
            when: !competitors,
            validate: (input) => input.length > 0 || 'At least one competitor is required'
          }
        ]);
        company = company || answers.company;
        competitors = competitors || answers.competitors;
      }

      const competitorList = competitors.split(',').map((c: string) => c.trim());
      
      const spinner = ora(`Analyzing competitive landscape for ${company}...`).start();
      
      const result = await consultant.performCompetitiveAnalysis(company, competitorList);
      
      spinner.succeed(chalk.green('Competitive analysis complete!'));

      const report = await reportGenerator.generateReport(result);

      if (options.output) {
        await fs.writeFile(options.output, report);
        console.log(chalk.blue(`Report saved to ${options.output}`));
      } else {
        console.log('\n' + report);
      }
    } catch (error) {
      console.error(chalk.red('Competitive analysis failed:'), error);
      process.exit(1);
    }
  });

program
  .command('interactive')
  .description('Start an interactive strategy consultation session')
  .action(async () => {
    console.log(chalk.cyan('\n🎯 Welcome to the Strategy Consulting Agent\n'));
    
    const { mode } = await inquirer.prompt([
      {
        type: 'list',
        name: 'mode',
        message: 'What would you like to do?',
        choices: [
          { name: 'Company Analysis (SWOT, Porter\'s, etc.)', value: 'analyze' },
          { name: 'Market Entry Analysis', value: 'market' },
          { name: 'Competitive Analysis', value: 'competitive' },
          { name: 'Custom Consultation', value: 'custom' }
        ]
      }
    ]);

    // Handle each mode by running the corresponding logic directly
    try {
      switch (mode) {
        case 'analyze': {
          // Run company analysis flow
          const answers = await inquirer.prompt([
            {
              type: 'input',
              name: 'company',
              message: 'Which company would you like to analyze?',
              validate: (input) => input.length > 0 || 'Company name is required'
            },
            {
              type: 'list',
              name: 'framework',
              message: 'Which framework would you like to use?',
              choices: [
                { name: 'SWOT Analysis', value: 'swot' },
                { name: "Porter's Five Forces", value: 'porters-five-forces' },
                { name: 'BCG Matrix', value: 'bcg-matrix' },
                { name: 'PESTEL Analysis', value: 'pestel' }
              ],
              default: 'swot'
            },
            {
              type: 'list',
              name: 'depth',
              message: 'Analysis depth?',
              choices: ['quick', 'standard', 'comprehensive'],
              default: 'standard'
            }
          ]);

          const spinner = ora(`Analyzing ${answers.company} using ${answers.framework} framework...`).start();
          
          const analysisOptions: ConsultingOptions = {
            framework: answers.framework as any,
            depth: answers.depth as any,
            outputFormat: 'markdown'
          };

          const result = await consultant.analyzeCompany(answers.company, analysisOptions);
          
          spinner.succeed(chalk.green('Analysis complete!'));

          const report = await reportGenerator.generateReport(result);
          console.log('\n' + report);
          break;
        }
        
        case 'market': {
          // Run market entry analysis flow
          const answers = await inquirer.prompt([
            {
              type: 'input',
              name: 'industry',
              message: 'Which industry?',
              validate: (input) => input.length > 0 || 'Industry is required'
            },
            {
              type: 'input',
              name: 'region',
              message: 'Which region?',
              validate: (input) => input.length > 0 || 'Region is required'
            },
            {
              type: 'input',
              name: 'company',
              message: 'Company name (optional, press Enter to skip):'
            }
          ]);

          const spinner = ora(`Analyzing market entry for ${answers.industry} in ${answers.region}...`).start();
          
          const result = await consultant.analyzeMarketEntry(
            answers.industry, 
            answers.region, 
            answers.company || undefined
          );
          
          spinner.succeed(chalk.green('Market analysis complete!'));

          const report = await reportGenerator.generateReport(result);
          console.log('\n' + report);
          break;
        }
        
        case 'competitive': {
          // Run competitive analysis flow
          const answers = await inquirer.prompt([
            {
              type: 'input',
              name: 'company',
              message: 'Main company to analyze?',
              validate: (input) => input.length > 0 || 'Company name is required'
            },
            {
              type: 'input',
              name: 'competitors',
              message: 'Competitors (comma-separated)?',
              validate: (input) => input.length > 0 || 'At least one competitor is required'
            }
          ]);

          const competitorList = answers.competitors.split(',').map((c: string) => c.trim());
          
          const spinner = ora(`Analyzing competitive landscape for ${answers.company}...`).start();
          
          const result = await consultant.performCompetitiveAnalysis(answers.company, competitorList);
          
          spinner.succeed(chalk.green('Competitive analysis complete!'));

          const report = await reportGenerator.generateReport(result);
          console.log('\n' + report);
          break;
        }
        
        case 'custom':
          console.log(chalk.yellow('Custom consultation mode coming soon!'));
          break;
      }
    } catch (error) {
      console.error(chalk.red('Error in interactive mode:'), error);
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.parseAsync(['', '', 'interactive'], { from: 'user' });
}