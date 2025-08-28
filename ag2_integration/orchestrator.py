"""
AG2 Multi-Agent Orchestrator Example

This example demonstrates how to use the Strategy Consulting Agent
within an AG2 multi-agent swarm for complex business analysis tasks.
"""

import os
import asyncio
import json
from typing import List, Dict, Any
from datetime import datetime

# Try to import AG2/AutoGen components
try:
    from autogen import (
        ConversableAgent,
        GroupChat,
        GroupChatManager,
        UserProxyAgent,
        AssistantAgent
    )
    AG2_AVAILABLE = True
except ImportError:
    print("Warning: AutoGen not installed. Using mock classes for demonstration.")
    AG2_AVAILABLE = False
    
    # Mock classes for demonstration without AG2
    class ConversableAgent:
        def __init__(self, name, **kwargs):
            self.name = name
            self.system_message = kwargs.get('system_message', '')
    
    class AssistantAgent(ConversableAgent):
        pass
    
    class UserProxyAgent(ConversableAgent):
        pass
    
    class GroupChat:
        def __init__(self, agents, messages, max_round):
            self.agents = agents
            self.messages = messages
            self.max_round = max_round
    
    class GroupChatManager(ConversableAgent):
        def __init__(self, groupchat, **kwargs):
            super().__init__("Manager", **kwargs)
            self.groupchat = groupchat

# Import our custom strategy agent
from strategy_agent import StrategyConsultingAgent


class BusinessAnalysisOrchestrator:
    """
    Orchestrates multi-agent collaboration for comprehensive business analysis.
    
    This orchestrator coordinates:
    - Strategy Consulting Agent: Strategic frameworks and analysis
    - Research Agent: Market research and data gathering
    - Financial Agent: Financial analysis and valuation
    - Risk Agent: Risk assessment and mitigation strategies
    """
    
    def __init__(self, strategy_service_url: str = "http://localhost:3001"):
        """
        Initialize the orchestrator with all required agents.
        
        Args:
            strategy_service_url: URL of the TypeScript strategy service
        """
        self.strategy_service_url = strategy_service_url
        self.agents = {}
        self.setup_agents()
    
    def setup_agents(self):
        """Configure all agents for the swarm."""
        
        # 1. Strategy Consulting Agent (our custom TypeScript-backed agent)
        self.agents['strategy'] = StrategyConsultingAgent(
            name="StrategyConsultant",
            service_url=self.strategy_service_url,
            system_message="""You are the lead strategy consultant. 
            Analyze companies using SWOT, Porter's Five Forces, and other frameworks.
            Coordinate with other agents to gather comprehensive insights."""
        )
        
        # 2. Market Research Agent
        self.agents['research'] = AssistantAgent(
            name="MarketResearcher",
            system_message="""You are a market research specialist.
            Gather and analyze market data, industry trends, customer insights, and competitive intelligence.
            Provide data to support strategic analysis.""",
            llm_config={
                "temperature": 0.7,
                "model": "gpt-4"  # Or other available model
            }
        )
        
        # 3. Financial Analysis Agent
        self.agents['financial'] = AssistantAgent(
            name="FinancialAnalyst",
            system_message="""You are a financial analyst.
            Analyze financial statements, calculate key ratios, perform valuations,
            and assess financial health of companies.""",
            llm_config={
                "temperature": 0.5,
                "model": "gpt-4"
            }
        )
        
        # 4. Risk Assessment Agent
        self.agents['risk'] = AssistantAgent(
            name="RiskAnalyst",
            system_message="""You are a risk assessment specialist.
            Identify and evaluate business risks, regulatory compliance issues,
            and provide risk mitigation strategies.""",
            llm_config={
                "temperature": 0.6,
                "model": "gpt-4"
            }
        )
        
        # 5. User Proxy Agent (represents the user)
        self.agents['user'] = UserProxyAgent(
            name="User",
            human_input_mode="TERMINATE",
            max_consecutive_auto_reply=0,
            code_execution_config=False
        )
    
    def create_group_chat(self, max_rounds: int = 10) -> GroupChat:
        """
        Create a group chat with all agents.
        
        Args:
            max_rounds: Maximum number of conversation rounds
            
        Returns:
            GroupChat instance
        """
        agents_list = list(self.agents.values())
        
        group_chat = GroupChat(
            agents=agents_list,
            messages=[],
            max_round=max_rounds
        )
        
        return group_chat
    
    def create_manager(self, group_chat: GroupChat) -> GroupChatManager:
        """
        Create a group chat manager to coordinate the conversation.
        
        Args:
            group_chat: The group chat to manage
            
        Returns:
            GroupChatManager instance
        """
        manager = GroupChatManager(
            groupchat=group_chat,
            llm_config={
                "temperature": 0,
                "model": "gpt-4"
            }
        )
        
        return manager
    
    async def analyze_company_comprehensive(
        self,
        company: str,
        objectives: List[str] = None
    ) -> Dict[str, Any]:
        """
        Perform comprehensive company analysis using all agents.
        
        Args:
            company: Company name to analyze
            objectives: List of analysis objectives
            
        Returns:
            Comprehensive analysis results
        """
        if objectives is None:
            objectives = [
                "Strategic position (SWOT)",
                "Competitive landscape",
                "Financial health",
                "Market opportunities",
                "Risk factors"
            ]
        
        # Create the analysis prompt
        prompt = f"""
        Perform a comprehensive analysis of {company} covering:
        {chr(10).join(f'- {obj}' for obj in objectives)}
        
        Each agent should contribute their expertise:
        - StrategyConsultant: SWOT and strategic frameworks
        - MarketResearcher: Industry and market insights
        - FinancialAnalyst: Financial metrics and valuation
        - RiskAnalyst: Risk assessment and mitigation
        
        Provide actionable recommendations based on the analysis.
        """
        
        # Create group chat and manager
        group_chat = self.create_group_chat(max_rounds=15)
        manager = self.create_manager(group_chat)
        
        # Start the analysis
        print(f"\n🚀 Starting comprehensive analysis of {company}...")
        print("=" * 60)
        
        # Initiate the conversation
        if AG2_AVAILABLE:
            # Real AG2 execution
            self.agents['user'].initiate_chat(
                manager,
                message=prompt
            )
            
            # Extract results from conversation
            results = self._extract_results_from_chat(group_chat.messages)
        else:
            # Mock execution for demonstration
            print("Running in demonstration mode (AG2 not available)")
            results = self._mock_analysis(company, objectives)
        
        return results
    
    def _extract_results_from_chat(self, messages: List[Dict]) -> Dict[str, Any]:
        """
        Extract structured results from chat messages.
        
        Args:
            messages: List of chat messages
            
        Returns:
            Structured analysis results
        """
        results = {
            "company": "",
            "timestamp": datetime.now().isoformat(),
            "strategic_analysis": {},
            "market_research": {},
            "financial_analysis": {},
            "risk_assessment": {},
            "recommendations": []
        }
        
        for message in messages:
            content = message.get("content", "")
            sender = message.get("name", "")
            
            if sender == "StrategyConsultant":
                # Extract strategic analysis
                if "swot" in content.lower():
                    results["strategic_analysis"]["swot"] = content
                elif "porter" in content.lower():
                    results["strategic_analysis"]["porters"] = content
            
            elif sender == "MarketResearcher":
                results["market_research"]["insights"] = content
            
            elif sender == "FinancialAnalyst":
                results["financial_analysis"]["metrics"] = content
            
            elif sender == "RiskAnalyst":
                results["risk_assessment"]["risks"] = content
            
            # Extract recommendations from any agent
            if "recommend" in content.lower():
                import re
                recs = re.findall(r'\d+\.\s+([^\n]+)', content)
                results["recommendations"].extend(recs)
        
        return results
    
    def _mock_analysis(self, company: str, objectives: List[str]) -> Dict[str, Any]:
        """
        Generate mock analysis for demonstration purposes.
        
        Args:
            company: Company name
            objectives: Analysis objectives
            
        Returns:
            Mock analysis results
        """
        return {
            "company": company,
            "timestamp": datetime.now().isoformat(),
            "strategic_analysis": {
                "swot": {
                    "strengths": ["Market leader", "Strong brand", "Innovation"],
                    "weaknesses": ["High costs", "Limited geographic reach"],
                    "opportunities": ["Digital transformation", "Emerging markets"],
                    "threats": ["Competition", "Regulatory changes"]
                },
                "framework": "SWOT Analysis"
            },
            "market_research": {
                "market_size": "$100B",
                "growth_rate": "12% CAGR",
                "key_trends": ["Digitalization", "Sustainability", "Personalization"]
            },
            "financial_analysis": {
                "revenue": "$50B",
                "profit_margin": "15%",
                "roe": "18%",
                "debt_to_equity": "0.8"
            },
            "risk_assessment": {
                "high_risks": ["Market volatility", "Technology disruption"],
                "medium_risks": ["Supply chain", "Talent retention"],
                "mitigation": ["Diversification", "Innovation investment"]
            },
            "recommendations": [
                "Focus on digital transformation initiatives",
                "Expand into high-growth emerging markets",
                "Optimize operational efficiency to improve margins",
                "Strengthen risk management frameworks",
                "Invest in sustainable business practices"
            ]
        }
    
    def generate_report(self, results: Dict[str, Any]) -> str:
        """
        Generate a formatted report from analysis results.
        
        Args:
            results: Analysis results dictionary
            
        Returns:
            Formatted report string
        """
        report = []
        report.append(f"# Comprehensive Business Analysis Report")
        report.append(f"**Company:** {results.get('company', 'N/A')}")
        report.append(f"**Date:** {results.get('timestamp', datetime.now().isoformat())}")
        report.append("")
        
        # Strategic Analysis Section
        if results.get('strategic_analysis'):
            report.append("## Strategic Analysis")
            strategic = results['strategic_analysis']
            
            if 'swot' in strategic:
                report.append("### SWOT Analysis")
                swot = strategic['swot']
                if isinstance(swot, dict):
                    for key in ['strengths', 'weaknesses', 'opportunities', 'threats']:
                        if key in swot:
                            report.append(f"**{key.title()}:**")
                            for item in swot[key]:
                                report.append(f"- {item}")
                            report.append("")
                else:
                    report.append(str(swot))
                    report.append("")
        
        # Market Research Section
        if results.get('market_research'):
            report.append("## Market Research")
            market = results['market_research']
            for key, value in market.items():
                if isinstance(value, list):
                    report.append(f"**{key.replace('_', ' ').title()}:**")
                    for item in value:
                        report.append(f"- {item}")
                else:
                    report.append(f"**{key.replace('_', ' ').title()}:** {value}")
            report.append("")
        
        # Financial Analysis Section
        if results.get('financial_analysis'):
            report.append("## Financial Analysis")
            financial = results['financial_analysis']
            for key, value in financial.items():
                report.append(f"**{key.replace('_', ' ').title()}:** {value}")
            report.append("")
        
        # Risk Assessment Section
        if results.get('risk_assessment'):
            report.append("## Risk Assessment")
            risks = results['risk_assessment']
            for key, value in risks.items():
                if isinstance(value, list):
                    report.append(f"**{key.replace('_', ' ').title()}:**")
                    for item in value:
                        report.append(f"- {item}")
                else:
                    report.append(f"**{key.replace('_', ' ').title()}:** {value}")
            report.append("")
        
        # Recommendations Section
        if results.get('recommendations'):
            report.append("## Strategic Recommendations")
            for i, rec in enumerate(results['recommendations'], 1):
                report.append(f"{i}. {rec}")
            report.append("")
        
        report.append("---")
        report.append("*Report generated by AG2 Multi-Agent Business Analysis System*")
        
        return "\n".join(report)


async def main():
    """
    Main function to demonstrate the orchestrator.
    """
    print("🎯 AG2 Multi-Agent Business Analysis Orchestrator")
    print("=" * 60)
    
    # Initialize orchestrator
    orchestrator = BusinessAnalysisOrchestrator(
        strategy_service_url=os.getenv("STRATEGY_SERVICE_URL", "http://localhost:3001")
    )
    
    # Example 1: Comprehensive company analysis
    print("\n📊 Example 1: Comprehensive Company Analysis")
    print("-" * 40)
    
    company = "Tesla"
    results = await orchestrator.analyze_company_comprehensive(
        company=company,
        objectives=[
            "Strategic market position",
            "Competitive advantages and challenges",
            "Financial performance and health",
            "Growth opportunities",
            "Risk factors and mitigation"
        ]
    )
    
    # Generate and display report
    report = orchestrator.generate_report(results)
    print("\n" + report)
    
    # Save report to file
    output_dir = "output"
    os.makedirs(output_dir, exist_ok=True)
    
    filename = f"{output_dir}/analysis_{company}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
    with open(filename, 'w') as f:
        f.write(report)
    
    print(f"\n✅ Report saved to: {filename}")
    
    # Example 2: Market entry analysis with multiple agents
    print("\n🌍 Example 2: Market Entry Analysis")
    print("-" * 40)
    
    # This would trigger a different agent configuration
    # focused on market entry strategies
    
    print("\n✨ Orchestration complete!")


if __name__ == "__main__":
    # Run the orchestrator
    asyncio.run(main())