import React, { useState, useEffect } from 'react';
import { Merchant, AnalyticsSummary } from '../types';
import { api } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { BarChart3, TrendingUp, Clock, Zap } from 'lucide-react';

interface AnalyticsProps {
  merchant: Merchant | null;
}

export const Analytics: React.FC<AnalyticsProps> = ({ merchant }) => {
  const [data, setData] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const summary = await api.getAnalytics(merchant?.id);
        setData(summary);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      }
    }
    loadAnalytics();
  }, [merchant]);

  if (!data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  const COLORS = ['#FCA311', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="border-b border-navy-light pb-5">
        <h2 className="text-2xl font-extrabold text-surface flex items-center space-x-2">
          <BarChart3 className="text-accent" />
          <span>Call Analytics & Performance Telemetry</span>
        </h2>
        <p className="text-xs text-neutral-dark mt-1">
          Detailed metrics for call volume, turn latencies, break distributions, and prompt evaluation scores.
        </p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-navy p-5 rounded-2xl border border-navy-light shadow-md">
          <span className="text-[10px] uppercase font-bold text-neutral-dark block mb-1">Total Executed Tool Calls</span>
          <span className="text-3xl font-black text-surface">{data.totalToolCalls}</span>
          <span className="text-[11px] text-accent block mt-1">search_products, calculate_price, apply_discount</span>
        </div>

        <div className="bg-navy p-5 rounded-2xl border border-navy-light shadow-md">
          <span className="text-[10px] uppercase font-bold text-neutral-dark block mb-1">Average Response Words</span>
          <span className="text-3xl font-black text-accent">{data.averageResponseWords} <span className="text-sm font-normal text-neutral-dark">words</span></span>
          <span className="text-[11px] text-emerald-400 block mt-1">✓ Voice Optimized (&lt; 25 words)</span>
        </div>

        <div className="bg-navy p-5 rounded-2xl border border-navy-light shadow-md">
          <span className="text-[10px] uppercase font-bold text-neutral-dark block mb-1">Prompt Break Incidents</span>
          <span className="text-3xl font-black text-red-400">{data.promptFailures}</span>
          <span className="text-[11px] text-neutral-dark block mt-1">TTS formatting / Long responses</span>
        </div>

        <div className="bg-navy p-5 rounded-2xl border border-navy-light shadow-md">
          <span className="text-[10px] uppercase font-bold text-neutral-dark block mb-1">Average Turn Latency</span>
          <span className="text-3xl font-black text-surface">{data.averageResponseTimeMs} <span className="text-sm font-normal text-neutral-dark">ms</span></span>
          <span className="text-[11px] text-emerald-400 block mt-1">Gemini Function Calling + TTS</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Call Volume Trend Line Chart */}
        <div className="bg-navy p-6 rounded-2xl border border-navy-light space-y-4">
          <h3 className="text-sm font-bold text-surface">Call Volume & Break Incidents Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.callsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3057" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#14213D', borderColor: '#1e3057', borderRadius: '12px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="calls" stroke="#FCA311" strokeWidth={3} name="Total Calls" />
                <Line type="monotone" dataKey="breaks" stroke="#ef4444" strokeWidth={2} name="Agent Breaks" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Break Category Distribution Pie Chart */}
        <div className="bg-navy p-6 rounded-2xl border border-navy-light space-y-4">
          <h3 className="text-sm font-bold text-surface">Agent Break Category Breakdown</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.breakDistribution}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ category }) => category}
                >
                  {data.breakDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#14213D', borderColor: '#1e3057', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency Breakdown Bar Chart */}
        <div className="lg:col-span-2 bg-navy p-6 rounded-2xl border border-navy-light space-y-4">
          <h3 className="text-sm font-bold text-surface">Turn Latency Breakdown by Architecture Step</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.latencyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3057" />
                <XAxis dataKey="step" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#14213D', borderColor: '#1e3057', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="latencyMs" fill="#FCA311" radius={[8, 8, 0, 0]} name="Latency (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
