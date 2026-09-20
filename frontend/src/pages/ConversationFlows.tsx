import React, { useState } from 'react';
import { ConversationFlow } from '../types';
import { FlowDiagram } from '../components/FlowDiagram';
import { GitFork, Layers } from 'lucide-react';

export const ConversationFlows: React.FC = () => {
  const [flows] = useState<ConversationFlow[]>([
    {
      id: 'flow_001',
      flowId: 'product_search',
      name: 'Product Discovery & Stock Check',
      category: 'PRODUCT_DISCOVERY',
      description: 'Standard flow when customer inquires about footwear or apparel attributes (color, size, category).',
      isActive: true,
      steps: [
        { id: 's1', label: 'Understand Requirement', action: 'parse_user_intent', description: 'Extract category, size, color, gender from user audio/text.' },
        { id: 's2', label: 'Extract Attributes', action: 'extract_attributes', description: 'Identify parameters like size=9, color=black, category=running shoes.' },
        { id: 's3', label: 'Search Products', action: 'search_products_tool', description: 'Query product database via search_products tool call.' },
        { id: 's4', label: 'Check Inventory', action: 'check_inventory_tool', description: 'Verify size variant quantity > 0 in real-time.' },
        { id: 's5', label: 'Apply Discount', action: 'calculate_discount', description: 'Compute active promotional discounts via pricing engine.' },
        { id: 's6', label: 'Present Product', action: 'generate_voice_response', description: 'Synthesize short voice response with price & availability.' }
      ]
    },
    {
      id: 'flow_002',
      flowId: 'discount_inquiry',
      name: 'Discount & Coupon Evaluation',
      category: 'DISCOUNT_QUERY',
      description: 'Flow for validating coupon codes and presenting promotional savings.',
      isActive: true,
      steps: [
        { id: 's1', label: 'Identify Coupon Code', action: 'extract_coupon', description: 'Extract promo code (e.g. FESTIVE20) from user inquiry.' },
        { id: 's2', label: 'Validate Rules', action: 'validate_discount_rules', description: 'Verify minimum order value and active status in backend.' },
        { id: 's3', label: 'Calculate Final Price', action: 'compute_pricing', description: 'Execute pricing engine calculation.' },
        { id: 's4', label: 'Respond Voice', action: 'tts_response', description: 'Present exact savings in speech-friendly words.' }
      ]
    },
    {
      id: 'flow_003',
      flowId: 'order_status',
      name: 'Order Status Lookup',
      category: 'ORDER_STATUS',
      description: 'Flow for tracking dispatch and shipping updates via order ID.',
      isActive: true,
      steps: [
        { id: 's1', label: 'Request Order ID', action: 'prompt_order_id', description: 'Ask customer for 5-digit order number.' },
        { id: 's2', label: 'Verify Order ID', action: 'validate_order_id', description: 'Ensure order number is valid format.' },
        { id: 's3', label: 'Fetch Tracking Data', action: 'get_order_status_tool', description: 'Retrieve shipment status from logistics backend.' },
        { id: 's4', label: 'State Delivery ETA', action: 'respond_eta', description: 'Provide delivery date and tracking link notification.' }
      ]
    }
  ]);

  const [selectedFlow, setSelectedFlow] = useState<ConversationFlow>(flows[0]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="border-b border-navy-light pb-5">
        <h2 className="text-2xl font-extrabold text-surface flex items-center space-x-2">
          <GitFork className="text-accent" />
          <span>Conversation Flow Engine</span>
        </h2>
        <p className="text-xs text-neutral-dark mt-1">
          Structured JSON state diagrams orchestrating agent intent execution.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Flow List */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-dark block px-1">
            Available Flow Diagrams
          </span>
          {flows.map((f) => (
            <div
              key={f.id}
              onClick={() => setSelectedFlow(f)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedFlow.id === f.id
                  ? 'bg-accent text-dark border-accent font-bold shadow-md shadow-accent/20'
                  : 'bg-navy border-navy-light text-neutral hover:bg-navy-dark'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold font-mono uppercase">{f.flowId}</span>
                <Layers size={14} />
              </div>
              <h4 className="text-sm">{f.name}</h4>
            </div>
          ))}
        </div>

        {/* Visual Flow Canvas */}
        <div className="lg:col-span-3 space-y-6">
          <FlowDiagram flow={selectedFlow} activeStepIndex={2} />

          {/* JSON Schema Inspector */}
          <div className="bg-navy p-6 rounded-2xl border border-navy-light space-y-3">
            <h3 className="text-sm font-bold text-surface">Structured JSON Representation</h3>
            <pre className="bg-dark p-4 rounded-xl text-xs text-accent font-mono overflow-x-auto">
              {JSON.stringify(selectedFlow, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
