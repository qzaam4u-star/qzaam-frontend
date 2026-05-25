import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import CustomerLoginModal from '../components/CustomerLoginModal';
import ComplaintModal from '../components/ComplaintModal';

const STATUS_STEPS = { pending: 1, accepted: 2, preparing: 3, ready: 4, completed: 5 };

export default function HelpDeskPage() {
  const { customer: authCustomer } = useAuth();
  const [orders, setOrders] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);

  const fetchOrdersAndComplaints = async (phone) => {
    try {
      setLoading(true);
      const ordersRes = await api.get(`/customer/orders?phone=${phone}`);
      setOrders(ordersRes.data.data || []);
      
      setLoadingComplaints(true);
      const complaintsRes = await api.get(`/complaints?phone=${phone}`);
      setComplaints(complaintsRes.data.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
      setLoadingComplaints(false);
    }
  };

  useEffect(() => {
    const customer = authCustomer || JSON.parse(localStorage.getItem('ql_customer'));
    if (!customer?.phone) {
      setShowLogin(true);
      setLoading(false);
      return;
    }
    fetchOrdersAndComplaints(customer.phone);
  }, [authCustomer]);

  const customer = authCustomer || JSON.parse(localStorage.getItem('ql_customer'));

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-32 flex flex-col items-center gap-4">
        <Spinner />
        <p className="text-zinc-500 text-sm font-medium animate-pulse">Loading help desk...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-32 px-4 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-3xl mb-6">🔒</div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Customer Session Required</h2>
        <p className="text-zinc-500 mt-2 max-w-xs mx-auto">Please sign in as a customer from the navbar or click the button below to raise a complaint.</p>
        <div className="mt-8 flex gap-3">
          <Button onClick={() => setShowLogin(true)}>Sign in as Customer</Button>
          <Link to="/">
            <Button variant="outline">Home</Button>
          </Link>
        </div>
        <CustomerLoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} isCheckoutFlow={false} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-28 px-4 pb-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">Help Desk</h1>
            <p className="text-zinc-500 mt-2">Select an order to raise a complaint for <span className="font-mono text-[#8cb800] dark:text-[#d4ff00] font-bold">{customer.phone}</span></p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => fetchOrdersAndComplaints(customer.phone)}>
              Refresh 🔄
            </Button>
            <Link to="/">
              <Button variant="outline" size="sm" className="rounded-xl">Home</Button>
            </Link>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="py-20 px-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem] flex flex-col items-center justify-center text-center bg-zinc-50/50 dark:bg-zinc-900/30">
            <span className="text-4xl mb-4">🥢</span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No orders found</h3>
            <p className="text-sm text-zinc-500 mt-1 max-w-[200px]">You need an active or past order to file a complaint.</p>
            <Link to="/menu" className="mt-6">
              <Button size="sm">Explore Menu</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((o) => {
              const step = STATUS_STEPS[o.status] || 1;
              const isActive = o.status !== 'completed' && o.status !== 'cancelled';
              const statusColor = isActive
                ? (step >= 4 ? 'text-[#8cb800] dark:text-[#d4ff00]' : 'text-amber-500')
                : 'text-zinc-400';

              return (
                <div
                  key={o.id}
                  className={`p-6 rounded-3xl border ${isActive ? 'border-[#d4ff00]/30 bg-[#d4ff00]/5 shadow-lg shadow-[#d4ff00]/5' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'} transition-all`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#d4ff00] animate-pulse' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                      <span className="text-[10px] font-black text-zinc-400 font-mono tracking-widest uppercase">#{o.id.slice(0, 8)}</span>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${statusColor}`}>
                      {o.status}
                    </span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">
                        {Array.isArray(o.items) ? o.items.length : 0} Item{Array.isArray(o.items) && o.items.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-medium">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-xl font-black text-zinc-900 dark:text-white">₹{o.totalAmount?.toFixed(0)}</p>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(o);
                          setIsComplaintOpen(true);
                        }}
                      >
                        Raise Complaint
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Active Support Tickets Section */}
        <div className="mt-12 border-t border-zinc-200 dark:border-zinc-800 pt-10">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mb-6">Support Ticket History</h2>
          
          {loadingComplaints ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : complaints.length === 0 ? (
            <div className="py-10 px-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-center bg-zinc-50/50 dark:bg-zinc-900/30">
              <p className="text-sm text-zinc-500">You don't have any registered complaints.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((c) => (
                <div key={c.id} className="p-6 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl transition-all">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="text-[10px] font-black text-zinc-400 font-mono tracking-widest uppercase block mb-1">Ticket #{c.id.slice(0, 8)}</span>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white">{c.subject}</h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{c.description}</p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold leading-none capitalize ${
                        c.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        c.status === 'in_progress' || c.status === 'in-progress' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                        c.status === 'rejected' ? 'bg-zinc-200 text-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {c.status === 'resolved' ? '🟢 Resolved' :
                         c.status === 'in_progress' || c.status === 'in-progress' ? '🟡 In Progress' :
                         c.status === 'rejected' ? '⚪ Rejected' :
                         '🔴 Open'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                      <span>Reported: {new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      {c.updatedAt && (
                        <span>Last Update: {new Date(c.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      )}
                    </div>

                    {c.adminResponse && (
                      <div className="mt-2 p-4 bg-[#d4ff00]/5 border border-[#d4ff00]/25 rounded-2xl">
                        <span className="text-[10px] font-black text-[#8cb800] dark:text-[#d4ff00] tracking-widest uppercase block mb-1">Resolution Update / Reply</span>
                        <p className="text-xs text-zinc-900 dark:text-zinc-200 italic font-medium leading-relaxed">"{c.adminResponse}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <ComplaintModal
          isOpen={isComplaintOpen}
          onClose={() => {
            setIsComplaintOpen(false);
            setSelectedOrder(null);
            fetchOrdersAndComplaints(customer.phone);
          }}
          order={selectedOrder}
          customerPhone={customer.phone}
        />
      )}
    </div>
  );
}

