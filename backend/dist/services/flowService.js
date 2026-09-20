"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flowService = exports.FlowService = void 0;
const mockFlows_1 = require("../data/mockFlows");
class FlowService {
    flows = [...mockFlows_1.mockFlows];
    getAllFlows() {
        return this.flows;
    }
    getFlowById(flowId) {
        return this.flows.find(f => f.flowId === flowId || f.id === flowId);
    }
    detectFlowFromIntent(intent) {
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
exports.FlowService = FlowService;
exports.flowService = new FlowService();
