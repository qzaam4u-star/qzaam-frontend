import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Spinner from '../../components/Spinner';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [responseNotes, setResponseNotes] = useState({});

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/admin/complaints');
      setComplaints(res.data.data || []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      toast.error('Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      setUpdatingId(complaintId);
      const note = responseNotes[complaintId] !== undefined 
        ? responseNotes[complaintId] 
        : (complaints.find(c => c.id === complaintId)?.adminResponse || '');

      const res = await api.patch(`/complaints/${complaintId}/status`, {
        status: newStatus,
        adminResponse: note
      });

      if (res.data.success) {
        toast.success('Complaint status updated.');
        // Optimistic UI updates with refetch safety
        setComplaints(prev => prev.map(c => c.id === complaintId ? res.data.data : c));
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update complaint status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async (complaintId, status) => {
    try {
      setUpdatingId(complaintId);
      const note = responseNotes[complaintId] || '';
      const res = await api.patch(`/complaints/${complaintId}/status`, {
        status,
        adminResponse: note
      });

      if (res.data.success) {
        toast.success('Resolution notes saved.');
        setComplaints(prev => prev.map(c => c.id === complaintId ? res.data.data : c));
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save notes.');
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = [
    { label: 'Total Complaints', value: complaints.length, icon: '⚠️' },
    { label: 'Open', value: complaints.filter(c => c.status === 'open').length, icon: '🔓' },
    { label: 'Resolved', value: complaints.filter(c => c.status === 'resolved').length, icon: '✅' },
    { label: 'High Priority', value: complaints.filter(c => c.priority === 'high').length, icon: '🔥' },
  ];

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'zinc';
      default: return 'zinc';
    }
  };

  const filtered = complaints.filter(c => 
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.subject.toLowerCase().includes(search.toLowerCase()) ||
    c.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.customer?.phone?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* KPI Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-5 border-zinc-800 bg-zinc-900/40">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">{stat.label}</h3>
                  <span className="text-2xl font-black text-white">{stat.value}</span>
                </div>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Complaints Table */}
        <Card className="border-zinc-800 bg-zinc-900/40 overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-[#d4ff00]">Customer Complaints</h2>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Search by ID, subject, name, phone..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#d4ff00] w-full sm:w-64 text-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center gap-2">
                <Spinner />
                <span className="text-sm font-medium text-zinc-400">Loading complaints...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 text-sm font-medium">No complaints found.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950/50 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
                    <th className="px-6 py-4">Complaint ID</th>
                    <th className="px-6 py-4">Customer Info</th>
                    <th className="px-6 py-4">Vendor Info</th>
                    <th className="px-6 py-4">Complaint Details</th>
                    <th className="px-6 py-4">Status & Resolution</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {filtered.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 text-xs font-mono text-zinc-400">
                        #{complaint.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="font-semibold text-zinc-200">{complaint.customer?.name || "Unknown"}</div>
                        <div className="text-xs text-zinc-400 font-mono mt-0.5">{complaint.customer?.phone || "No Phone"}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{complaint.customer?.email || "No Email"}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">
                        <div className="font-medium text-zinc-200">
                          {complaint.vendor?.outletName || complaint.vendor?.name || "Unknown"}
                        </div>
                        <div className="text-xs text-zinc-500 font-mono mt-0.5">{complaint.vendor?.mobile || ""}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300">
                        <span className="font-bold block text-zinc-200 mb-0.5">{complaint.subject}</span>
                        <span className="text-xs text-zinc-500 leading-normal max-w-xs block">{complaint.description}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <select
                            value={complaint.status}
                            onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                            disabled={updatingId === complaint.id}
                            className="bg-zinc-800 border border-zinc-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4ff00] cursor-pointer w-32 font-semibold"
                          >
                            <option value="open">Open 🔴</option>
                            <option value="in_progress">In Progress 🟡</option>
                            <option value="resolved">Resolved 🟢</option>
                            <option value="rejected">Rejected ⚪</option>
                          </select>

                          <div className="flex items-center gap-1.5 mt-1">
                            <input
                              type="text"
                              placeholder="Add resolution notes..."
                              value={responseNotes[complaint.id] !== undefined ? responseNotes[complaint.id] : (complaint.adminResponse || '')}
                              onChange={(e) => setResponseNotes({ ...responseNotes, [complaint.id]: e.target.value })}
                              className="bg-zinc-800/40 border border-zinc-700 rounded-lg px-2 py-1 text-[11px] text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-[#d4ff00] w-48"
                            />
                            <button
                              onClick={() => handleSaveNotes(complaint.id, complaint.status)}
                              disabled={updatingId === complaint.id}
                              className="bg-[#d4ff00] hover:bg-[#bce000] text-black font-bold text-[10px] uppercase px-2 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getPriorityVariant(complaint.priority)}>
                          {complaint.priority}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500">
                        <div className="font-semibold text-zinc-400">Created:</div>
                        <div>{new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                        {complaint.updatedAt && (
                          <>
                            <div className="font-semibold text-zinc-400 mt-1">Updated:</div>
                            <div>{new Date(complaint.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

