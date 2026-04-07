import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  MapPin,
  Phone,
  Package,
  ShieldCheck,
  Camera,
  Save,
  Trash2,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  Activity,
  LayoutGrid,
  Heart,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  BadgeCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    profilePic: null
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.id) {
      const nameParts = (user.name || '').trim().split(' ');
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phone: user.phone || '',
        address: user.address || '',
        profilePic: user.profilePic || null
      });

      fetch(`http://localhost:8080/api/orders/user/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setOrders(Array.isArray(data) ? data : []);
        })
        .catch(() => setOrders([]));
    }
  }, [user.id]);

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex =
      /^(?:0|94|\+94)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$/;

    if (!formData.firstName.trim()) newErrors.firstName = 'Mandatory Field';
    if (!formData.lastName.trim()) newErrors.lastName = 'Mandatory Field';

    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid Protocol Format';
    }

    if (formData.address && formData.address.trim().length < 10) {
      newErrors.address = 'Address too brief (min 10)';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('PROFILE UPDATE REJECTED: CHECK INPUT DATA');
      return false;
    }

    return true;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password required';
    }

    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = 'New password required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Minimum 6 characters';
    }

    if (!passwordData.confirmNewPassword.trim()) {
      newErrors.confirmNewPassword = 'Confirm password required';
    } else if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }

    if (
      passwordData.currentPassword &&
      passwordData.newPassword &&
      passwordData.currentPassword === passwordData.newPassword
    ) {
      newErrors.newPassword = 'New password must be different';
    }

    setPasswordErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('PASSWORD UPDATE REJECTED');
      return false;
    }

    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData((prev) => ({
        ...prev,
        profilePic: reader.result
      }));
    reader.readAsDataURL(file);
  };

  const removeProfilePic = () => {
    setFormData((prev) => ({
      ...prev,
      profilePic: null
    }));
    toast.success('PROFILE IMAGE REMOVED');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const loading = toast.loading('UPDATING PROFILE REGISTRY...');

    const profilePayload = {
      name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
      phone: formData.phone,
      address: formData.address,
      profilePic: formData.profilePic || ''
    };

    try {
      const res = await fetch(`http://localhost:8080/api/users/update/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profilePayload)
      });

      const updatedUserFromServer = await res.json();

      if (res.ok) {
        const updatedUser = {
          ...user,
          ...updatedUserFromServer
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));

        toast.success('PROFILE UPDATED SUCCESSFULLY', {
          id: loading
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(updatedUserFromServer.message || 'PROFILE UPDATE FAILED', {
          id: loading
        });
      }
    } catch (err) {
      toast.error('SYSTEM LINK FAILURE', { id: loading });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    const loading = toast.loading('UPDATING PASSWORD SECURITY...');

    try {
      const res = await fetch(`http://localhost:8080/api/users/${user.id}/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'PASSWORD UPDATED SUCCESSFULLY', { id: loading });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
        setPasswordErrors({});
      } else {
        toast.error(data.message || 'PASSWORD UPDATE FAILED', { id: loading });
      }
    } catch (err) {
      toast.error('SYSTEM LINK FAILURE', { id: loading });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const getInitials = () => {
    const first = formData.firstName?.trim()?.charAt(0) || '';
    const last = formData.lastName?.trim()?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || 'U';
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      <Toaster position="top-right" />

      {/* SIDEBAR */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 96 : 300 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="hidden xl:flex h-screen sticky top-0 border-r border-white/10 bg-black/60 backdrop-blur-2xl flex-col z-40"
      >
        <div className="px-5 py-5 border-b border-white/8">
          <div className={`flex items-center justify-between gap-3 ${sidebarCollapsed ? 'flex-col' : ''}`}>
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] flex items-center justify-center shadow-[0_0_28px_rgba(212,175,55,0.22)]">
                <Activity className="text-black" size={22} />
              </div>

              {!sidebarCollapsed && (
                <div>
                  <p className="text-[18px] font-semibold tracking-tight text-white">
                    Athukorala
                  </p>
                  <p className="text-sm text-[#D4AF37] mt-0.5">
                    Client Registry
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 transition-all"
            >
              {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
          </div>
        </div>

        <nav className="px-4 py-5 space-y-3 flex-1 overflow-y-auto">
          <SideNavItem
            icon={<LayoutGrid size={18} />}
            label="Market Registry"
            collapsed={sidebarCollapsed}
            onClick={() => navigate('/customer-dashboard')}
          />
          <SideNavItem
            icon={<Package size={18} />}
            label="Order History"
            collapsed={sidebarCollapsed}
            onClick={() => navigate('/order-history')}
          />
          <SideNavItem
            icon={<Heart size={18} />}
            label="Curated List"
            collapsed={sidebarCollapsed}
            onClick={() => navigate('/curated-list')}
          />
          <SideNavItem
            icon={<User size={18} />}
            label="Account Config"
            active
            collapsed={sidebarCollapsed}
            onClick={() => navigate('/profile')}
          />
        </nav>

        <div className="px-4 pb-4 space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            {!sidebarCollapsed ? (
              <>
                <p className="text-xs text-gray-500 uppercase tracking-[0.14em]">
                  Authenticated Identity
                </p>
                <p className="text-lg font-medium text-[#D4AF37] mt-3 truncate">
                  {user.name || 'Authorized Guest'}
                </p>
              </>
            ) : (
              <div className="flex justify-center">
                <BadgeCheck className="text-[#D4AF37]" size={18} />
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <div className="rounded-[28px] border border-[#D4AF37]/12 bg-[#D4AF37]/[0.04] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[#D4AF37] mb-3">
                Account Security
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                Manage your personal details, update your password, and control your profile image from one secure page.
              </p>
            </div>
          )}

          <motion.button
            whileHover={{ x: sidebarCollapsed ? 0 : 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className={`w-full rounded-2xl px-4 py-3.5 border border-red-500/20 bg-red-500/8 text-red-300 hover:bg-red-500/12 flex items-center gap-3 transition-all ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={16} />
            {!sidebarCollapsed && <span className="text-sm font-medium">Terminate Session</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[760px] h-[760px] bg-[#D4AF37]/5 blur-[180px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute top-0 left-0 w-[520px] h-[520px] bg-white/[0.02] blur-[150px] rounded-full -z-10 pointer-events-none" />

        <div className="px-5 sm:px-8 lg:px-10 2xl:px-14 py-8 lg:py-10">
          {/* TOP BAR */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8"
          >
            <button
              onClick={() => navigate('/customer-dashboard')}
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#D4AF37] transition-all"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>

            <div className="flex items-center gap-4 self-start lg:self-auto rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-xl">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D4AF37]/30 bg-black flex items-center justify-center">
                {formData.profilePic ? (
                  <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold text-[#D4AF37]">{getInitials()}</span>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Logged in as</p>
                <p className="text-sm font-medium text-white">
                  {`${formData.firstName} ${formData.lastName}`.trim() || user.name || 'User'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* HERO */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-8"
          >
            <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent backdrop-blur-2xl p-6 sm:p-8 lg:p-10 overflow-hidden relative">
              <div className="absolute -top-16 -right-10 w-56 h-56 bg-[#D4AF37]/10 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/[0.03] blur-3xl rounded-full pointer-events-none" />

              <div className="relative z-10 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[#D4AF37] mb-5">
                    <ShieldCheck size={14} />
                    Secure Identity Center
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold tracking-tight leading-tight">
                    Control your
                    <span className="block text-[#D4AF37]">account security</span>
                  </h1>

                  <p className="text-sm sm:text-base text-gray-400 max-w-2xl mt-5 leading-relaxed">
                    Update your profile details, manage your avatar, and change your password from one refined customer settings interface.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 w-full xl:w-auto xl:min-w-[520px]">
                  <MetricCard
                    icon={<User size={18} />}
                    label="Profile Status"
                    value="Active"
                  />
                  <MetricCard
                    icon={<Package size={18} />}
                    label="Order Records"
                    value={orders.length}
                  />
                  <MetricCard
                    icon={<KeyRound size={18} />}
                    label="Security"
                    value="Protected"
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* TABS */}
          <div className="flex flex-wrap gap-3 mb-8">
            <TabButton
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
              label="Profile Settings"
            />
            <TabButton
              active={activeTab === 'password'}
              onClick={() => setActiveTab('password')}
              label="Change Password"
            />
            <TabButton
              active={activeTab === 'orders'}
              onClick={() => setActiveTab('orders')}
              label="Transaction Logs"
            />
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="rounded-[30px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row items-start gap-8">
                    <div className="relative group w-36 h-36 rounded-full bg-black border border-white/10 overflow-hidden shadow-2xl shrink-0">
                      {formData.profilePic ? (
                        <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#D4AF37] text-3xl font-semibold">
                          {getInitials()}
                        </div>
                      )}

                      <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera size={26} className="text-[#D4AF37]" />
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                      </label>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-white mb-2">Profile Avatar</h3>
                      <p className="text-sm text-gray-400 max-w-xl leading-relaxed mb-5">
                        Upload, replace, or remove your profile picture. A round avatar is shown in your account area for a cleaner premium look.
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <label className="rounded-2xl bg-[#D4AF37] text-black px-5 py-3 text-sm font-semibold hover:brightness-105 transition-all cursor-pointer inline-flex items-center gap-2">
                          <Camera size={16} />
                          Upload / Replace
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}
                            accept="image/*"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={removeProfilePic}
                          className="rounded-2xl border border-red-500/20 bg-red-500/8 text-red-300 px-5 py-3 text-sm font-semibold hover:bg-red-500/12 transition-all inline-flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Delete Picture
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleSaveProfile}
                  className="rounded-[30px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-8 space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup
                      label="First Name"
                      value={formData.firstName}
                      error={errors.firstName}
                      onChange={(v) => setFormData({ ...formData, firstName: v })}
                      icon={<User size={16} />}
                    />

                    <InputGroup
                      label="Last Name"
                      value={formData.lastName}
                      error={errors.lastName}
                      onChange={(v) => setFormData({ ...formData, lastName: v })}
                      icon={<User size={16} />}
                    />

                    <InputGroup
                      label="Contact Number"
                      value={formData.phone}
                      error={errors.phone}
                      onChange={(v) => setFormData({ ...formData, phone: v })}
                      icon={<Phone size={16} />}
                    />

                    <div className="space-y-3 text-left">
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-[0.16em] ml-1 block">
                        Authentication Email
                      </label>
                      <div className="w-full h-14 rounded-2xl border border-white/10 bg-black/40 px-4 flex items-center text-sm text-gray-500">
                        {user.email || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-left">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-[0.16em]">
                        Registered Address
                      </label>
                      {errors.address && (
                        <span className="text-red-400 text-xs font-medium flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.address}
                        </span>
                      )}
                    </div>

                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className={`w-full rounded-2xl bg-black/40 border ${
                        errors.address ? 'border-red-500' : 'border-white/10'
                      } p-5 text-sm text-white outline-none focus:border-[#D4AF37] h-32 transition-all`}
                      placeholder="Enter full physical address..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-2xl bg-[#D4AF37] text-black px-6 py-4 text-sm font-semibold hover:brightness-105 transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)] flex items-center gap-3"
                  >
                    <Save size={16} />
                    Save Profile Changes
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'password' && (
              <motion.div
                key="password"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="rounded-[30px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-8">
                  <h3 className="text-2xl font-semibold text-white mb-2">Change Password</h3>
                  <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
                    Use a strong password that you do not use anywhere else. After your backend update, passwords are stored securely as hashes, not plain text.
                  </p>
                </div>

                <form
                  onSubmit={handleChangePassword}
                  className="rounded-[30px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-8 space-y-6"
                >
                  <PasswordGroup
                    label="Current Password"
                    value={passwordData.currentPassword}
                    error={passwordErrors.currentPassword}
                    onChange={(v) => setPasswordData({ ...passwordData, currentPassword: v })}
                    show={showCurrentPassword}
                    setShow={setShowCurrentPassword}
                  />

                  <PasswordGroup
                    label="New Password"
                    value={passwordData.newPassword}
                    error={passwordErrors.newPassword}
                    onChange={(v) => setPasswordData({ ...passwordData, newPassword: v })}
                    show={showNewPassword}
                    setShow={setShowNewPassword}
                  />

                  <PasswordGroup
                    label="Confirm New Password"
                    value={passwordData.confirmNewPassword}
                    error={passwordErrors.confirmNewPassword}
                    onChange={(v) => setPasswordData({ ...passwordData, confirmNewPassword: v })}
                    show={showConfirmPassword}
                    setShow={setShowConfirmPassword}
                  />

                  <button
                    type="submit"
                    className="rounded-2xl bg-[#D4AF37] text-black px-6 py-4 text-sm font-semibold hover:brightness-105 transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)] flex items-center gap-3"
                  >
                    <Lock size={16} />
                    Update Password
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {orders.length === 0 ? (
                  <div className="rounded-[30px] border border-dashed border-white/10 bg-white/[0.02] py-20 px-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
                      <Package className="text-[#D4AF37]" size={28} />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">No transaction logs yet</h3>
                    <p className="text-gray-400">Your order records will appear here once purchases are completed.</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-5 hover:border-[#D4AF37]/30 transition-all group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 text-[#D4AF37] flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                          <Package size={20} />
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-[0.16em]">
                            TXID #{order.id}
                          </p>
                          <h4 className="text-xl font-semibold text-white mt-1">
                            LKR {(order.totalAmount || 0).toLocaleString()}
                          </h4>
                          <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1 text-xs text-[#D4AF37]">
                            <CheckCircle2 size={12} />
                            {order.status || 'AUTHENTICATED'}
                          </div>
                        </div>
                      </div>

                      <ChevronRight className="text-gray-600 group-hover:text-[#D4AF37]" />
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const SideNavItem = ({ icon, label, active = false, collapsed = false, onClick }) => {
  return (
    <motion.button
      whileHover={{ x: collapsed ? 0 : 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all border ${
        active
          ? 'border-[#D4AF37]/25 bg-[#D4AF37] text-black shadow-[0_12px_35px_rgba(212,175,55,0.18)]'
          : 'border-transparent bg-transparent text-gray-300 hover:bg-white/[0.05] hover:border-white/8'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <span className={active ? 'text-black' : 'text-[#D4AF37]'}>{icon}</span>
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </motion.button>
  );
};

const TabButton = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-5 py-3 rounded-2xl text-sm font-medium transition-all border ${
      active
        ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
        : 'bg-white/[0.03] text-gray-300 border-white/10 hover:bg-white/[0.06]'
    }`}
  >
    {label}
  </button>
);

const MetricCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/30 backdrop-blur-xl p-4">
      <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37] mb-3">
        {icon}
      </div>
      <p className="text-xs uppercase tracking-[0.14em] text-gray-500">{label}</p>
      <p className="text-lg sm:text-xl font-semibold mt-2 break-words">{value}</p>
    </div>
  );
};

const InputGroup = ({ label, value, onChange, error, icon }) => (
  <div className="space-y-3 text-left">
    <div className="flex justify-between items-center px-1">
      <label className="text-xs font-medium text-gray-400 uppercase tracking-[0.16em] flex items-center gap-2">
        <span className="text-[#D4AF37]">{icon}</span>
        {label}
      </label>
      {error && (
        <span className="text-red-400 text-xs font-medium flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </span>
      )}
    </div>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full h-14 rounded-2xl bg-black/40 border ${
        error ? 'border-red-500' : 'border-white/10'
      } px-4 text-sm text-white outline-none focus:border-[#D4AF37] transition-all`}
    />
  </div>
);

const PasswordGroup = ({ label, value, onChange, error, show, setShow }) => (
  <div className="space-y-3 text-left">
    <div className="flex justify-between items-center px-1">
      <label className="text-xs font-medium text-gray-400 uppercase tracking-[0.16em] flex items-center gap-2">
        <span className="text-[#D4AF37]">
          <Lock size={14} />
        </span>
        {label}
      </label>
      {error && (
        <span className="text-red-400 text-xs font-medium flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </span>
      )}
    </div>

    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-14 rounded-2xl bg-black/40 border ${
          error ? 'border-red-500' : 'border-white/10'
        } px-4 pr-12 text-sm text-white outline-none focus:border-[#D4AF37] transition-all`}
      />

      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] transition-colors"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

export default CustomerProfile;