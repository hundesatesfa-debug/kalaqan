import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { API_BASE_URL } from '../api';

export default function EventManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', location: '', description: '', isOpenForRegistration: true });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/events`);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (event = null) => {
    if (event) {
      setEditingId(event._id);
      setFormData({
        title: event.title,
        date: new Date(event.date).toISOString().slice(0, 16),
        location: event.location,
        description: event.description,
        isOpenForRegistration: event.isOpenForRegistration
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', date: '', location: '', description: '', isOpenForRegistration: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/events/${editingId}`, formData, { headers });
      } else {
        await axios.post(`${API_BASE_URL}/api/events`, formData, { headers });
      }
      
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_BASE_URL}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-white text-center py-10">Loading events...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Event Management</h2>
        <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors">
          <Plus size={16} /> New Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map(event => (
            <div key={event._id} className="glass-card p-6 flex flex-col h-full relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-2 h-full ${event.isOpenForRegistration ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 pr-6">{event.title}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-400 flex items-center gap-2 text-sm">
                    <CalendarIcon size={16} className="text-primary" /> {new Date(event.date).toLocaleString()}
                  </p>
                  <p className="text-gray-400 flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-primary" /> {event.location}
                  </p>
                </div>
                <p className="text-gray-300 text-sm line-clamp-3 mb-4">{event.description}</p>
              </div>
              <div className="mt-auto pt-4 border-t border-gray-800 flex justify-between items-center">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${event.isOpenForRegistration ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {event.isOpenForRegistration ? 'Registration Open' : 'Registration Closed'}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(event)} className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(event._id)} className="p-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500 glass-card">
            No events found. Create one to get started.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="glass-card max-w-lg w-full p-6 animate-fade-in relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-6">{editingId ? 'Edit Event' : 'Create New Event'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Event Title</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-dark/50 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Date & Time</label>
                <input type="datetime-local" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-dark/50 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-dark/50 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea required rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-dark/50 border border-gray-700 rounded-lg px-4 py-2 text-white"></textarea>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="isOpen" checked={formData.isOpenForRegistration} onChange={e => setFormData({...formData, isOpenForRegistration: e.target.checked})} className="w-4 h-4 text-primary bg-dark border-gray-700 rounded focus:ring-primary focus:ring-offset-dark" />
                <label htmlFor="isOpen" className="text-sm font-medium text-gray-300">Open for Registration</label>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="bg-primary hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  {editingId ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
