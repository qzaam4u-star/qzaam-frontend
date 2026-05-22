import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Spinner from '../../components/Spinner';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

export default function ReviewsPage() {
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters state
  const [vendorType, setVendorType] = useState('all');
  const [rating, setRating] = useState('all');
  const [sort, setSort] = useState('newest');

  // Confirmation state for deleting
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Modal state for viewing details
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [vendorType, rating, sort, currentPage]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/reviews', {
        params: {
          vendorType,
          rating,
          sort,
          page: currentPage,
          limit: 10
        }
      });
      const data = res.data.data;
      setReviews(data.reviews || []);
      setStats(data.stats);
      setTotalPages(data.pagination.totalPages || 1);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHide = async (review) => {
    const actionText = review.isHidden ? 'unhide' : 'hide';
    try {
      const res = await api.patch(`/api/admin/reviews/${review.id}/hide`);
      if (res.data.success) {
        toast.success(`Review successfully ${review.isHidden ? 'unhidden' : 'hidden'}`);
        
        // Update review in state
        setReviews(reviews.map(r => r.id === review.id ? { ...r, isHidden: !r.isHidden } : r));
        
        // Refresh stats
        fetchStatsOnly();
      }
    } catch (err) {
      console.error(`Error trying to ${actionText} review:`, err);
      toast.error(`Failed to ${actionText} review`);
    }
  };

  const fetchStatsOnly = async () => {
    try {
      const res = await api.get('/api/admin/reviews', {
        params: { limit: 1 }
      });
      setStats(res.data.data.stats);
    } catch (err) {
      console.error('Error updating stats:', err);
    }
  };

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/reviews/${reviewToDelete.id}`);
      toast.success('Review deleted successfully');
      setReviewToDelete(null);
      // Refetch
      fetchReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
      toast.error('Failed to delete review');
    } finally {
      setDeleting(false);
    }
  };

  // KPI cards metrics config
  const kpis = [
    {
      label: 'Average Platform Rating',
      value: stats ? `${stats.avgRating} ★` : '0.0 ★',
      icon: '⭐',
      color: 'text-amber-500'
    },
    {
      label: 'Total Platform Reviews',
      value: stats ? stats.totalReviews : 0,
      icon: '📝',
      color: 'text-blue-500'
    },
    {
      label: 'Food Stall Reviews',
      value: stats ? stats.foodReviews : 0,
      icon: '🍔',
      color: 'text-emerald-500'
    },
    {
      label: 'Salon Service Reviews',
      value: stats ? stats.salonReviews : 0,
      icon: '💇',
      color: 'text-purple-500'
    },
    {
      label: 'Flagged / Hidden Reviews',
      value: stats ? stats.flaggedReviews : 0,
      icon: '🚩',
      color: 'text-red-500'
    }
  ];

  const renderStars = (count) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < count ? 'text-amber-400 font-bold' : 'text-zinc-300 dark:text-zinc-700'}>
        ★
      </span>
    ));
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* KPI Row */}
        {loading && !stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(n => (
              <Card key={n} className="p-5 border-zinc-800 bg-zinc-900/40 animate-pulse h-24" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {kpis.map((kpi, idx) => (
              <Card key={idx} className="p-5 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                      {kpi.label}
                    </h3>
                    <span className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                      {kpi.value}
                    </span>
                  </div>
                  <span className="text-2xl filter drop-shadow">{kpi.icon}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Filters and Moderation Table */}
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 overflow-hidden">
          {/* Controls Bar */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-[#8cb800] dark:text-[#d4ff00]">Central Moderation Panel</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">Sorted by:</span>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setCurrentPage(1); }}
                  className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-[#d4ff00]"
                >
                  <option value="newest">Newest First</option>
                  <option value="lowest">Lowest Rated First</option>
                  <option value="highest">Highest Rated First</option>
                </select>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Type Filters */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-400">Type:</span>
                <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-0.5 rounded-lg">
                  {['all', 'food', 'salon'].map(t => (
                    <button
                      key={t}
                      onClick={() => { setVendorType(t); setCurrentPage(1); }}
                      className={`px-3 py-1 text-xs rounded-md capitalize font-bold transition-all ${
                        vendorType === t
                          ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                          : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filters */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-400">Rating:</span>
                <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-0.5 rounded-lg">
                  {['all', '1', '2', '3', '4', '5'].map(r => (
                    <button
                      key={r}
                      onClick={() => { setRating(r); setCurrentPage(1); }}
                      className={`px-2.5 py-1 text-xs rounded-md font-bold transition-all ${
                        rating === r
                          ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                          : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                    >
                      {r === 'all' ? 'All' : `${r}★`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Table container */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-2">
                <Spinner />
                <span className="text-xs text-zinc-500">Scanning Customer Feedbacks...</span>
              </div>
            ) : reviews.length === 0 ? (
              <div className="py-20 text-center text-zinc-500 text-sm font-medium">No reviews found matching the filters.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 dark:bg-zinc-950/50 text-[10px] uppercase font-bold text-zinc-500 tracking-widest border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-6 py-4">Customer Name</th>
                    <th className="px-6 py-4">Vendor</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4 max-w-xs">Feedback Comment</th>
                    <th className="px-6 py-4">Linked ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                  {reviews.map((rev) => (
                    <tr 
                      key={rev.id} 
                      className={`hover:bg-zinc-50/50 dark:hover:bg-white/5 transition-colors group ${
                        rev.isHidden ? 'bg-red-500/5 hover:bg-red-500/10' : ''
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-white">
                        {rev.customer?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-900 dark:text-white font-medium">
                        {rev.vendor?.outletName || rev.vendor?.name || 'Unknown Vendor'}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={rev.vendor?.vendorType === 'salon' ? 'orange' : 'neon'}>
                          {rev.vendor?.vendorType === 'salon' ? '💇 Salon' : '🍔 Food'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        {renderStars(rev.rating)}
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-600 dark:text-zinc-300 max-w-xs truncate" title={rev.comment}>
                        {rev.comment || <span className="text-zinc-400 italic">No comment provided</span>}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-zinc-400">
                        {rev.orderId ? `🍔 Order #${rev.orderId.slice(0, 8)}` : `💇 Booking #${rev.bookingId.slice(0, 8)}`}
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500 dark:text-zinc-450">
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <Button
                          variant={rev.isHidden ? 'outline' : 'secondary'}
                          size="xs"
                          onClick={() => handleToggleHide(rev)}
                          className={rev.isHidden ? 'border-amber-500 text-amber-500 hover:bg-amber-500/10' : ''}
                        >
                          {rev.isHidden ? '👁️ Show' : '🚫 Hide'}
                        </Button>
                        <Button
                          variant="danger"
                          size="xs"
                          onClick={() => handleDeleteClick(rev)}
                        >
                          🗑️ Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-500">
                Showing Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  ◀ Previous
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next ▶
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      {reviewToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white dark:bg-zinc-900 border-zinc-250 dark:border-zinc-800 overflow-hidden shadow-2xl animate-in scale-in duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                ⚠️
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black text-zinc-900 dark:text-white">Delete Review?</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Are you sure you want to delete this review by <strong>{reviewToDelete.customer?.name || 'Unknown'}</strong>? 
                  This will remove the feedback permanent and reset the review eligibility for their order/booking.
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950/60 border-t border-zinc-200 dark:border-zinc-855 flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={deleting} 
                onClick={() => setReviewToDelete(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                size="sm" 
                loading={deleting} 
                onClick={confirmDelete}
              >
                Confirm Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
