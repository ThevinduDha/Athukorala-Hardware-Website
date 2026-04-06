import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Archive,
  Trash2,
  Pencil,
  Calendar,
  Clock,
  Megaphone,
  ShieldAlert,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const NoticeArchive = ({ refreshTrigger = 0, onEdit = () => {} }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/notices/all');
      const data = await res.json();
      setNotices(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load notice archive');
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this notice?');
    if (!confirmed) return;

    setDeletingId(id);
    const loadingToast = toast.loading('Deleting notice...');

    try {
      const res = await fetch(`http://localhost:8080/api/notices/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast.success('Notice deleted successfully', { id: loadingToast });
        await fetchNotices();
      } else {
        toast.error('Failed to delete notice', { id: loadingToast });
      }
    } catch (err) {
      toast.error('Server error while deleting', { id: loadingToast });
    } finally {
      setDeletingId(null);
    }
  };

  const customerNotices = useMemo(
    () => notices.filter((n) => n.targetRole === 'CUSTOMER'),
    [notices]
  );

  const staffNotices = useMemo(
    () => notices.filter((n) => n.targetRole === 'STAFF'),
    [notices]
  );

  return (
    <div className="space-y-8">
      <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] backdrop-blur-2xl p-6 sm:p-7 lg:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] text-black flex items-center justify-center shadow-[0_0_24px_rgba(212,175,55,0.2)]">
            <Archive size={20} />
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              Notice Archive
            </p>
            <h2 className="text-2xl font-semibold tracking-tight mt-1 text-white">
              Broadcast History
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center text-gray-500">
            <Loader2 size={22} className="animate-spin mr-3" />
            Loading archive...
          </div>
        ) : (
          <div className="space-y-10">
            {/* CUSTOMER NOTICES */}
            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                  Customer Promotions
                </h3>
              </div>

              {customerNotices.length === 0 ? (
                <EmptyState text="No customer promotions found." />
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <AnimatePresence>
                    {customerNotices.map((notice) => (
                      <NoticeCard
                        key={notice.id}
                        notice={notice}
                        type="customer"
                        deleting={deletingId === notice.id}
                        onDelete={() => handleDelete(notice.id)}
                        onEdit={() => onEdit(notice)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>

            {/* STAFF NOTICES */}
            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Internal Staff Notices
                </h3>
              </div>

              {staffNotices.length === 0 ? (
                <EmptyState text="No staff notices found." />
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <AnimatePresence>
                    {staffNotices.map((notice) => (
                      <NoticeCard
                        key={notice.id}
                        notice={notice}
                        type="staff"
                        deleting={deletingId === notice.id}
                        onDelete={() => handleDelete(notice.id)}
                        hideEdit
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ text }) => (
  <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 text-sm text-gray-500">
    {text}
  </div>
);

const NoticeCard = ({
  notice,
  type,
  deleting,
  onDelete,
  onEdit,
  hideEdit = false
}) => {
  const isCustomer = type === 'customer';
  const accent = isCustomer ? '#D4AF37' : '#60A5FA';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="rounded-[28px] border border-white/10 bg-black/25 overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.22)]"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] min-h-[340px]">
        {/* LEFT CONTENT */}
        <div className="p-6 sm:p-7 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: isCustomer
                  ? 'rgba(212,175,55,0.12)'
                  : 'rgba(96,165,250,0.12)',
                color: accent
              }}
            >
              {isCustomer ? <Megaphone size={18} /> : <ShieldAlert size={18} />}
            </div>

            <div className="min-w-0">
              <p
                className="text-[11px] uppercase tracking-[0.18em] font-semibold"
                style={{ color: accent }}
              >
                {isCustomer ? 'Customer Promotion' : 'Staff Notice'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {notice.active ? 'Active' : 'Inactive'}
                {notice.urgent ? ' • Urgent' : ''}
              </p>
            </div>
          </div>

          <h4 className="text-2xl font-black tracking-tight text-white leading-tight">
            {notice.title}
          </h4>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar size={13} />
              <span>
                Start:{' '}
                {notice.startDate
                  ? new Date(notice.startDate).toLocaleDateString()
                  : '—'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={13} />
              <span>
                End:{' '}
                {notice.expiryDate
                  ? new Date(notice.expiryDate).toLocaleDateString()
                  : '—'}
              </span>
            </div>
          </div>

          <p className="mt-5 text-sm text-gray-300 leading-relaxed border-l-2 border-white/10 pl-4 flex-1">
            {notice.message}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            {!hideEdit ? (
              <button
                onClick={onEdit}
                className="rounded-2xl border border-white/10 bg-white/[0.03] py-4 text-sm font-semibold text-white hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-all flex items-center justify-center gap-2"
              >
                <Pencil size={15} />
                Edit Notice
              </button>
            ) : (
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] py-4 text-sm text-gray-500 flex items-center justify-center">
                Edit disabled for staff panel
              </div>
            )}

            <button
              onClick={onDelete}
              disabled={deleting}
              className="rounded-2xl border border-red-500/20 bg-red-500/8 py-4 text-sm font-semibold text-red-300 hover:bg-red-500/12 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {deleting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={15} />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative border-t md:border-t-0 md:border-l border-white/8 min-h-[240px]">
          {notice.imageUrl ? (
            <>
              <img
                src={notice.imageUrl}
                alt={notice.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4">
                <div className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-xl p-4">
                  <p
                    className="text-[11px] uppercase tracking-[0.16em] font-semibold mb-2"
                    style={{ color: accent }}
                  >
                    Notice Image
                  </p>
                  <p className="text-sm text-white font-medium line-clamp-2">
                    {notice.title}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="text-center px-6">
                <div className="w-14 h-14 mx-auto rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-[#D4AF37] mb-4">
                  <ImageIcon size={24} />
                </div>
                <p className="text-sm text-gray-400 font-medium">
                  No image available
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NoticeArchive;