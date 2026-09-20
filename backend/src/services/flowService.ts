import { ConversationFlow } from '../types';
import { mockFlows } from '../data/mockFlows';

export class FlowService {
  private flows: ConversationFlow[] = [...mockFlows];

  public getAllFlows(): ConversationFlow[] {
    return this.flows;
  }

  public getFlowById(flowId: string): ConversationFlow | undefined {
    return this.flows.find(f => f.flowId === flowId || f.id === flowId);
  }

  public detectFlowFromIntent(intent: string): ConversationFlow {
    if (intent.includes('discount') || intent.includes('coupon')) {
      return this.getFlowById('discount_inquiry') || this.flows[1];
    }
    if (intent.includes('order') || intent.includes('track') || intent.includes('delivery')) {
      return this.getFlowById('order_status') || this.flows[2];
    }
    if (intent.includes('out_of_stock')) {
      return this.getFlowById('out_of_stock') || this.flows[3];
    }
    return this.getFlowById('product_search') || this.flows[0];
  }
}

export const flowService = new FlowService();
