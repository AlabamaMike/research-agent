/**
 * REST API Server for Strategy Consulting Agent
 * 
 * This server exposes the TypeScript strategy consulting capabilities
 * via HTTP endpoints for integration with AG2 and other systems.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { StrategyConsultant, ConsultingOptions, AnalysisResult } from '../agent/StrategyConsultant';
import { StrategyConsultantDemo } from '../agent/StrategyConsultantDemo';
import { ReportGenerator } from '../tools/ReportGenerator';
import { SessionManager } from './sessions';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Initialize services
// Use demo consultant by default, switch to StrategyConsultant for production
const useDemo = process.env.USE_DEMO !== 'false';
const consultant = useDemo ? new StrategyConsultantDemo() : new StrategyConsultant();
const reportGenerator = new ReportGenerator();
const sessionManager = new SessionManager();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = uuidv4();
  req.headers['x-request-id'] = requestId;
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Request ID: ${requestId}`);
  next();
});

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`Error processing request ${req.headers['x-request-id']}:`, err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    requestId: req.headers['x-request-id']
  });
};

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'strategy-consulting-agent',
    mode: useDemo ? 'demo' : 'production',
    timestamp: new Date().toISOString()
  });
});

// Service info endpoint
app.get('/api/info', (req: Request, res: Response) => {
  res.json({
    service: 'Strategy Consulting Agent API',
    version: '1.0.0',
    capabilities: [
      'company_analysis',
      'market_entry_analysis',
      'competitive_analysis',
      'executive_summary'
    ],
    frameworks: [
      'swot',
      'porters-five-forces',
      'bcg-matrix',
      'pestel'
    ],
    mode: useDemo ? 'demo' : 'production'
  });
});

// Company analysis endpoint
app.post('/api/analyze', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { company, framework = 'swot', depth = 'standard', sessionId } = req.body;
    
    // Validate required parameters
    if (!company) {
      return res.status(400).json({
        error: 'Missing required parameter: company',
        requestId: req.headers['x-request-id']
      });
    }
    
    // Track session if provided
    if (sessionId) {
      sessionManager.addToHistory(sessionId, {
        type: 'analyze',
        params: { company, framework, depth },
        timestamp: new Date()
      });
    }
    
    // Perform analysis
    const options: ConsultingOptions = {
      framework: framework as any,
      depth: depth as any,
      outputFormat: 'json'
    };
    
    console.log(`Analyzing ${company} with ${framework} framework (${depth} depth)`);
    const result = await consultant.analyzeCompany(company, options);
    
    // Store result in session
    if (sessionId) {
      sessionManager.updateContext(sessionId, 'lastAnalysis', result);
    }
    
    res.json({
      success: true,
      result,
      sessionId: sessionId || uuidv4(),
      requestId: req.headers['x-request-id']
    });
  } catch (error) {
    next(error);
  }
});

// Market entry analysis endpoint
app.post('/api/market-entry', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { industry, region, company, sessionId } = req.body;
    
    // Validate required parameters
    if (!industry || !region) {
      return res.status(400).json({
        error: 'Missing required parameters: industry and region',
        requestId: req.headers['x-request-id']
      });
    }
    
    // Track session
    if (sessionId) {
      sessionManager.addToHistory(sessionId, {
        type: 'market-entry',
        params: { industry, region, company },
        timestamp: new Date()
      });
    }
    
    console.log(`Analyzing market entry for ${industry} in ${region}`);
    const result = await consultant.analyzeMarketEntry(industry, region, company);
    
    // Store result
    if (sessionId) {
      sessionManager.updateContext(sessionId, 'lastMarketAnalysis', result);
    }
    
    res.json({
      success: true,
      result,
      sessionId: sessionId || uuidv4(),
      requestId: req.headers['x-request-id']
    });
  } catch (error) {
    next(error);
  }
});

// Competitive analysis endpoint
app.post('/api/competitive', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { company, competitors, sessionId } = req.body;
    
    // Validate required parameters
    if (!company || !competitors || !Array.isArray(competitors)) {
      return res.status(400).json({
        error: 'Missing required parameters: company and competitors (array)',
        requestId: req.headers['x-request-id']
      });
    }
    
    // Track session
    if (sessionId) {
      sessionManager.addToHistory(sessionId, {
        type: 'competitive',
        params: { company, competitors },
        timestamp: new Date()
      });
    }
    
    console.log(`Analyzing competition for ${company} vs ${competitors.join(', ')}`);
    const result = await consultant.performCompetitiveAnalysis(company, competitors);
    
    // Store result
    if (sessionId) {
      sessionManager.updateContext(sessionId, 'lastCompetitiveAnalysis', result);
    }
    
    res.json({
      success: true,
      result,
      sessionId: sessionId || uuidv4(),
      requestId: req.headers['x-request-id']
    });
  } catch (error) {
    next(error);
  }
});

// Executive summary endpoint
app.post('/api/executive-summary', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { analysis, sessionId } = req.body;
    
    // Can use provided analysis or retrieve from session
    let analysisData: AnalysisResult;
    
    if (analysis) {
      analysisData = analysis;
    } else if (sessionId) {
      const session = sessionManager.getSession(sessionId);
      if (session && session.context.lastAnalysis) {
        analysisData = session.context.lastAnalysis;
      } else {
        return res.status(400).json({
          error: 'No analysis provided or found in session',
          requestId: req.headers['x-request-id']
        });
      }
    } else {
      return res.status(400).json({
        error: 'Either analysis data or valid sessionId required',
        requestId: req.headers['x-request-id']
      });
    }
    
    console.log('Generating executive summary');
    const summary = await consultant.generateExecutiveSummary(analysisData);
    
    res.json({
      success: true,
      summary,
      sessionId: sessionId || uuidv4(),
      requestId: req.headers['x-request-id']
    });
  } catch (error) {
    next(error);
  }
});

// Generate report endpoint
app.post('/api/report', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { analysis, format = 'markdown', sessionId } = req.body;
    
    // Can use provided analysis or retrieve from session
    let analysisData: AnalysisResult;
    
    if (analysis) {
      analysisData = analysis;
    } else if (sessionId) {
      const session = sessionManager.getSession(sessionId);
      if (session && session.context.lastAnalysis) {
        analysisData = session.context.lastAnalysis;
      } else {
        return res.status(400).json({
          error: 'No analysis provided or found in session',
          requestId: req.headers['x-request-id']
        });
      }
    } else {
      return res.status(400).json({
        error: 'Either analysis data or valid sessionId required',
        requestId: req.headers['x-request-id']
      });
    }
    
    console.log(`Generating ${format} report`);
    const report = await reportGenerator.generateReport(analysisData);
    
    res.json({
      success: true,
      report,
      format,
      sessionId: sessionId || uuidv4(),
      requestId: req.headers['x-request-id']
    });
  } catch (error) {
    next(error);
  }
});

// Session management endpoints
app.post('/api/session/create', (req: Request, res: Response) => {
  const { agentId } = req.body;
  const sessionId = sessionManager.createSession(agentId || 'anonymous');
  
  res.json({
    success: true,
    sessionId,
    requestId: req.headers['x-request-id']
  });
});

app.get('/api/session/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = sessionManager.getSession(sessionId);
  
  if (!session) {
    return res.status(404).json({
      error: 'Session not found',
      requestId: req.headers['x-request-id']
    });
  }
  
  res.json({
    success: true,
    session,
    requestId: req.headers['x-request-id']
  });
});

app.delete('/api/session/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const deleted = sessionManager.deleteSession(sessionId);
  
  res.json({
    success: deleted,
    message: deleted ? 'Session deleted' : 'Session not found',
    requestId: req.headers['x-request-id']
  });
});

// Batch analysis endpoint for multiple companies
app.post('/api/batch-analyze', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companies, framework = 'swot', depth = 'quick', sessionId } = req.body;
    
    if (!companies || !Array.isArray(companies)) {
      return res.status(400).json({
        error: 'Missing required parameter: companies (array)',
        requestId: req.headers['x-request-id']
      });
    }
    
    console.log(`Batch analyzing ${companies.length} companies`);
    
    const options: ConsultingOptions = {
      framework: framework as any,
      depth: depth as any,
      outputFormat: 'json'
    };
    
    const results = await Promise.all(
      companies.map(company => 
        consultant.analyzeCompany(company, options)
          .then(result => ({ company, success: true, result }))
          .catch(error => ({ company, success: false, error: error.message }))
      )
    );
    
    res.json({
      success: true,
      results,
      sessionId: sessionId || uuidv4(),
      requestId: req.headers['x-request-id']
    });
  } catch (error) {
    next(error);
  }
});

// Apply error handler
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    requestId: req.headers['x-request-id']
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Strategy Consulting API Server running on port ${PORT}`);
  console.log(`📊 Mode: ${useDemo ? 'Demo (mock data)' : 'Production (Claude API)'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📖 API info: http://localhost:${PORT}/api/info`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;