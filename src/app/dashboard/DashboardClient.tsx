"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar
} from "recharts";
import { DollarSign, Activity, Clock, AlertTriangle, ExternalLink } from "lucide-react";

type StatsData = {
  totalCostToday: string;
  monthlyCost: string;
  avgLatency: number;
  errorRate: string;
  chartData: { date: string; displayDate: string; cost: number; requests: number }[];
};

type LogData = {
  id: string;
  model: string;
  tokens_input: number;
  tokens_output: number;
  cost: number;
  latency: number;
  status: string;
  createdAt: string;
};

export default function DashboardClient() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [logs, setLogs] = useState<LogData[]>([]);
  const [logsMeta, setLogsMeta] = useState({ page: 1, totalPages: 1 });
  
  // Alerts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [alertsOverview, setAlertsOverview] = useState<{ rules: any[], events: any[] } | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLogs = useCallback(async (page = 1) => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (statusFilter) params.append("status", statusFilter);
      if (dateFilter) params.append("date", dateFilter);

      const res = await fetch(`/api/logs?${params.toString()}`);
      const data = await res.json();
      if (data.data) {
        setLogs(data.data);
        setLogsMeta(data.meta);
      }
    } catch (e) {
      console.error(e);
    }
  }, [statusFilter, dateFilter]);

  useEffect(() => {
    fetchStats();
    
    // Fetch Alerts Rules and History
    const fetchAlerts = async () => {
      try {
        const res = await fetch("/api/alerts");
        const data = await res.json();
        setAlertsOverview(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAlerts();
  }, []);

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Cost Today" value={`$${stats?.totalCostToday || "0.00"}`} icon={DollarSign} />
        <StatCard title="Monthly Cost" value={`$${stats?.monthlyCost || "0.00"}`} icon={Activity} />
        <StatCard title="Avg Latency" value={`${stats?.avgLatency || 0}ms`} icon={Clock} />
        <StatCard title="Error Rate" value={`${stats?.errorRate || 0}%`} icon={AlertTriangle} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-400 mb-6">Cost Over Time (Last 30 Days)</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.chartData || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis dataKey="displayDate" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#e4e4e7' }}
                />
                <Area type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-400 mb-6">Requests Per Day</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.chartData || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis dataKey="displayDate" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#e4e4e7' }}
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                />
                <Bar dataKey="requests" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Logs Table with Filters */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-sm overflow-hidden">
        <div className="border-b border-zinc-800 p-4 sm:flex sm:items-center sm:justify-between">
          <h3 className="text-base font-semibold text-white">API Logs</h3>
          <div className="mt-3 sm:ml-4 sm:mt-0 flex gap-3">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="block rounded-md border-0 bg-zinc-950 py-1.5 pl-3 pr-8 text-white ring-1 ring-inset ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 [color-scheme:dark]"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block rounded-md border-0 bg-zinc-950 py-1.5 pl-3 pr-8 text-white ring-1 ring-inset ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
            >
              <option value="">All Statuses</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-800 text-left text-sm">
            <thead className="bg-zinc-900/80 text-zinc-400">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">Model</th>
                <th scope="col" className="px-6 py-3 font-medium">Tokens (In/Out)</th>
                <th scope="col" className="px-6 py-3 font-medium">Cost</th>
                <th scope="col" className="px-6 py-3 font-medium">Latency</th>
                <th scope="col" className="px-6 py-3 font-medium">Status</th>
                <th scope="col" className="px-6 py-3 font-medium text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 border-t border-zinc-800 bg-transparent">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                    No logs found matching your criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-200">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-zinc-500" />
                        {log.model}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      <span className="text-zinc-300">{log.tokens_input}</span> / <span>{log.tokens_output}</span>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">${log.cost.toFixed(4)}</td>
                    <td className="px-6 py-4 text-zinc-400">{log.latency}ms</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        log.status === "success" 
                          ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" 
                          : "bg-red-500/10 text-red-400 ring-red-500/20"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-zinc-500">
                      {format(new Date(log.createdAt), "MMM d, HH:mm")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {logsMeta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900/30 px-4 py-3 sm:px-6">
            <div className="hidden sm:block">
              <p className="text-sm text-zinc-400">
                Page <span className="font-medium text-white">{logsMeta.page}</span> of <span className="font-medium text-white">{logsMeta.totalPages}</span>
              </p>
            </div>
            <div className="flex flex-1 justify-between sm:justify-end gap-2">
              <button
                onClick={() => fetchLogs(Math.max(1, logsMeta.page - 1))}
                disabled={logsMeta.page === 1}
                className="relative inline-flex items-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-zinc-800 hover:bg-zinc-800 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => fetchLogs(Math.min(logsMeta.totalPages, logsMeta.page + 1))}
                disabled={logsMeta.page === logsMeta.totalPages}
                className="relative inline-flex items-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-zinc-800 hover:bg-zinc-800 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Alerts Configurations & History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-white mb-4">Configured Alert Rules</h3>
          {alertsOverview?.rules?.length === 0 ? (
            <p className="text-zinc-500 text-sm">No alert rules configured yet.</p>
          ) : (
            <div className="space-y-3">
              {alertsOverview?.rules?.map((rule, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-800">
                  <div className="flex items-center gap-3">
                    {rule.type === "cost" ? <DollarSign className="w-4 h-4 text-emerald-400" /> : <Activity className="w-4 h-4 text-purple-400" />}
                    <span className="text-sm font-medium text-zinc-300 capitalize">{rule.type} Threshold</span>
                  </div>
                  <span className="text-sm font-semibold text-zinc-100">
                    {rule.type === "cost" ? `$${rule.threshold}` : `${rule.threshold}ms`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-white mb-4">Recent Triggered Alerts</h3>
          {alertsOverview?.events?.length === 0 ? (
            <p className="text-zinc-500 text-sm">No alerts triggered recently.</p>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {alertsOverview?.events?.map((evt, idx) => (
                <div key={idx} className="flex flex-col p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-semibold text-red-500 tracking-wider uppercase">{evt.type} Alert</span>
                  </div>
                  <p className="text-sm text-red-200">{evt.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StatCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: any }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-zinc-800 p-3">
          <Icon className="h-5 w-5 text-zinc-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-400 truncate">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}
