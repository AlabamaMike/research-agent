# Setup Guide: Demo vs Production Mode

## Current Status: Demo Mode

The Strategy Consulting Agent is currently configured to run in **demo mode** to ensure it works without requiring a Claude Code API connection. This prevents the hanging issues you experienced.

## Demo Mode Features

In demo mode, the agent:
- ✅ Works immediately without API setup
- ✅ Provides realistic mock analysis data
- ✅ All CLI commands function properly
- ✅ Interactive mode works without errors
- ✅ Generates professional reports
- ⚠️ Uses simulated data (not real AI analysis)

## Switching to Production Mode

To use real Claude Code API for actual AI-powered analysis:

### 1. Ensure Claude Code is Running

First, make sure Claude Code CLI is properly configured:

```bash
# Check if Claude Code is installed
which claude

# Verify API key is set
echo $ANTHROPIC_API_KEY

# Test Claude Code works
claude "Hello, test"
```

### 2. Modify the Code

Edit `src/cli.ts` and change line 17:

```typescript
// Change this:
const consultant = new StrategyConsultantDemo();

// To this:
const consultant = new StrategyConsultant();
```

### 3. Rebuild

```bash
npm run build
```

### 4. Test Production Mode

```bash
node dist/cli.js analyze --company "Tesla" --framework swot
```

## Troubleshooting Production Mode

If the agent hangs in production mode:

1. **Check Claude Code Process**: The SDK needs `claude` to be running
   ```bash
   ps aux | grep claude
   ```

2. **Verify API Key**: Must be set in environment
   ```bash
   export ANTHROPIC_API_KEY=your-key-here
   ```

3. **Check Permissions**: Ensure Claude Code has necessary permissions
   ```bash
   claude --version
   ```

4. **Use Timeout**: Add timeout to prevent infinite hanging
   ```typescript
   // In StrategyConsultant.ts, add AbortController
   const controller = new AbortController();
   setTimeout(() => controller.abort(), 30000); // 30 second timeout
   
   this.options = {
     customSystemPrompt: "...",
     abortController: controller,
     // ... other options
   };
   ```

## Why Demo Mode?

The demo mode was created because:
1. The Claude Code SDK `query` function expects to connect to a running Claude Code process
2. Without proper setup, it hangs waiting for a response
3. Demo mode provides immediate functionality for testing and development

## Architecture

```
Demo Mode:
User → CLI → StrategyConsultantDemo → Mock Data → Report

Production Mode:
User → CLI → StrategyConsultant → Claude Code SDK → Claude API → Report
```

## Best Practices

- Use **demo mode** for:
  - Testing CLI functionality
  - Development and debugging
  - Quick demonstrations
  - When Claude API is unavailable

- Use **production mode** for:
  - Real strategic analysis
  - Actual business consulting
  - When accurate AI insights are needed
  - Production deployments