"""
AutoGen2 (AG2) Compatible Strategy Consulting Agent

This agent wraps the TypeScript strategy consulting service to work within
the AG2 multi-agent orchestration framework.
"""

import json
import logging
import requests
from typing import Dict, Any, List, Optional, Union
from datetime import datetime
import uuid

# For AG2 compatibility - using basic imports that can be adapted
# to actual autogen imports when available
try:
    from autogen import ConversableAgent, Agent
except ImportError:
    # Fallback for development without autogen installed
    class ConversableAgent:
        def __init__(self, name, **kwargs):
            self.name = name
            self.system_message = kwargs.get('system_message', '')
            
        def register_reply(self, trigger, reply_func, **kwargs):
            pass
    
    Agent = ConversableAgent

logger = logging.getLogger(__name__)

class StrategyConsultingAgent(ConversableAgent):
    """
    AG2-compatible agent that interfaces with the TypeScript strategy consulting service.
    
    This agent can perform:
    - SWOT Analysis
    - Porter's Five Forces Analysis
    - Market Entry Analysis
    - Competitive Analysis
    - Executive Summary Generation
    """
    
    def __init__(
        self,
        name: str = "StrategyConsultant",
        service_url: str = "http://localhost:3001",
        timeout: int = 30,
        **kwargs
    ):
        """
        Initialize the Strategy Consulting Agent.
        
        Args:
            name: Agent name for AG2 identification
            service_url: URL of the TypeScript strategy service
            timeout: HTTP request timeout in seconds
            **kwargs: Additional ConversableAgent parameters
        """
        # Set default system message if not provided
        if 'system_message' not in kwargs:
            kwargs['system_message'] = self._get_default_system_message()
        
        super().__init__(name=name, **kwargs)
        
        self.service_url = service_url.rstrip('/')
        self.timeout = timeout
        self.session = requests.Session()
        self.session_id = str(uuid.uuid4())
        
        # Register reply function for AG2 message handling
        self.register_reply(
            [Agent, None],
            reply_func=self.strategy_reply,
            position=0
        )
        
        logger.info(f"Initialized {name} with service at {service_url}")
    
    def _get_default_system_message(self) -> str:
        """Get the default system message for this agent."""
        return """You are an elite strategy consultant specializing in:
        - Business strategy and competitive analysis (SWOT, Porter's Five Forces)
        - Market entry and expansion strategies
        - Competitive intelligence and positioning
        - Strategic recommendations and action plans
        
        When asked to analyze a company or market, you will:
        1. Identify the appropriate strategic framework
        2. Gather relevant information
        3. Apply the framework systematically
        4. Provide actionable insights and recommendations
        
        You have access to advanced analytical tools and frameworks."""
    
    def strategy_reply(
        self,
        messages: Union[str, List[Dict]],
        sender: Optional[Agent] = None,
        config: Optional[Dict] = None
    ) -> Union[str, Dict, None]:
        """
        Process incoming messages and generate strategy consulting responses.
        
        This is the main AG2 reply function that handles message interpretation
        and routes to appropriate analysis methods.
        """
        try:
            # Parse the message to identify the task
            task = self._parse_message_for_task(messages)
            
            if not task:
                return None  # Let other reply functions handle it
            
            # Execute the appropriate analysis
            result = self._execute_task(task)
            
            if result:
                return self._format_response(result, task)
            
            return None
            
        except Exception as e:
            logger.error(f"Error in strategy_reply: {str(e)}")
            return f"I encountered an error while processing your request: {str(e)}"
    
    def _parse_message_for_task(self, messages: Union[str, List[Dict]]) -> Optional[Dict]:
        """
        Parse incoming messages to identify strategy consulting tasks.
        
        Returns a task dictionary with type and parameters, or None if no task identified.
        """
        # Convert messages to text if needed
        if isinstance(messages, list):
            # Get the last message content
            if messages and isinstance(messages[-1], dict):
                text = messages[-1].get('content', '')
            else:
                text = str(messages[-1]) if messages else ''
        else:
            text = str(messages)
        
        text_lower = text.lower()
        
        # Identify task type based on keywords
        task = None
        
        # SWOT Analysis
        if any(keyword in text_lower for keyword in ['swot', 'strengths', 'weaknesses', 'opportunities', 'threats']):
            company = self._extract_company_name(text)
            if company:
                task = {
                    'type': 'swot',
                    'company': company,
                    'framework': 'swot',
                    'depth': self._extract_depth(text)
                }
        
        # Porter's Five Forces
        elif any(keyword in text_lower for keyword in ["porter", "five forces", "competitive forces", "industry analysis"]):
            company = self._extract_company_name(text)
            if company:
                task = {
                    'type': 'analyze',
                    'company': company,
                    'framework': 'porters-five-forces',
                    'depth': self._extract_depth(text)
                }
        
        # Market Entry Analysis
        elif any(keyword in text_lower for keyword in ['market entry', 'enter market', 'expand into', 'market expansion']):
            task = {
                'type': 'market_entry',
                'industry': self._extract_industry(text),
                'region': self._extract_region(text),
                'company': self._extract_company_name(text)
            }
        
        # Competitive Analysis
        elif any(keyword in text_lower for keyword in ['competitive analysis', 'competitor analysis', 'competition', 'versus', 'vs']):
            task = {
                'type': 'competitive',
                'company': self._extract_company_name(text),
                'competitors': self._extract_competitors(text)
            }
        
        # General company analysis request
        elif 'analyze' in text_lower and self._extract_company_name(text):
            company = self._extract_company_name(text)
            task = {
                'type': 'analyze',
                'company': company,
                'framework': 'swot',  # Default to SWOT
                'depth': self._extract_depth(text)
            }
        
        return task
    
    def _extract_company_name(self, text: str) -> Optional[str]:
        """Extract company name from text using pattern matching."""
        # Simple extraction - in production, use NER or more sophisticated methods
        import re
        
        # Look for patterns like "analyze Tesla", "SWOT for Apple", etc.
        patterns = [
            r'analyze\s+([A-Z][A-Za-z0-9\s&]+?)(?:\s+using|\s+with|\.|,|$)',
            r'(?:SWOT|analysis|evaluate)\s+(?:for|of)\s+([A-Z][A-Za-z0-9\s&]+?)(?:\s+using|\.|,|$)',
            r'company\s+([A-Z][A-Za-z0-9\s&]+?)(?:\s+in|\.|,|$)',
            r'^\s*([A-Z][A-Za-z0-9\s&]+?)\s+(?:SWOT|analysis|strategy)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        # Look for quoted company names
        quoted = re.findall(r'"([^"]+)"', text)
        if quoted:
            return quoted[0]
        
        return None
    
    def _extract_depth(self, text: str) -> str:
        """Extract analysis depth from text."""
        text_lower = text.lower()
        if 'comprehensive' in text_lower or 'detailed' in text_lower or 'thorough' in text_lower:
            return 'comprehensive'
        elif 'quick' in text_lower or 'brief' in text_lower or 'summary' in text_lower:
            return 'quick'
        return 'standard'
    
    def _extract_industry(self, text: str) -> str:
        """Extract industry from text."""
        # Simplified extraction - enhance with NER in production
        import re
        
        patterns = [
            r'(?:industry|sector):\s*([^,\n]+)',
            r'in\s+the\s+([^,\n]+?)\s+(?:industry|sector|market)',
            r'([^,\n]+?)\s+market\s+entry'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return "technology"  # Default
    
    def _extract_region(self, text: str) -> str:
        """Extract region from text."""
        # Simplified extraction
        regions = ['europe', 'asia', 'north america', 'south america', 'africa', 'middle east', 'global']
        text_lower = text.lower()
        
        for region in regions:
            if region in text_lower:
                return region.title()
        
        return "Global"  # Default
    
    def _extract_competitors(self, text: str) -> List[str]:
        """Extract competitor names from text."""
        # Simplified extraction
        import re
        
        # Look for "versus X, Y, Z" or "against X, Y, and Z" patterns
        patterns = [
            r'(?:versus|vs\.?|against)\s+([^\.]+)',
            r'competitors?:\s*([^\.]+)',
            r'compete\s+with\s+([^\.]+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                # Split by common delimiters
                competitors_text = match.group(1)
                competitors = re.split(r'[,;]|\sand\s', competitors_text)
                return [c.strip() for c in competitors if c.strip()]
        
        return []
    
    def _execute_task(self, task: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Execute the identified task by calling the TypeScript service.
        
        Returns the analysis result or None if execution fails.
        """
        try:
            task_type = task.get('type')
            
            if task_type in ['analyze', 'swot']:
                return self.analyze_company(
                    company=task.get('company'),
                    framework=task.get('framework', 'swot'),
                    depth=task.get('depth', 'standard')
                )
            
            elif task_type == 'market_entry':
                return self.analyze_market_entry(
                    industry=task.get('industry'),
                    region=task.get('region'),
                    company=task.get('company')
                )
            
            elif task_type == 'competitive':
                return self.analyze_competitive(
                    company=task.get('company'),
                    competitors=task.get('competitors', [])
                )
            
            return None
            
        except Exception as e:
            logger.error(f"Task execution failed: {str(e)}")
            return None
    
    def _format_response(self, result: Dict[str, Any], task: Dict[str, Any]) -> str:
        """
        Format the analysis result for AG2 conversation.
        
        Converts the structured result into a readable message.
        """
        if not result:
            return "Analysis could not be completed."
        
        response = []
        
        # Add header based on task type
        task_type = task.get('type')
        if task_type in ['analyze', 'swot']:
            response.append(f"# Strategic Analysis: {task.get('company')}")
            response.append(f"**Framework:** {result.get('framework', 'SWOT').upper()}")
        elif task_type == 'market_entry':
            response.append(f"# Market Entry Analysis")
            response.append(f"**Industry:** {task.get('industry')}")
            response.append(f"**Region:** {task.get('region')}")
        elif task_type == 'competitive':
            response.append(f"# Competitive Analysis: {task.get('company')}")
        
        response.append(f"**Date:** {datetime.now().strftime('%Y-%m-%d')}\n")
        
        # Add analysis content
        analysis = result.get('analysis', {})
        
        # Format based on framework
        if result.get('framework') == 'swot' and isinstance(analysis, dict):
            if 'strengths' in analysis:
                response.append("## Strengths")
                for item in analysis.get('strengths', [])[:5]:
                    response.append(f"- {item}")
                response.append("")
                
            if 'weaknesses' in analysis:
                response.append("## Weaknesses")
                for item in analysis.get('weaknesses', [])[:5]:
                    response.append(f"- {item}")
                response.append("")
                
            if 'opportunities' in analysis:
                response.append("## Opportunities")
                for item in analysis.get('opportunities', [])[:5]:
                    response.append(f"- {item}")
                response.append("")
                
            if 'threats' in analysis:
                response.append("## Threats")
                for item in analysis.get('threats', [])[:5]:
                    response.append(f"- {item}")
                response.append("")
        
        # Add recommendations
        recommendations = result.get('recommendations', [])
        if recommendations:
            response.append("## Strategic Recommendations")
            for i, rec in enumerate(recommendations[:5], 1):
                response.append(f"{i}. {rec}")
        
        return "\n".join(response)
    
    # Service interaction methods
    
    def analyze_company(
        self,
        company: str,
        framework: str = 'swot',
        depth: str = 'standard'
    ) -> Optional[Dict[str, Any]]:
        """
        Analyze a company using specified strategic framework.
        
        Args:
            company: Company name to analyze
            framework: Analysis framework (swot, porters-five-forces, etc.)
            depth: Analysis depth (quick, standard, comprehensive)
            
        Returns:
            Analysis result dictionary or None if request fails
        """
        endpoint = f"{self.service_url}/api/analyze"
        data = {
            'company': company,
            'framework': framework,
            'depth': depth,
            'sessionId': self.session_id
        }
        
        return self._make_request(endpoint, data)
    
    def analyze_market_entry(
        self,
        industry: str,
        region: str,
        company: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Analyze market entry opportunities.
        
        Args:
            industry: Target industry
            region: Target region
            company: Company considering entry (optional)
            
        Returns:
            Market analysis result or None
        """
        endpoint = f"{self.service_url}/api/market-entry"
        data = {
            'industry': industry,
            'region': region,
            'company': company,
            'sessionId': self.session_id
        }
        
        return self._make_request(endpoint, data)
    
    def analyze_competitive(
        self,
        company: str,
        competitors: List[str]
    ) -> Optional[Dict[str, Any]]:
        """
        Perform competitive analysis.
        
        Args:
            company: Main company to analyze
            competitors: List of competitor names
            
        Returns:
            Competitive analysis result or None
        """
        endpoint = f"{self.service_url}/api/competitive"
        data = {
            'company': company,
            'competitors': competitors,
            'sessionId': self.session_id
        }
        
        return self._make_request(endpoint, data)
    
    def _make_request(self, endpoint: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Make HTTP request to the TypeScript service.
        
        Includes retry logic and error handling.
        """
        max_retries = 3
        retry_delay = 1
        
        for attempt in range(max_retries):
            try:
                response = self.session.post(
                    endpoint,
                    json=data,
                    timeout=self.timeout,
                    headers={'Content-Type': 'application/json'}
                )
                
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 503:  # Service unavailable
                    if attempt < max_retries - 1:
                        import time
                        time.sleep(retry_delay * (attempt + 1))
                        continue
                else:
                    logger.error(f"Request failed with status {response.status_code}: {response.text}")
                    return None
                    
            except requests.exceptions.Timeout:
                logger.error(f"Request timeout after {self.timeout} seconds")
                if attempt < max_retries - 1:
                    continue
                return None
            except requests.exceptions.ConnectionError:
                logger.error(f"Connection error to {endpoint}")
                return None
            except Exception as e:
                logger.error(f"Unexpected error in request: {str(e)}")
                return None
        
        return None
    
    def check_service_health(self) -> bool:
        """
        Check if the TypeScript service is healthy and reachable.
        
        Returns:
            True if service is healthy, False otherwise
        """
        try:
            response = self.session.get(
                f"{self.service_url}/api/health",
                timeout=5
            )
            return response.status_code == 200
        except:
            return False