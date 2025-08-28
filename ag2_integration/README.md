# AG2 Integration for Strategy Consulting Agent

## Overview

This integration enables the TypeScript Strategy Consulting Agent to work within the AutoGen2 (AG2) multi-agent orchestration framework. The architecture uses a REST API bridge to connect the TypeScript service with Python-based AG2 agents.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    AG2 Orchestrator                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │                  GroupChatManager                 │   │
│  └──────────────────────────────────────────────────┘   │
│                           │                               │
│  ┌──────────┬──────────┬─┴─────────┬──────────┐        │
│  │Strategy  │Research  │Financial  │Risk       │        │
│  │Agent     │Agent     │Agent      │Agent      │        │
│  └────┬─────┴──────────┴───────────┴──────────┘        │
└───────┼──────────────────────────────────────────────────┘
        │ HTTP/REST
        ▼
┌──────────────────────────────────────────────────────────┐
│           TypeScript Strategy Service (Port 3001)         │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Express REST API                     │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │         StrategyConsultant + Frameworks          │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

## Components

### 1. Python AG2 Wrapper (`strategy_agent.py`)
- Extends `ConversableAgent` for AG2 compatibility
- Parses messages to identify strategy tasks
- Communicates with TypeScript service via HTTP
- Formats responses for AG2 conversation flow

### 2. TypeScript REST API (`src/api/server.ts`)
- Express server exposing strategy consulting capabilities
- Endpoints for company analysis, market entry, competitive analysis
- Session management for stateful conversations
- Health checks and monitoring

### 3. Session Manager (`src/api/sessions.ts`)
- Maintains conversation context across API calls
- Stores analysis history
- Manages session lifecycle and cleanup

### 4. Orchestrator (`orchestrator.py`)
- Coordinates multiple agents for comprehensive analysis
- Manages group chat and agent interactions
- Generates consolidated reports

## Installation

### Prerequisites
- Docker and Docker Compose
- Python 3.10+
- Node.js 18+
- TypeScript 5.0+

### Setup

1. **Build the TypeScript service:**
```bash
cd ..
npm install
npm run build
```

2. **Install Python dependencies:**
```bash
cd ag2_integration
pip install -r requirements.txt
```

3. **Start services with Docker:**
```bash
docker-compose up -d
```

## Usage

### Quick Start

1. **Start the TypeScript service:**
```bash
npm run start:api
```

2. **Run the orchestrator:**
```bash
cd ag2_integration
python orchestrator.py
```

### Using the Strategy Agent in AG2

```python
from strategy_agent import StrategyConsultingAgent

# Create the agent
strategy_agent = StrategyConsultingAgent(
    name="StrategyConsultant",
    service_url="http://localhost:3001"
)

# Use in AG2 conversation
response = strategy_agent.strategy_reply(
    "Perform a SWOT analysis of Tesla",
    sender=user_proxy
)
```

### API Endpoints

#### Company Analysis
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Tesla",
    "framework": "swot",
    "depth": "comprehensive"
  }'
```

#### Market Entry Analysis
```bash
curl -X POST http://localhost:3001/api/market-entry \
  -H "Content-Type: application/json" \
  -d '{
    "industry": "renewable energy",
    "region": "Europe",
    "company": "TechCorp"
  }'
```

#### Competitive Analysis
```bash
curl -X POST http://localhost:3001/api/competitive \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Netflix",
    "competitors": ["Disney+", "HBO Max", "Amazon Prime"]
  }'
```

## Multi-Agent Scenarios

### Example 1: Comprehensive Company Analysis

The orchestrator coordinates multiple agents:
1. **Strategy Agent**: SWOT and Porter's Five Forces
2. **Research Agent**: Market trends and customer insights
3. **Financial Agent**: Financial metrics and valuation
4. **Risk Agent**: Risk assessment and mitigation

```python
orchestrator = BusinessAnalysisOrchestrator()
results = await orchestrator.analyze_company_comprehensive(
    company="Apple",
    objectives=[
        "Strategic position",
        "Financial health",
        "Market opportunities",
        "Risk factors"
    ]
)
```

### Example 2: Market Entry Strategy

Agents collaborate to evaluate market entry:
1. **Strategy Agent**: Market entry framework
2. **Research Agent**: Local market conditions
3. **Financial Agent**: Investment requirements
4. **Risk Agent**: Regulatory and operational risks

## Configuration

### Environment Variables

**TypeScript Service:**
```bash
PORT=3001                    # API server port
USE_DEMO=true               # Use demo mode (no Claude API)
NODE_ENV=production         # Environment
ANTHROPIC_API_KEY=xxx       # For production mode
```

**Python AG2:**
```bash
STRATEGY_SERVICE_URL=http://localhost:3001  # Service URL
OPENAI_API_KEY=xxx                          # For AG2 agents
```

### Docker Deployment

```yaml
# docker-compose.yml
services:
  strategy-service:
    build:
      context: .
      dockerfile: Dockerfile.service
    ports:
      - "3001:3001"
    environment:
      - USE_DEMO=true
```

## Session Management

Sessions maintain context across multiple interactions:

```python
# Create session
session_id = strategy_agent.session_id

# Session is automatically maintained across calls
result1 = strategy_agent.analyze_company("Tesla", "swot")
result2 = strategy_agent.analyze_competitive("Tesla", ["Rivian", "Lucid"])
# Both analyses share the same session context
```

## Error Handling

The integration includes comprehensive error handling:

1. **Retry Logic**: Automatic retries for transient failures
2. **Timeout Management**: Configurable timeouts for API calls
3. **Graceful Degradation**: Falls back to cached results when service unavailable
4. **Error Reporting**: Detailed error messages for debugging

## Monitoring

### Health Check
```bash
curl http://localhost:3001/api/health
```

Response:
```json
{
  "status": "healthy",
  "service": "strategy-consulting-agent",
  "mode": "demo",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Service Info
```bash
curl http://localhost:3001/api/info
```

## Testing

### Unit Tests
```bash
# Python tests
cd ag2_integration
pytest

# TypeScript tests
cd ..
npm test
```

### Integration Tests
```bash
# Start services
docker-compose up -d

# Run integration tests
python test_integration.py
```

## Production Deployment

### 1. Build Production Images
```bash
docker build -f Dockerfile.service -t strategy-service:prod .
docker build -f ag2_integration/Dockerfile -t ag2-orchestrator:prod ./ag2_integration
```

### 2. Deploy with Kubernetes
```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: strategy-service
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: strategy-service
        image: strategy-service:prod
        ports:
        - containerPort: 3001
```

### 3. Configure Load Balancing
Use Nginx or cloud load balancer for high availability.

## Troubleshooting

### Service Not Responding
1. Check service health: `curl http://localhost:3001/api/health`
2. View logs: `docker logs strategy-service`
3. Verify network connectivity: `ping localhost`

### AG2 Agent Not Finding Tasks
1. Check message parsing in `_parse_message_for_task()`
2. Verify keywords match expected patterns
3. Enable debug logging: `logging.basicConfig(level=logging.DEBUG)`

### Session Issues
1. Check session timeout settings
2. Verify session ID is being passed correctly
3. Monitor session cleanup logs

## Best Practices

1. **Use Session Management**: Maintain context for better analysis
2. **Implement Caching**: Cache frequently requested analyses
3. **Monitor Performance**: Track API response times
4. **Set Appropriate Timeouts**: Balance between completeness and responsiveness
5. **Handle Errors Gracefully**: Provide meaningful error messages
6. **Log Everything**: Comprehensive logging for debugging
7. **Version Your API**: Use API versioning for backward compatibility

## Contributing

1. Fork the repository
2. Create feature branch
3. Implement changes with tests
4. Submit pull request

## License

MIT

## Support

For issues or questions:
- GitHub Issues: [Link to repository]
- Documentation: [Link to docs]
- Community: [Link to Discord/Slack]