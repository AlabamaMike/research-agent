/**
 * Session Management for Strategy Consulting API
 * 
 * Manages session state and context for multi-turn conversations
 * and maintains history across API calls.
 */

import { v4 as uuidv4 } from 'uuid';
import { AnalysisResult } from '../agent/StrategyConsultant';

export interface SessionContext {
  agentId: string;
  sessionId: string;
  history: SessionHistoryEntry[];
  context: Record<string, any>;
  createdAt: Date;
  lastAccessedAt: Date;
  metadata?: Record<string, any>;
}

export interface SessionHistoryEntry {
  type: string;
  params: Record<string, any>;
  result?: any;
  timestamp: Date;
  duration?: number;
}

export class SessionManager {
  private sessions: Map<string, SessionContext>;
  private maxSessions: number;
  private sessionTimeout: number; // in milliseconds
  private cleanupInterval: NodeJS.Timeout;

  constructor(maxSessions: number = 1000, sessionTimeoutMinutes: number = 60) {
    this.sessions = new Map();
    this.maxSessions = maxSessions;
    this.sessionTimeout = sessionTimeoutMinutes * 60 * 1000;
    
    // Start cleanup interval to remove expired sessions
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredSessions();
    }, 5 * 60 * 1000); // Run every 5 minutes
    
    console.log(`SessionManager initialized: max ${maxSessions} sessions, ${sessionTimeoutMinutes}min timeout`);
  }

  /**
   * Create a new session
   */
  createSession(agentId: string = 'anonymous'): string {
    // Clean up if we've reached max sessions
    if (this.sessions.size >= this.maxSessions) {
      this.removeOldestSession();
    }

    const sessionId = uuidv4();
    const session: SessionContext = {
      agentId,
      sessionId,
      history: [],
      context: {},
      createdAt: new Date(),
      lastAccessedAt: new Date(),
      metadata: {}
    };

    this.sessions.set(sessionId, session);
    console.log(`Session created: ${sessionId} for agent ${agentId}`);
    
    return sessionId;
  }

  /**
   * Get a session by ID
   */
  getSession(sessionId: string): SessionContext | null {
    const session = this.sessions.get(sessionId);
    
    if (session) {
      // Update last accessed time
      session.lastAccessedAt = new Date();
      return session;
    }
    
    return null;
  }

  /**
   * Update session context
   */
  updateContext(sessionId: string, key: string, value: any): boolean {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      console.warn(`Session not found: ${sessionId}`);
      return false;
    }
    
    session.context[key] = value;
    session.lastAccessedAt = new Date();
    
    return true;
  }

  /**
   * Add entry to session history
   */
  addToHistory(sessionId: string, entry: Omit<SessionHistoryEntry, 'timestamp'>): boolean {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      console.warn(`Session not found: ${sessionId}`);
      return false;
    }
    
    const historyEntry: SessionHistoryEntry = {
      ...entry,
      timestamp: new Date()
    };
    
    session.history.push(historyEntry);
    session.lastAccessedAt = new Date();
    
    // Limit history size to prevent memory issues
    if (session.history.length > 100) {
      session.history = session.history.slice(-50); // Keep last 50 entries
    }
    
    return true;
  }

  /**
   * Get session history
   */
  getHistory(sessionId: string): SessionHistoryEntry[] {
    const session = this.sessions.get(sessionId);
    return session ? session.history : [];
  }

  /**
   * Delete a session
   */
  deleteSession(sessionId: string): boolean {
    const deleted = this.sessions.delete(sessionId);
    
    if (deleted) {
      console.log(`Session deleted: ${sessionId}`);
    }
    
    return deleted;
  }

  /**
   * Get all active sessions (for monitoring)
   */
  getActiveSessions(): Array<{
    sessionId: string;
    agentId: string;
    createdAt: Date;
    lastAccessedAt: Date;
    historyLength: number;
  }> {
    return Array.from(this.sessions.values()).map(session => ({
      sessionId: session.sessionId,
      agentId: session.agentId,
      createdAt: session.createdAt,
      lastAccessedAt: session.lastAccessedAt,
      historyLength: session.history.length
    }));
  }

  /**
   * Clean up expired sessions
   */
  private cleanupExpiredSessions(): void {
    const now = new Date();
    let cleaned = 0;
    
    for (const [sessionId, session] of this.sessions.entries()) {
      const timeSinceAccess = now.getTime() - session.lastAccessedAt.getTime();
      
      if (timeSinceAccess > this.sessionTimeout) {
        this.sessions.delete(sessionId);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`Cleaned up ${cleaned} expired sessions`);
    }
  }

  /**
   * Remove the oldest session (based on last access time)
   */
  private removeOldestSession(): void {
    let oldestSessionId: string | null = null;
    let oldestTime = new Date();
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.lastAccessedAt < oldestTime) {
        oldestTime = session.lastAccessedAt;
        oldestSessionId = sessionId;
      }
    }
    
    if (oldestSessionId) {
      this.sessions.delete(oldestSessionId);
      console.log(`Removed oldest session: ${oldestSessionId}`);
    }
  }

  /**
   * Store analysis result in session
   */
  storeAnalysisResult(sessionId: string, result: AnalysisResult): boolean {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return false;
    }
    
    // Store in context
    session.context.lastAnalysis = result;
    session.context.lastAnalysisTime = new Date();
    
    // Add to history
    this.addToHistory(sessionId, {
      type: 'analysis_result',
      params: {
        framework: result.framework,
        company: result.company,
        industry: result.industry
      },
      result: {
        recommendationsCount: result.recommendations?.length || 0,
        timestamp: result.timestamp
      }
    });
    
    return true;
  }

  /**
   * Get conversation context for AG2 integration
   */
  getConversationContext(sessionId: string): string {
    const session = this.sessions.get(sessionId);
    
    if (!session || session.history.length === 0) {
      return '';
    }
    
    // Build context string from recent history
    const recentHistory = session.history.slice(-5); // Last 5 entries
    const contextParts: string[] = [];
    
    for (const entry of recentHistory) {
      if (entry.type === 'analyze') {
        contextParts.push(`Analyzed ${entry.params.company} using ${entry.params.framework}`);
      } else if (entry.type === 'market-entry') {
        contextParts.push(`Analyzed ${entry.params.industry} market in ${entry.params.region}`);
      } else if (entry.type === 'competitive') {
        contextParts.push(`Competitive analysis of ${entry.params.company}`);
      }
    }
    
    return contextParts.join('. ');
  }

  /**
   * Clean up resources (call on shutdown)
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    this.sessions.clear();
    console.log('SessionManager destroyed');
  }
}

// Singleton instance
let sessionManagerInstance: SessionManager | null = null;

export function getSessionManager(): SessionManager {
  if (!sessionManagerInstance) {
    sessionManagerInstance = new SessionManager();
  }
  return sessionManagerInstance;
}

export default SessionManager;