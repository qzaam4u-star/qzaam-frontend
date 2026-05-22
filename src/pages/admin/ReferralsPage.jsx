import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Spinner from '../../components/Spinner';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

export default function ReferralsPage() {
  const [stats, setStats] = useState(null);
  const [customersData, setCustomersData] = useState([]);
  const [vendorsData, setVendorsData] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingVendors, setLoadingVendors] = useState(true);
  
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' | 'vendor'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [historyModalUser, setHistoryModalUser] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [ordersModalUser, setOrdersModalUser] = useState(null);
  const [ordersData, setOrdersData] = useState({ orders: [], bookings: [] });
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchCustomerReferrals();
    fetchVendorReferrals();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/referrals');
      setStats(res.data.data);
    } catch (err) {
      console.error('Error fetching referral stats:', err);
      toast.error('Failed to load referral statistics');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchCustomerReferrals = async () => {
    try {
      const res = await api.get('/api/admin/referrals/customer');
      setCustomersData(res.data.data || []);
    } catch (err) {
      console.error('Error fetching customer referrals:', err);
      toast.error('Failed to load customer referrals');
    } finally {
      setLoadingCustomers(false);
    }
  };

  const fetchVendorReferrals = async () => {
    try {
      const res = await api.get('/api/admin/referrals/vendor');
      setVendorsData(res.data.data || []);
    } catch (err) {
      console.error('Error fetching vendor referrals:', err);
      toast.error('Failed to load vendor referrals');
    } finally {
      setLoadingVendors(false);
    }
  };

  const handleOpenHistory = async (customer) => {
    setHistoryModalUser(customer);
    setLoadingHistory(true);
    setHistoryData([]);
    try {
      const res = await api.get(`/api/admin/referrals/customer/${customer.id}/history`);
      setHistoryData(res.data.data || []);
    } catch (err) {
      console.error('Error fetching referral history:', err);
      toast.error('Failed to load referral history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleOpenOrders = async (customer) => {
    setOrdersModalUser(customer);
    setLoadingOrders(true);
    setOrdersData({ orders: [], bookings: [] });
    try {
      const res = await api.get(`/api/admin/referrals/customer/${customer.id}/orders`);
      setOrdersData(res.data.data || { orders: [], bookings: [] });
    } catch (err) {
      console.error('Error fetching customer orders:', err);
      toast.error('Failed to load customer orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  // Filter lists based on search
  const filteredCustomers = customersData.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone?.includes(searchQuery) ||
    c.referralCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVendors = vendorsData.filter(v => 
    v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.referralCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const kpis = [
    {
      label: 'Total Customer Referrals',
      value: stats ? stats.totalCustomerReferrals : 0,
      icon: '👥',
      color: 'text-blue-500'
    },
    {
      label: 'Total Vendor Referrals',
      value: stats ? stats.totalVendorReferrals : 0,
      icon: '🏪',
      color: 'text-emerald-500'
    },
    {
      label: 'Gift Hamper Eligible',
      value: stats ? stats.giftHamperEligibleCount : 0,
      icon: '🎁',
      color: 'text-amber-500'
    },
    {
      label: 'Platform Fees Waived',
      value: stats ? `₹${stats.platformFeesWaived}` : '₹0',
      icon: '💸',
      color: 'text-[#d4ff00]'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* KPI Cards */}
        {loadingStats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(n => (
              <Card key={n} className="p-5 border-zinc-800 bg-zinc-900/40 animate-pulse h-24" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => (
              <Card key={idx} className="p-5 border-zinc-850 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                      {kpi.label}
                    </h3>
                    <span className="text-2xl font-black text-zinc-900 dark:text-white">
                      {kpi.value}
                    </span>
                  </div>
                  <span className="text-3xl filter drop-shadow">{kpi.icon}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Optional Campaign Top Performers */}
        {!loadingStats && stats?.topReferrer && (
          <Card className="p-4 border-zinc-800 bg-zinc-950/20 dark:bg-zinc-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Top Referrer Campaign</h4>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5">
                  {stats.topReferrer.name} <span className="text-zinc-500">({stats.topReferrer.phone})</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="neon" className="px-3 py-1 font-bold text-xs">
                {stats.topReferrer.count} Successful Invites
              </Badge>
            </div>
          </Card>
        )}

        {/* Main Section */}
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 overflow-hidden">
          {/* Header & Controls */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl w-fit">
              <button
                onClick={() => { setActiveTab('customer'); setSearchQuery(''); }}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'customer'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                📢 Customer Referrals
              </button>
              <button
                onClick={() => { setActiveTab('vendor'); setSearchQuery(''); }}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'vendor'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                🏪 Vendor Referrals
              </button>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder={activeTab === 'customer' ? "Search by name, phone, code..." : "Search by vendor, code..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#d4ff00] w-full sm:w-64 text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          {/* Tables Content */}
          <div className="overflow-x-auto">
            {activeTab === 'customer' ? (
              loadingCustomers ? (
                <div className="py-20 flex flex-col items-center justify-center gap-2">
                  <Spinner />
                  <span className="text-xs text-zinc-500">Loading Customer Referral Database...</span>
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="py-20 text-center text-zinc-500 text-sm font-medium">No customer referrals found.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50/50 dark:bg-zinc-950/50 text-[10px] uppercase font-bold text-zinc-500 tracking-widest border-b border-zinc-200 dark:border-zinc-800">
                      <th className="px-6 py-4">Customer Name</th>
                      <th className="px-6 py-4">Phone Number</th>
                      <th className="px-6 py-4">Referral Code</th>
                      <th className="px-6 py-4 text-center">Successful Referrals</th>
                      <th className="px-6 py-4 text-center">Gift Hamper Status</th>
                      <th className="px-6 py-4">Joined Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                    {filteredCustomers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-zinc-50/50 dark:hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-white">{cust.name}</td>
                        <td className="px-6 py-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">{cust.phone}</td>
                        <td className="px-6 py-4 text-xs font-mono text-[#8cb800] dark:text-[#d4ff00] font-bold">{cust.referralCode}</td>
                        <td className="px-6 py-4 text-sm text-center font-bold text-zinc-900 dark:text-white">{cust.totalSuccessfulReferrals}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant={cust.giftHamperStatus === 'Eligible' ? 'neon' : 'zinc'}>
                            {cust.giftHamperStatus}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-xs text-zinc-500 dark:text-zinc-400">
                          {new Date(cust.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => handleOpenHistory(cust)}
                          >
                            🕒 History
                          </Button>
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => handleOpenOrders(cust)}
                          >
                            🛍️ Orders
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : (
              loadingVendors ? (
                <div className="py-20 flex flex-col items-center justify-center gap-2">
                  <Spinner />
                  <span className="text-xs text-zinc-500">Loading Vendor Referral Database...</span>
                </div>
              ) : filteredVendors.length === 0 ? (
                <div className="py-20 text-center text-zinc-500 text-sm font-medium">No vendor referrals found.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50/50 dark:bg-zinc-950/50 text-[10px] uppercase font-bold text-zinc-500 tracking-widest border-b border-zinc-200 dark:border-zinc-800">
                      <th className="px-6 py-4">Vendor Name</th>
                      <th className="px-6 py-4">Referral Code</th>
                      <th className="px-6 py-4">Vendors Referred</th>
                      <th className="px-6 py-4 text-center">Total Referred</th>
                      <th className="px-6 py-4">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                    {filteredVendors.map((vendor) => (
                      <tr key={vendor.id} className="hover:bg-zinc-50/50 dark:hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-white">{vendor.name}</td>
                        <td className="px-6 py-4 text-xs font-mono text-[#8cb800] dark:text-[#d4ff00] font-bold">{vendor.referralCode}</td>
                        <td className="px-6 py-4">
                          {vendor.vendorsReferred.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-sm">
                              {vendor.vendorsReferred.map((name, i) => (
                                <Badge key={i} variant="zinc" className="text-[10px]">
                                  🏪 {name}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-zinc-500">None yet</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-center font-bold text-zinc-900 dark:text-white">{vendor.totalReferralCount}</td>
                        <td className="px-6 py-4 text-xs text-zinc-500 dark:text-zinc-400">
                          {new Date(vendor.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        </Card>
      </div>

      {/* Referral History Modal */}
      {historyModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-2xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl animate-in scale-in duration-200">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-zinc-900 dark:text-white">Referral History</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Invited users by {historyModalUser.name} ({historyModalUser.referralCode})</p>
              </div>
              <button 
                onClick={() => setHistoryModalUser(null)} 
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {loadingHistory ? (
                <div className="py-10 flex flex-col items-center justify-center gap-2">
                  <Spinner />
                  <span className="text-xs text-zinc-500">Retrieving Campaign History...</span>
                </div>
              ) : historyData.length === 0 ? (
                <div className="text-center py-10 text-zinc-500 text-sm">No recorded referrals found for this code.</div>
              ) : (
                <div className="space-y-4">
                  {historyData.map((item, idx) => (
                    <div key={idx} className="p-4 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-850 rounded-xl space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold text-zinc-900 dark:text-white">{item.referredUser.name}</p>
                          <p className="text-xs font-mono text-zinc-500">{item.referredUser.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-zinc-400">Invited On</p>
                          <p className="text-xs font-semibold text-zinc-650 dark:text-zinc-300">
                            {new Date(item.usageDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      {/* Associated Order/Booking detail */}
                      <div className="pt-2 border-t border-zinc-250 dark:border-zinc-800 flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          {item.order ? (
                            <>
                              <Badge variant="neon">🍔 Food Order</Badge>
                              <span className="text-zinc-500 dark:text-zinc-400 font-mono">#{item.order.id.slice(0, 8)}</span>
                            </>
                          ) : item.booking ? (
                            <>
                              <Badge variant="orange">💇 Salon Booking</Badge>
                              <span className="text-zinc-500 dark:text-zinc-400 font-mono">#{item.booking.id.slice(0, 8)}</span>
                            </>
                          ) : (
                            <span className="text-zinc-500">Sign Up Lead</span>
                          )}
                        </div>
                        <div className="text-right">
                          {item.platformFeeWaived > 0 ? (
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              💸 ₹{item.platformFeeWaived} Fee Waived
                            </span>
                          ) : (
                            <span className="text-zinc-400 dark:text-zinc-500">No discount applied</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-950/60 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setHistoryModalUser(null)}>
                Close Window
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Orders List Modal */}
      {ordersModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-2xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl animate-in scale-in duration-200">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-zinc-900 dark:text-white">Orders & Bookings History</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Complete transaction records for {ordersModalUser.name}</p>
              </div>
              <button 
                onClick={() => setOrdersModalUser(null)} 
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {loadingOrders ? (
                <div className="py-10 flex flex-col items-center justify-center gap-2">
                  <Spinner />
                  <span className="text-xs text-zinc-500">Retrieving Orders...</span>
                </div>
              ) : ordersData.orders.length === 0 && ordersData.bookings.length === 0 ? (
                <div className="text-center py-10 text-zinc-500 text-sm">No orders or bookings placed by this user.</div>
              ) : (
                <div className="space-y-3">
                  {[...ordersData.orders, ...ordersData.bookings]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3.5 bg-zinc-50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {item.type === 'food' ? (
                              <Badge variant="neon">🍔 Food</Badge>
                            ) : (
                              <Badge variant="orange">💇 Salon</Badge>
                            )}
                            <span className="text-[11px] font-mono text-zinc-400">#{item.id.slice(0, 8)}</span>
                          </div>
                          <p className="text-sm font-semibold text-zinc-900 dark:text-white">{item.vendorName}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-sm font-black text-zinc-900 dark:text-white">₹{item.amount}</p>
                          <div className="flex items-center gap-1.5 justify-end">
                            <span className="text-[10px] text-zinc-400">
                              {new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            </span>
                            <Badge variant={item.status === 'completed' || item.status === 'placed' || item.status === 'accepted' ? 'green' : (item.status === 'cancelled' ? 'red' : 'zinc')}>
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-950/60 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setOrdersModalUser(null)}>
                Close Window
              </Button>
            </div>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
