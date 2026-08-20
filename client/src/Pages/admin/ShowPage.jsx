import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { FiDollarSign, FiRefreshCw } from "react-icons/fi";
import { FiShoppingBag, FiBox, FiUsers } from "react-icons/fi";
import "./ShowPage.css";

const COLORS = ["#4F8EF7", "#00b074", "#f59e0b", "#ef4444", "#8b5cf6"];

function ShowPage() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    aov: 0,
    products: 0,
    customers: 0,
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [lastSync, setLastSync] = useState("");
  const [syncing, setSyncing] = useState(false);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const fetchDashboard = async () => {
    try {
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/orders"),
        axios.get("http://localhost:5000/api/products"),
        axios.get("http://localhost:5000/api/users/all").catch(() => ({ data: [] })),
      ]);

      const orders = ordersRes.data || [];
      const products = productsRes.data || [];
      const users = usersRes.data || [];

      const totalSales = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
      const totalOrders = orders.length;
      const aov = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

      setStats({
        totalSales,
        totalOrders,
        aov,
        products: products.length,
        customers: users.length,
      });

      // Weekly orders (last 7 days)
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString("en-IN", { weekday: "short" });
        const count = orders.filter((o) => {
          const od = new Date(o.createdAt);
          return od.toDateString() === d.toDateString();
        }).length;
        days.push({ day: label, orders: count });
      }
      setWeeklyData(days);

      // Sales by category
      const catMap = {};
      products.forEach((p) => {
        const cat = p.category || "Other";
        catMap[cat] = (catMap[cat] || 0) + 1;
      });
      setCategoryData(
        Object.entries(catMap).map(([name, value]) => ({ name, value }))
      );

      setLastSync(new Date().toLocaleTimeString("en-IN"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    await fetchDashboard();
    setSyncing(false);
  };

  const statCards = [
    {
      label: "TOTAL SALES",
      value: `₹${stats.totalSales.toLocaleString("en-IN")}`,
      sub: "Realistic Store Total",
      subColor: "#00b074",
      icon: <FiDollarSign />,
      iconBg: "#e8f8f2",
      iconColor: "#00b074",
    },
    {
      label: "TOTAL ORDERS",
      value: stats.totalOrders,
      sub: `AOV: ₹${stats.aov}`,
      subColor: "#6366f1",
      icon: <FiShoppingBag />,
      iconBg: "#ede9fe",
      iconColor: "#6366f1",
    },
    {
      label: "PRODUCTS",
      value: stats.products,
      sub: "Live in Catalog",
      subColor: "#8b5cf6",
      icon: <FiBox />,
      iconBg: "#f3e8ff",
      iconColor: "#8b5cf6",
    },
    {
      label: "CUSTOMERS",
      value: stats.customers,
      sub: "Registered Accounts",
      subColor: "#f59e0b",
      icon: <FiUsers />,
      iconBg: "#fef3c7",
      iconColor: "#f59e0b",
    },
  ];

  return (
    <div className="dash-layout">
      <div className="dash-main">
          {/* Header Row */}
          <div className="dash-header-row">
            <div>
              <h2 className="dash-title">Dashboard</h2>
              <p className="dash-date">{dateStr}</p>
            </div>
            <div className="dash-header-actions">
              <span className="system-status">
                <span className="status-dot" /> System Status: Online
              </span>
              <button className="sync-btn" onClick={handleSync} disabled={syncing}>
                <FiRefreshCw className={syncing ? "spin" : ""} />
                Sync Data
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="dash-stat-grid">
            {statCards.map((card) => (
              <div className="stat-card" key={card.label}>
                <div className="stat-card-left">
                  <p className="stat-label">{card.label}</p>
                  <h3 className="stat-value">{card.value}</h3>
                  <p className="stat-sub" style={{ color: card.subColor }}>
                    {card.sub}
                  </p>
                </div>
                <div className="stat-icon-wrap" style={{ background: card.iconBg, color: card.iconColor }}>
                  {card.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="dash-charts-row">
            {/* Line Chart */}
            <div className="chart-card chart-wide">
              <div className="chart-card-header">
                <div>
                  <h4>Weekly Orders Overview</h4>
                  <p>Orders volume trend for the last 7 active days</p>
                </div>
                <div className="chart-sync-info">
                  <span>⏱ Last sync: {lastSync}</span>
                  <button className="realtime-btn" onClick={handleSync}>
                    Realtime Sync
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#4F8EF7"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="chart-card chart-narrow">
              <div className="chart-card-header">
                <div>
                  <h4>Sales by Category</h4>
                  <p>Distribution of revenue across product categories</p>
                </div>
              </div>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                    >
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-chart-data">No product data yet</div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}

export default ShowPage;