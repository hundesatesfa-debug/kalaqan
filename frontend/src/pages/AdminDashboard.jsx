import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, BarChart3, Calendar, LogOut, Menu, X, Bell } from 'lucide-react';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../api';

import ApplicantsList from '../components/ApplicantsList';
import DashboardStats from '../components/DashboardStats';
import EventManager from '../components/EventManager';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }

    const socket = io(API_BASE_URL);
    socket.on('new_applicant', (data) => {
      setNotifications(prev => prev + 1);
      // Could also add a toast notification here
    });

    return () => socket.disconnect();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <BarChart3 size={20} /> },
    { name: 'Applicants', path: '/admin/dashboard/applicants', icon: <Users size={20} /> },
    { name: 'Events', path: '/admin/dashboard/events', icon: <Calendar size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-dark flex pt-16">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-darkCard border-r border-gray-800 w-64 transform transition-transform duration-300 ease-in-out z-40 pt-16 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="p-4">
          <ul className="space-y-2 mt-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                >
                  {item.icon}
                  {item.name}
                  {item.name === 'Applicants' && notifications > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {notifications}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors w-full">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between bg-darkCard p-4 border-b border-gray-800">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="relative">
            <Bell size={24} className="text-gray-400" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<DashboardStats />} />
            <Route path="/applicants" element={<ApplicantsList onClearNotifications={() => setNotifications(0)} />} />
            <Route path="/events" element={<EventManager />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
