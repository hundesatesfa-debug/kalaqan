import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Download, Trash2, CheckCircle, XCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { API_BASE_URL } from '../api';

export default function ApplicantsList({ onClearNotifications }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchApplicants();
    if (onClearNotifications) onClearNotifications();
  }, []);

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_BASE_URL}/api/applicants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplicants(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`${API_BASE_URL}/api/applicants/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchApplicants();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteApplicant = async (id) => {
    if (!window.confirm('Are you sure you want to delete this applicant?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_BASE_URL}/api/applicants/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchApplicants();
    } catch (err) {
      console.error(err);
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredApplicants);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applicants");
    XLSX.writeFile(wb, "kalaqan_applicants.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Kalaqan Applicants", 14, 10);
    
    const tableData = filteredApplicants.map(a => [
      a.fullName, a.phoneNumber, a.age, a.sex, a.location, a.status
    ]);
    
    doc.autoTable({
      head: [['Name', 'Phone', 'Age', 'Sex', 'Location', 'Status']],
      body: tableData,
      startY: 20,
    });
    
    doc.save("kalaqan_applicants.pdf");
  };

  const filteredApplicants = applicants.filter(a => {
    const matchesSearch = a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.phoneNumber.includes(searchTerm) ||
                          a.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="text-white text-center py-10">Loading applicants...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Applicants Management</h2>
        <div className="flex gap-2">
          <button onClick={exportExcel} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors">
            <Download size={16} /> Excel
          </button>
          <button onClick={exportPDF} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors">
            <Download size={16} /> PDF
          </button>
        </div>
      </div>

      <div className="glass-card p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, phone or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-dark/50 border border-gray-700 rounded-lg pl-10 pr-8 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Denied">Denied</option>
          </select>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-700 text-gray-400 text-sm">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Details</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.length > 0 ? (
                filteredApplicants.map((applicant) => (
                  <tr key={applicant._id} className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white">{applicant.fullName}</div>
                      <div className="text-xs text-gray-500 text-ellipsis overflow-hidden max-w-[150px]">{applicant.occupation}</div>
                    </td>
                    <td className="p-4 text-gray-300">{applicant.phoneNumber}</td>
                    <td className="p-4 text-gray-300">{applicant.age} yrs • {applicant.sex}</td>
                    <td className="p-4 text-gray-300">{applicant.location}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        applicant.status === 'Accepted' ? 'bg-green-500/20 text-green-400' :
                        applicant.status === 'Denied' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {applicant.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {applicant.status !== 'Accepted' && (
                          <button onClick={() => updateStatus(applicant._id, 'Accepted')} className="p-2 text-green-400 hover:bg-green-400/20 rounded-lg transition-colors" title="Accept">
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {applicant.status !== 'Denied' && (
                          <button onClick={() => updateStatus(applicant._id, 'Denied')} className="p-2 text-yellow-400 hover:bg-yellow-400/20 rounded-lg transition-colors" title="Deny">
                            <XCircle size={18} />
                          </button>
                        )}
                        <button onClick={() => deleteApplicant(applicant._id)} className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">No applicants found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
