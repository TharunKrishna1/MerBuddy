import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Merchant } from './types';
import { api } from './services/api';

import { Dashboard } from './pages/Dashboard';
import { LiveAgent } from './pages/LiveAgent';
import { MerchantConfig } from './pages/MerchantConfig';
import { PromptStudio } from './pages/PromptStudio';
import { ConversationFlows } from './pages/ConversationFlows';
import { ProductData } from './pages/ProductData';
import { Evaluations } from './pages/Evaluations';
import { CallLogs } from './pages/CallLogs';
import { Analytics } from './pages/Analytics';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);

  useEffect(() => {
    async function loadMerchants() {
      try {
        const list = await api.getMerchants();
        setMerchants(list);
        if (list.length > 0) {
          setSelectedMerchant(list[0]);
        }
      } catch (err) {
        console.error('Failed to fetch merchants:', err);
      }
    }
    loadMerchants();
  }, []);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard selectedMerchant={selectedMerchant} onNavigate={setActiveTab} />;
      case 'live_agent':
        return <LiveAgent merchant={selectedMerchant} />;
      case 'merchant_config':
        return (
          <MerchantConfig
            merchant={selectedMerchant}
            onUpdateMerchant={(updated) => {
              setSelectedMerchant(updated);
              setMerchants(merchants.map((m) => (m.id === updated.id ? updated : m)));
            }}
          />
        );
      case 'prompt_studio':
        return <PromptStudio merchant={selectedMerchant} />;
      case 'conversation_flows':
        return <ConversationFlows />;
      case 'product_data':
        return <ProductData />;
      case 'evaluations':
        return <Evaluations merchant={selectedMerchant} />;
      case 'call_logs':
        return <CallLogs merchant={selectedMerchant} />;
      case 'analytics':
        return <Analytics merchant={selectedMerchant} />;
      default:
        return <Dashboard selectedMerchant={selectedMerchant} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark text-neutral flex flex-col font-sans">
      <Navbar
        merchants={merchants}
        selectedMerchant={selectedMerchant}
        onSelectMerchant={setSelectedMerchant}
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} breakCount={1} />
        <main className="flex-1 overflow-y-auto bg-dark">{renderActivePage()}</main>
      </div>
    </div>
  );
};

export default App;
