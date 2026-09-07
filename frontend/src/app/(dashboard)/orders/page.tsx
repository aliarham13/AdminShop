"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Pencil, Trash2 } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Search, Filter & Pagination
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Add Order Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [status, setStatus] = useState("Pending");

  // Edit Order State
  const [editingOrder, setEditingOrder] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = () => {
    fetch("http://localhost:8000/api/orders/")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
        else if (data.items) setOrders(data.items);
        else setOrders([]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading orders:", err);
        setLoading(false);
      });

    fetch("http://localhost:8000/api/customers/")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCustomers(data);
        else if (data.items) setCustomers(data.items);
      })
      .catch((err) => console.error("Error loading customers:", err));
  };

  const closeModal = () => {
    setCustomerId("");
    setTotalAmount("");
    setStatus("Pending");
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCustomerId = parseInt(customerId);
    const parsedAmount = parseFloat(totalAmount);

    if (isNaN(parsedCustomerId)) {
      alert("Please select a valid customer.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/orders/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: parsedCustomerId,
          total_amount: isNaN(parsedAmount) ? 0.0 : parsedAmount,
          status,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`Failed to create order: ${JSON.stringify(error.detail || error)}`);
        return;
      }

      closeModal();
      loadData();
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    try {
      const res = await fetch(`http://localhost:8000/api/orders/${editingOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: parseInt(editingOrder.customer_id),
          total_amount: parseFloat(editingOrder.total_amount) || 0,
          status: editingOrder.status,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`Failed to update order: ${JSON.stringify(error.detail || error)}`);
        return;
      }

      closeModal();
      loadData();
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  const handleCancelOrder = async (order: any) => {
    if (!confirm(`Mark Order #ORD-${order.id} as Cancelled?`)) return;

    try {
      const res = await fetch(`http://localhost:8000/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: order.customer_id,
          total_amount: order.total_amount,
          status: "Cancelled",
        }),
      });

      if (res.ok) {
        loadData();
      } else {
        alert("Could not cancel order.");
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
    }
  };

  const getStatusBadge = (orderStatus: string) => {
    switch (orderStatus) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "Processing":
        return "bg-blue-50 text-blue-700 border-blue-200/60";
      case "Shipped":
        return "bg-purple-50 text-purple-700 border-purple-200/60";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200/60";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const customer = customers.find((c) => c.id === order.customer_id);
    const customerName = (customer?.name || "").toLowerCase();
    const searchLower = search.toLowerCase();
    const orderIdStr = `#ord-${order.id}`.toLowerCase();

    const matchesSearch =
      orderIdStr.includes(searchLower) ||
      order.customer_id?.toString().includes(searchLower) ||
      customerName.includes(searchLower);

    const matchesStatus =
      selectedStatus === "" || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const totalRevenue = orders
    .filter((o) => o.status === "Completed")
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const pendingCount = orders.filter((o) => o.status === "Pending").length;

  if (loading) {
    return <p className="p-8 text-slate-500 font-medium">Loading orders pipeline...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
          <p className="text-sm text-slate-500">
            Track, fulfill, and manage customer purchases in real time.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition-all active:scale-[0.98]"
        >
          + Create Order
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Orders</p>
            <p className="text-xl font-bold text-slate-800 mt-1">{orders.length}</p>
          </div>
          <span className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 font-bold">
            📦
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Action</p>
            <p className="text-xl font-bold text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <span className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-bold">
            ⏱️
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Revenue</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">${totalRevenue.toLocaleString()}</p>
          </div>
          <span className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
            💰
          </span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div>
            <h2 className="font-bold text-slate-800 text-sm">Order Ledger</h2>
            <p className="text-xs text-slate-400">
              Showing {filteredOrders.length} orders
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search Order ID or Customer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs w-64 bg-slate-50/50 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />

            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs bg-slate-50/50 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-slate-600"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center w-44">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const customerObj = customers.find((c) => c.id === order.customer_id);
                  const customerName = customerObj?.name || `Customer #${order.customer_id}`;

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-800 text-xs">
                        #ORD-{order.id}
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-slate-800">{customerName}</p>
                        <p className="text-xs text-slate-400 font-mono">ID: #{order.customer_id}</p>
                      </td>
                      <td className="p-4 font-bold text-slate-800">
                        ${Number(order.total_amount).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                  
                    <button
                      type="button"
                      onClick={() => setEditingOrder(order)}
                      title="Edit Product"
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/60 transition-all shadow-2xs active:scale-95"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                  
                    <button
                      type="button"
                      onClick={() => handleCancelOrder(order)}
                      title="Delete Product"
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/60 transition-all shadow-2xs active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white">
          <span>
            Page <strong className="text-slate-800">{currentPage}</strong> of{" "}
            <strong className="text-slate-800">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Order Modal */}
      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />

          <div className="relative bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Create New Order</h2>
                <p className="text-xs text-slate-400">Record a manual order in the store pipeline.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddOrder}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Customer</label>
                  <select
                    required
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-sm mt-1 bg-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-slate-700"
                  >
                    <option value="">Select a Customer</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (#{c.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">Total Order Amount ($)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    placeholder="149.99"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-sm mt-1 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-sm mt-1 bg-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-slate-700"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                >
                  Confirm Order
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Order Modal */}
      {editingOrder && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />

          <div className="relative bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Edit Order #ORD-{editingOrder.id}</h2>
                <p className="text-xs text-slate-400">Update order assignment, amount, or fulfillment status.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateOrder}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Assigned Customer</label>
                  <select
                    required
                    value={editingOrder.customer_id}
                    onChange={(e) => setEditingOrder({ ...editingOrder, customer_id: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-sm mt-1 bg-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-slate-700"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (#{c.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">Total Order Amount ($)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={editingOrder.total_amount}
                    onChange={(e) => setEditingOrder({ ...editingOrder, total_amount: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-sm mt-1 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">Fulfillment Status</label>
                  <select
                    value={editingOrder.status}
                    onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-sm mt-1 bg-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-slate-700"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}