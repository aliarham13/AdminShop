"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  MousePointerClick,
  RotateCcw,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [orderChartData, setOrderChartData] = useState<any[]>([]);
  const [categorySales, setCategorySales] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("DASHBOARD USEEFFECT STARTED");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.log(err));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/sales-chart`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSalesData(data);
      })
      .catch((err) => console.log(err));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/orders-chart`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOrderChartData(data);
      })
      .catch((err) => console.log(err));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/category-sales`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategorySales(data);
      })
      .catch((err) => console.log(err));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/recent-orders`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRecentOrders(data);
      })
      .catch((err) => console.log(err));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/low-stock`)
      .then((res) => res.json())
      .then((data) => {
        console.log("LOW STOCK FROM DASHBOARD:", data);
        if (Array.isArray(data)) setLowStock(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-slate-500 font-medium">Loading store metrics from database...</div>;
  }

  const totalOrdersCount = orderChartData.reduce((sum, item) => sum + item.value, 0);

  const topMetricCards = [
    {
      title: "Total Sales",
      value: `$${Number(stats?.total_sales ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      percent: "18.2%",
      isPositive: true,
      icon: DollarSign,
      iconBg: "bg-indigo-600",
      stroke: "#6366f1",
      gradId: "topSalesGrad",
    },
    {
      title: "Total Orders",
      value: Number(stats?.total_orders ?? 0).toLocaleString(),
      percent: "8.7%",
      isPositive: true,
      icon: ShoppingCart,
      iconBg: "bg-blue-500",
      stroke: "#3b82f6",
      gradId: "topOrdersGrad",
    },
    {
      title: "Total Products",
      value: Number(stats?.total_products ?? 0).toLocaleString(),
      percent: "12.5%",
      isPositive: true,
      icon: Package,
      iconBg: "bg-emerald-500",
      stroke: "#10b981",
      gradId: "topProductsGrad",
    },
    {
      title: "Total Customers",
      value: Number(stats?.total_customers ?? 0).toLocaleString(),
      percent: "11.2%",
      isPositive: true,
      icon: Users,
      iconBg: "bg-amber-500",
      stroke: "#f59e0b",
      gradId: "topCustomersGrad",
    },
    {
      title: "Low Stock Items",
      value: Number(stats?.low_stock_items ?? 0).toLocaleString(),
      percent: "4",
      isPositive: false,
      icon: AlertTriangle,
      iconBg: "bg-rose-500",
      stroke: "#f43f5e",
      gradId: "topStockGrad",
    },
  ];

  const bottomMiniCards = [
    {
      title: "Average Order Value",
      value: `$${Number(stats?.avg_order_value ?? 68.02).toFixed(2)}`,
      trend: "14.6%",
      isPositive: true,
      icon: CreditCard,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50",
    },
    {
      title: "Conversion Rate",
      value: "2.45%",
      trend: "8.2%",
      isPositive: true,
      icon: MousePointerClick,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Return Rate",
      value: "1.32%",
      trend: "2.1%",
      isPositive: false,
      icon: RotateCcw,
      iconColor: "text-rose-500",
      iconBg: "bg-rose-50",
    },
    {
      title: "Customer Growth",
      value: "18.6%",
      trend: "12.4%",
      isPositive: true,
      icon: TrendingUp,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
    {
      title: "Repeat Customers",
      value: "65.3%",
      trend: "9.8%",
      isPositive: true,
      icon: UserCheck,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard 👋</h1>
        <p className="text-sm text-slate-500">Here's what's happening with your store today.</p>
      </div>

      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {topMetricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-2xs relative overflow-hidden flex items-center justify-between transition-all hover:shadow-md h-[92px]"
            >
              <div className="flex items-center gap-2.5 z-10 min-w-0">
                <div
                  className={`w-7 h-7 rounded-full ${card.iconBg} text-white flex items-center justify-center shrink-0 shadow-2xs`}
                >
                  <Icon className="w-4 h-4" strokeWidth={2.2} />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-slate-500 leading-none whitespace-nowrap">{card.title}</p>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight mt-1 whitespace-nowrap">
                    {card.value}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] mt-1 whitespace-nowrap leading-none">
                    {card.isPositive ? (
                      <span className="text-emerald-500 font-semibold flex items-center">
                        <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                        {card.percent}
                      </span>
                    ) : (
                      <span className="text-rose-500 font-semibold flex items-center">
                        <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                        {card.percent}
                      </span>
                    )}
                    <span className="text-slate-400 font-normal">from last month</span>
                  </div>
                </div>
              </div>

              <div className="absolute right-0 bottom-0 w-16 h-8 pointer-events-none z-0">
                <svg className="w-full h-full" viewBox="0 0 64 32" preserveAspectRatio="none" fill="none">
                  <defs>
                    <linearGradient id={card.gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={card.stroke} stopOpacity="0.28" />
                      <stop offset="100%" stopColor={card.stroke} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 10 24 C 24 26, 32 10, 46 16 C 54 20, 58 6, 64 2 L 64 32 L 10 32 Z"
                    fill={`url(#${card.gradId})`}
                  />
                  <path
                    d="M 10 24 C 24 26, 32 10, 46 16 C 54 20, 58 6, 64 2"
                    stroke={card.stroke}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-slate-800">Sales Overview</h3>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity="0.4" />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" fontSize={11} stroke="#94A3B8" tickLine={false} />
                <YAxis fontSize={11} stroke="#94A3B8" tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#6366F1" strokeWidth={3} fill="url(#purpleGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm text-slate-800">Orders Overview</h3>
          </div>
          <div className="h-44 w-44 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderChartData}
                  innerRadius={52}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {orderChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-lg font-bold text-slate-800">{totalOrdersCount}</span>
              <p className="text-[10px] text-slate-400">Total Orders</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-600 mt-2 w-full px-4">
            {orderChartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold text-slate-800">
                  {totalOrdersCount > 0 ? `${Math.round((item.value / totalOrdersCount) * 100)}%` : "0%"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-slate-800">Sales by Category</h3>
            <span className="text-xs text-slate-400">Inventory Value</span>
          </div>
          <div className="space-y-4">
            {categorySales.length === 0 ? (
              <p className="text-xs text-slate-400">No category data available.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm text-slate-800">Low Stock Products</h3>
            <span className="text-xs text-rose-500 font-semibold">{lowStock.length} items</span>
          </div>
          <div className="space-y-3">
            {lowStock.length === 0 ? (
              <p className="text-xs text-slate-400">All inventory adequately stocked.</p>
            ) : (
              lowStock.map((prod) => (
                <div key={prod.id} className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                  <div>
                    <p className="font-semibold text-slate-800">{prod.name}</p>
                    <p className="text-slate-400">SKU: {prod.sku}</p>
                  </div>
                  <span className="text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded">
                    Stock: {prod.stock}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm text-slate-800">Recent Orders</h3>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-slate-500 border-slate-200">
                <th className="pb-2 font-medium">Order ID</th>
                <th className="pb-2 font-medium">Customer</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-slate-400">
                    No orders recorded yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3.5 font-semibold text-slate-700">{order.id}</td>
                    <td className="py-3.5 text-slate-600">{order.name}</td>
                    <td className="py-3.5 text-slate-400">{order.date}</td>
                    <td className="py-3.5 font-medium text-slate-800">{order.amount}</td>
                    <td className="py-3.5">
                      <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-bold">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
        {bottomMiniCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl border border-slate-100 p-3 shadow-2xs flex items-center gap-2.5 hover:shadow-md transition-all h-[76px]"
            >
              <div
                className={`w-8.5 h-8.5 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0`}
              >
                <Icon className="w-4 h-4" strokeWidth={2.2} />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-400 leading-none whitespace-nowrap">{card.title}</p>
                <div className="flex items-center gap-1.5 mt-1.5 leading-none">
                  <span className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
                    {card.value}
                  </span>
                  <span
                    className={`text-[10.5px] font-semibold flex items-center whitespace-nowrap ${
                      card.isPositive ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {card.isPositive ? (
                      <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                    )}
                    {card.trend}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}