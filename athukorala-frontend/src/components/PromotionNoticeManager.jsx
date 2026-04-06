import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone,
  Send,
  Sparkles,
  AlertTriangle,
  Eye,
  Clock,
  Calendar,
  Loader2,
  Image as ImageIcon,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ImageUpload from '../components/ImageUpload';

const PromotionNoticeManager = ({
  editingNotice = null,
  onCancelEdit = () => {},
  onSuccess = () => {}
}) => {
  const today = new Date().toISOString().split('T')[0];

  const [isDeploying, setIsDeploying] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    startDate: today,
    expiryDate: '',
    urgent: false
  });

  useEffect(() => {
    if (editingNotice) {
      setFormData({
        title: editingNotice.title || '',
        message: editingNotice.message || '',
        startDate: editingNotice.startDate || today,
        expiryDate: editingNotice.expiryDate || '',
        urgent: editingNotice.urgent || false
      });
      setImageUrl(editingNotice.imageUrl || '');
    } else {
      setFormData({
        title: '',
        message: '',
        startDate: today,
        expiryDate: '',
        urgent: false
      });
      setImageUrl('');
    }
  }, [editingNotice, today]);

  const isUpcoming =
    formData.startDate && new Date(formData.startDate) > new Date(today);

  const canPreview = useMemo(() => {
    return (
      formData.title.trim() ||
      formData.message.trim() ||
      formData.expiryDate ||
      imageUrl
    );
  }, [formData, imageUrl]);

  const validateProtocol = () => {
    if (!formData.title.trim() || formData.title.trim().length < 5) {
      toast.error('VALIDATION ERROR: Title must be at least 5 characters');
      return false;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      toast.error('VALIDATION ERROR: Message must be at least 10 characters');
      return false;
    }

    if (!formData.expiryDate) {
      toast.error('VALIDATION ERROR: Expiry date required');
      return false;
    }

    if (new Date(formData.expiryDate) < new Date(formData.startDate)) {
      toast.error('DATE ERROR: Expiry cannot be before start date');
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      startDate: today,
      expiryDate: '',
      urgent: false
    });
    setImageUrl('');
    setShowPreview(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateProtocol() || isDeploying) return;

    setIsDeploying(true);
    const loading = toast.loading(
      editingNotice ? 'Updating Promotion...' : 'Publishing Promotion...'
    );

    try {
      const url = editingNotice
        ? `http://localhost:8080/api/notices/${editingNotice.id}`
        : 'http://localhost:8080/api/notices/publish';

      const method = editingNotice ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          message: formData.message.trim(),
          startDate: formData.startDate,
          expiryDate: formData.expiryDate,
          urgent: formData.urgent,
          active: true,
          targetRole: 'CUSTOMER',
          imageUrl: imageUrl
        })
      });

      if (res.ok) {
        toast.success(
          editingNotice
            ? 'PROMOTION UPDATED SUCCESSFULLY'
            : 'PROMOTION PUBLISHED SUCCESSFULLY',
          {
            id: loading,
            style: {
              border: '1px solid #D4AF37',
              padding: '16px',
              color: '#D4AF37',
              background: '#000',
              fontSize: '10px',
              fontWeight: '900',
              letterSpacing: '0.18em',
              textTransform: 'uppercase'
            }
          }
        );

        resetForm();
        onSuccess();
      } else {
        toast.error(
          editingNotice ? 'Failed to update promotion' : 'Failed to publish promotion',
          { id: loading }
        );
      }
    } catch (err) {
      toast.error('Server error', { id: loading });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] backdrop-blur-2xl text-white shadow-[0_20px_70px_rgba(0,0,0,0.30)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_34%)] pointer-events-none" />
      <motion.div
        animate={{ x: ['-100%', '120%'] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'linear' }}
        className="absolute top-0 left-0 h-[1px] w-1/3 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-70"
      />

      <div className="relative z-10 p-6 sm:p-7 lg:p-8 xl:p-9">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] text-black flex items-center justify-center shadow-[0_0_24px_rgba(212,175,55,0.24)]">
              <Megaphone size={20} />
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                Promotion Command
              </p>
              <h2 className="text-2xl font-semibold tracking-tight mt-1">
                Customer Announcement Registry
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setShowPreview((prev) => !prev)}
              className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-all ${
                showPreview
                  ? 'border-[#D4AF37]/25 bg-[#D4AF37]/10 text-[#D4AF37]'
                  : 'border-white/10 bg-white/[0.03] text-gray-400 hover:text-white'
              }`}
            >
              <Eye size={14} />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-xs font-semibold text-green-400">
              <ShieldCheck size={14} />
              Registry Online
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.92fr] gap-8">
          {/* FORM SIDE */}
          <div className="space-y-6">
            {/* IMAGE */}
            <div className="rounded-[26px] border border-white/10 bg-black/25 p-5">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                  Promotion Image
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Upload, replace, or remove the campaign image.
                </p>
              </div>

              <ImageUpload
                initialImage={imageUrl}
                onUploadSuccess={(url) => setImageUrl(url)}
                label="Upload campaign image"
              />
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-[0.16em] text-gray-500 font-semibold block">
                  Promotion Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. April Mega Discount"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-sm font-medium text-white outline-none focus:border-[#D4AF37] transition-all placeholder:text-gray-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-[0.16em] text-gray-500 font-semibold block">
                  Message
                </label>
                <textarea
                  placeholder="Enter the campaign message shown to customers..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-sm text-white outline-none focus:border-[#D4AF37] transition-all placeholder:text-gray-600 h-32 resize-none"
                />
              </div>

              {/* DATE FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar size={15} className="text-[#D4AF37]" />
                    <label className="text-[11px] uppercase tracking-[0.16em] text-gray-500 font-semibold">
                      Start Date
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="date"
                      min={today}
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="premium-date-input w-full bg-transparent text-sm font-medium text-white outline-none pr-10"
                    />
                    <Calendar
                      size={15}
                      className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock size={15} className="text-[#D4AF37]" />
                    <label className="text-[11px] uppercase tracking-[0.16em] text-gray-500 font-semibold">
                      Expiry Date
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="date"
                      min={formData.startDate || today}
                      value={formData.expiryDate}
                      onChange={(e) =>
                        setFormData({ ...formData, expiryDate: e.target.value })
                      }
                      className="premium-date-input w-full bg-transparent text-sm font-medium text-white outline-none pr-10"
                    />
                    <Clock
                      size={15}
                      className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, urgent: !formData.urgent })
                }
                className={`w-full rounded-2xl border px-5 py-4 text-sm font-semibold transition-all flex items-center justify-center gap-3 ${
                  formData.urgent
                    ? 'border-red-500/30 bg-red-500/12 text-red-400'
                    : 'border-white/10 bg-white/[0.03] text-gray-400 hover:text-white'
                }`}
              >
                <AlertTriangle
                  size={16}
                  className={formData.urgent ? 'animate-pulse' : ''}
                />
                {formData.urgent ? 'High Priority Active' : 'Normal Priority'}
              </button>

              <div className="rounded-2xl border border-[#D4AF37]/10 bg-[#D4AF37]/[0.04] px-5 py-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[#D4AF37] font-semibold mb-2">
                  Deployment Note
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  The uploaded image will be stored in Cloudinary and the returned URL
                  will be saved with this notice record.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {editingNotice && (
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      onCancelEdit();
                    }}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] py-4 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all"
                  >
                    Cancel Edit
                  </button>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={isDeploying}
                  className={`rounded-2xl py-4 text-sm font-semibold transition-all flex items-center justify-center gap-3 shadow-xl ${
                    editingNotice ? 'sm:col-span-1' : 'sm:col-span-2'
                  } ${
                    isDeploying
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-[#D4AF37] text-black hover:bg-white'
                  }`}
                >
                  {isDeploying ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {editingNotice ? 'Updating Promotion...' : 'Publishing Promotion...'}
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      {editingNotice ? 'Update Promotion' : 'Publish Promotion'}
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>

          {/* PREVIEW SIDE */}
          <div className="space-y-5">
            <AnimatePresence mode="wait">
              {showPreview && (
                <motion.div
                  key="preview-card"
                  initial={{ opacity: 0, y: 18, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 14, scale: 0.985 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.25)]"
                >
                  <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                        Live Preview
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        How it may appear to customers
                      </p>
                    </div>

                    <div
                      className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                        isUpcoming
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                      }`}
                    >
                      {isUpcoming ? 'Upcoming' : 'Active'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] min-h-[420px]">
                    <div className="p-6 sm:p-7 flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span
                          className={`text-[11px] uppercase tracking-[0.18em] font-semibold ${
                            formData.urgent ? 'text-red-400' : 'text-[#D4AF37]'
                          }`}
                        >
                          {formData.urgent
                            ? 'High Priority Promotion'
                            : isUpcoming
                            ? 'Upcoming Campaign'
                            : 'Live Campaign'}
                        </span>

                        {formData.urgent && (
                          <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-semibold uppercase tracking-[0.1em]">
                            Urgent
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
                        {formData.title || 'Promotion Title Preview'}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar size={13} />
                          <span>
                            Start:{' '}
                            {formData.startDate
                              ? new Date(formData.startDate).toLocaleDateString()
                              : '—'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock size={13} />
                          <span>
                            End:{' '}
                            {formData.expiryDate
                              ? new Date(formData.expiryDate).toLocaleDateString()
                              : '—'}
                          </span>
                        </div>
                      </div>

                      <p className="mt-5 text-sm text-gray-300 leading-relaxed border-l-2 border-white/10 pl-4">
                        {formData.message ||
                          'Your customer-facing campaign message will appear here once entered.'}
                      </p>

                      <div className="mt-7">
                        <button
                          type="button"
                          disabled
                          className={`px-5 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 ${
                            isUpcoming
                              ? 'bg-white/[0.04] border border-white/8 text-gray-500'
                              : 'bg-[#D4AF37] text-black'
                          }`}
                        >
                          {isUpcoming ? 'Coming Soon' : 'Secure Offer'}
                          {!isUpcoming && <ChevronRight size={15} />}
                        </button>
                      </div>
                    </div>

                    <div className="relative border-t lg:border-t-0 lg:border-l border-white/8 min-h-[260px]">
                      {imageUrl ? (
                        <>
                          <img
                            src={imageUrl}
                            alt="Promotion Preview"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_36%)]" />

                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-xl p-4">
                              <p className="text-[11px] uppercase tracking-[0.16em] text-[#D4AF37] font-semibold mb-2">
                                Preview Image
                              </p>
                              <p className="text-sm text-white font-medium line-clamp-2">
                                {formData.title || 'Promotion Title Preview'}
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
                              No image uploaded yet
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!canPreview && !showPreview && (
              <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-6 text-sm text-gray-500">
                Start entering promotion details to generate a preview.
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .premium-date-input::-webkit-calendar-picker-indicator {
          opacity: 0;
          cursor: pointer;
          width: 100%;
          position: absolute;
          right: 0;
        }
      `}</style>
    </div>
  );
};

export default PromotionNoticeManager;