import React from 'react';
import {
  LayoutDashboard,
  Mic,
  Sliders,
  Terminal,
  GitFork,
  Package,
  CheckSquare,
  PhoneCall,
  BarChart3
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'live_agent'
  | 'merchant_config'
  | 'prompt_studio'
  | 'conversation_flows'
  | 'product_data'
  | 'evaluations'
  | 'call_logs'
  | 'analytics';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  breakCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, breakCount }) => {
  const menuItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'live_agent', label: 'Live Voice Agent', icon: <Mic size={18} /> },
    { id: 'merchant_config', label: 'Merchant Config', icon: <Sliders size={18} /> },
    { id: 'prompt_studio', label: 'Prompt Studio', icon: <Terminal size={18} /> },
    { id: 'conversation_flows', label: 'Conversation Flows', icon: <GitFork size={18} /> },
    { id: 'product_data', label: 'Product Data', icon: <Package size={18} /> },
    { id: 'evaluations', label: 'Evaluations', icon: <CheckSquare size={18} /> },
    { id: 'call_logs', label: 'Call Logs', icon: <PhoneCall size={18} />, badge: breakCount },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> }
  ];

  return (
    <aside className="w-64 bg-navy border-r border-navy-light text-neutral flex flex-col justify-between select-none">
      <div className="p-4 space-y-1">
        <p className="text-[11px] font-bold text-neutral-dark uppercase tracking-wider px-3 mb-2">
          Management SaaS
        </p>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-accent text-dark font-semibold shadow-md shadow-accent/20'
                  : 'text-neutral hover:bg-navy-light hover:text-surface'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={isActive ? 'text-dark' : 'text-accent'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    isActive ? 'bg-dark text-surface' : 'bg-red-500 text-surface'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-navy-light bg-navy-dark/50 text-xs text-neutral-dark">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-neutral">MerBuddy Core</span>
          <span className="text-accent text-[10px] font-mono">v1.0.0</span>
        </div>
        <p className="text-[11px] leading-tight">Configurable Voice Commerce Agent Platform</p>
      </div>
    </aside>
  );
};
