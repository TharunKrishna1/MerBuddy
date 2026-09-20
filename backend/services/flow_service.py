from typing import List, Optional
from schemas import ConversationFlow
from data.mock_flows import mock_flows

class FlowService:
    def __init__(self):
        self.flows: List[ConversationFlow] = list(mock_flows)

    def get_all_flows(self) -> List[ConversationFlow]:
        return self.flows

    def get_flow_by_id(self, flow_id: str) -> Optional[ConversationFlow]:
        return next((f for f in self.flows if f.flowId == flow_id or f.id == flow_id), None)

    def detect_flow_from_intent(self, intent: str) -> ConversationFlow:
        lower = intent.lower()
        if 'discount' in lower or 'coupon' in lower:
            return self.get_flow_by_id('discount_inquiry') or self.flows[1]
        if 'order' in lower or 'track' in lower or 'deliver' in lower:
            return self.get_flow_by_id('order_status') or self.flows[2]
        return self.get_flow_by_id('product_search') or self.flows[0]

flow_service = FlowService()
