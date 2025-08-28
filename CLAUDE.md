# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a GitHub Codespaces configuration repository designed to provide a ready-to-use environment for Claude Code with OAUTH token authentication. The repository serves as a template for users who want to access Claude Code from anywhere through GitHub Codespaces without needing a local IDE.

## Environment Setup

The environment uses:
- Ubuntu-based devcontainer with Node.js LTS
- Claude Code CLI installed globally via npm
- Authentication via either ANTHROPIC_API_KEY or CLAUDE_CODE_OAUTH_TOKEN

## Common Commands

### Claude Code Usage
```bash
claude                              # Start interactive Claude Code session
claude "What does this code do?"   # Ask a specific question
```

### GitHub Plugin Setup
```bash
/install-github-connector           # Install and configure GitHub integration
```

### Strategy Consulting Agent
```bash
npm run build                       # Build the TypeScript project
npm start                           # Run the strategy agent CLI
strategy-agent analyze --company "Company Name" --framework swot
strategy-agent market-entry --industry "Industry" --region "Region"
strategy-agent competitive-analysis --company "Company" --competitors "Comp1,Comp2"
```

## Architecture

### Core Components

1. **Strategy Consulting Agent** (`src/agent/`)
   - `StrategyConsultant.ts`: Main orchestrator using Claude Code SDK
   - Strategic frameworks (SWOT, Porter's Five Forces)
   - Market and competitive analysis modules
   - Report generation capabilities

2. **GitHub Codespaces Configuration** (`.devcontainer/`)
   - `devcontainer.json`: Development container with Claude Code pre-installed
   - `check-api-key.sh`: API key validation on container start
   - Automatic Claude Code CLI setup

3. **Authentication Flow**
   - Primary: ANTHROPIC_API_KEY in Codespaces secrets
   - Alternative: CLAUDE_CODE_OAUTH_TOKEN via GitHub plugin

## Development Guidelines

- Use 2-space indentation for all code files
- This is primarily a configuration repository - avoid adding application code unless extending the Claude Code integration capabilities
- Keep the setup process simple and well-documented for users new to Claude Code