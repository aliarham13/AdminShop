"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SalesReportPage() {
  const [stats, setStats] = useState<any>(null);
  const [salesTrend, setSalesTrend] = useState<any[]>([]);
  const [categorySales, setCategorySales] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch Key Stats
    fetch("http://localhost:8000/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Stats error:", err));

    // 2. Fetch Sales Trend Data
    fetch("http://localhost:8000/api/dashboard/sales-chart")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSalesTrend(data);
      })
      .catch((err) => console.error("Sales chart error:", err));

    // 3. Fetch Category Revenue
    fetch("http://localhost:8000/api/dashboard/category-sales")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategorySales(data);
      })
      .catch((err) => console.error("Category sales error:", err));

    // 4. Fetch All Orders for Top Transactions
    fetch("http://localhost:8000/api/orders/")
      .then((res) => res.json())
      .then((data) => {
        const orderList = Array.isArray(data) ? data : data.items || [];
        setOrders(orderList);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Orders error:", err);
        setLoading(false);
      });
  }, []);

  // Filter completed transactions and sort by largest revenue
  const topTransactions = orders
    .filter((o) => o.status === "Completed")
    .sort((a, b) => b.total_amount - a.total_amount)
    .slice(0, 5);

  const completedOrdersCount = orders.filter((o) => o.status === "Completed").length;
  const netRevenue = stats?.total_sales || 0;
  const avgTicket = stats?.avg_order_value || (completedOrdersCount > 0 ? (netRevenue / completedOrdersCount).toFixed(2) : "0.00");

  if (loading) {
    return <p className="p-8 text-slate-500 font-medium">Generating sales analytics report...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Sales Report</h1>
        <p className="text-sm text-slate-500">
          Financial breakdown, net transaction totals, and category revenue performance.
        </p>
      </div>

      {/* KPI Overview Strip (Matched to Dashboard Styling) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 font-medium">Gross Revenue</p>
          <h3 className="text-xl font-bold text-slate-800 mt-1">
            ${Number(netRevenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-emerald-500 mt-1 font-semibold">Active Revenue</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 font-medium">Average Ticket Size</p>
          <h3 className="text-xl font-bold text-slate-800 mt-1">
            ${avgTicket}
          </h3>
          <p className="text-xs text-indigo-500 mt-1 font-semibold">Per completed transaction</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 font-medium">Successful Orders</p>
          <h3 className="text-xl font-bold text-slate-800 mt-1">{completedOrdersCount}</h3>
          <p className="text-xs text-blue-500 mt-1 font-semibold">
            {orders.length > 0 ? `${Math.round((completedOrdersCount / orders.length) * 100)}%` : "0%"} fulfillment rate
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 font-medium">Active Customers</p>
          <h3 className="text-xl font-bold text-slate-800 mt-1">{stats?.total_customers || 0}</h3>
          <p className="text-xs text-amber-500 mt-1 font-semibold">Unique client accounts</p>
        </div>
      </div>

      {/* Primary Analytics Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Revenue Curve */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Revenue Trajectory</h2>
              <p className="text-xs text-slate-400">Order batch progression and sales velocity</p>
            </div>
            <span className="text-xs border border-slate-200 px-2 py-1 rounded-md text-slate-500">
              USD ($)
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend.length > 0 ? salesTrend : [{ date: "No data", sales: 0 }]}>
                <defs>
                  <linearGradient id="reportPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" fontSize={11} stroke="#94A3B8" tickLine={false} />
                <YAxis fontSize={11} stroke="#94A3B8" tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#6366F1"
                  strokeWidth={3}
                  fill="url(#reportPurple)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 5 Cols: Category Sales Share */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-slate-800">Department Contribution</h2>
              <span className="text-xs text-slate-400">Inventory Value</span>
            </div>

            <div className="space-y-4">
              {categorySales.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No category metrics recorded.</p>
              ) : (
                categorySales.map((cat) => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">{cat.name}</span>
                      <span className="font-semibold text-slate-800">{cat.amount}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${cat.color}`} style={{ width: cat.width }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}