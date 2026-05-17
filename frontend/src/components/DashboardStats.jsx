import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { API_BASE_URL } from '../api';

export default function DashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get(`${API_BASE_URL}/api/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-white text-center py-10">Loading stats...</div>;
  if (!stats) return <div className="text-white text-center py-10">Failed to load stats.</div>;

  const COLORS = ['#FF4500', '#8A2BE2', '#3b82f6', '#10b981', '#f59e0b'];

  const statusData = stats.statusCounts.map(item => ({ name: item._id, value: item.count }));
  const genderData = stats.genderCounts.map(item => ({ name: item._id, value: item.count }));
  const ageData = stats.ageGroups.map(item => ({
    name: item._id === 'Other' ? '60+' : `${item._id}-${item._id === 0 ? 17 : item._id === 18 ? 24 : item._id === 25 ? 34 : item._id === 35 ? 44 : 59}`,
    count: item.count
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Analytics Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Total Registrations</h3>
          <p className="text-3xl font-bold text-white">{stats.totalRegistrations}</p>
        </div>
        {statusData.map(stat => (
          <div key={stat.name} className="glass-card p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">{stat.name} Applications</h3>
            <p className={`text-3xl font-bold ${stat.name === 'Accepted' ? 'text-green-400' : stat.name === 'Denied' ? 'text-red-400' : 'text-yellow-400'}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {stats.totalRegistrations === 0 ? (
        <div className="glass-card p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="text-gray-400 text-5xl">📊</div>
          <h3 className="text-xl font-bold text-white">No Analytics Data Available</h3>
          <p className="text-gray-400 max-w-md">
            Once applicants start registering for the comedy show, dynamic charts for status, gender, and age distribution will be displayed here in real time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Chart */}
          <div className="glass-card p-6 h-80">
            <h3 className="text-lg font-bold text-white mb-4">Application Status</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gender Chart */}
          <div className="glass-card p-6 h-80">
            <h3 className="text-lg font-bold text-white mb-4">Gender Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={0} outerRadius={80} dataKey="value" label>
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Age Distribution Chart */}
          <div className="glass-card p-6 h-80 lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-4">Age Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                <Bar dataKey="count" fill="#FF4500" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
