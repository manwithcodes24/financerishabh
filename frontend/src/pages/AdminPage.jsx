import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, LogOut, Save, X, Lock } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function formatINR(num) {
  return `Rs.${num.toLocaleString("en-IN")}`;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    min_investment: "",
    max_investment: "",
    return_percentage: "40",
    duration_months: "1",
    description: "",
    is_popular: false,
    is_active: true,
  });

  const storedPassword = authenticated ? password : "";

  const fetchSchemes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/schemes?active_only=false`);
      setSchemes(res.data.schemes || []);
    } catch {
      toast.error("Failed to load schemes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchSchemes();
  }, [authenticated, fetchSchemes]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      await axios.post(`${API}/admin/login`, { password });
      setAuthenticated(true);
      toast.success("Login successful!");
    } catch {
      toast.error("Invalid password");
    } finally {
      setLoginLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "", min_investment: "", max_investment: "",
      return_percentage: "40", duration_months: "1",
      description: "", is_popular: false, is_active: true,
    });
    setEditingScheme(null);
    setShowForm(false);
  };

  const handleEdit = (scheme) => {
    setFormData({
      title: scheme.title,
      min_investment: String(scheme.min_investment),
      max_investment: String(scheme.max_investment),
      return_percentage: String(scheme.return_percentage),
      duration_months: String(scheme.duration_months),
      description: scheme.description,
      is_popular: scheme.is_popular,
      is_active: scheme.is_active,
    });
    setEditingScheme(scheme);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      min_investment: parseInt(formData.min_investment),
      max_investment: parseInt(formData.max_investment),
      return_percentage: parseFloat(formData.return_percentage),
      duration_months: parseInt(formData.duration_months),
      description: formData.description,
      is_popular: formData.is_popular,
      is_active: formData.is_active,
    };

    try {
      if (editingScheme) {
        await axios.put(`${API}/admin/schemes/${editingScheme.id}`, payload, {
          headers: { "x-admin-password": storedPassword },
        });
        toast.success("Scheme updated!");
      } else {
        await axios.post(`${API}/admin/schemes`, payload, {
          headers: { "x-admin-password": storedPassword },
        });
        toast.success("Scheme created!");
      }
      resetForm();
      fetchSchemes();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to save scheme");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scheme?")) return;
    try {
      await axios.delete(`${API}/admin/schemes/${id}`, {
        headers: { "x-admin-password": storedPassword },
      });
      toast.success("Scheme deleted!");
      fetchSchemes();
    } catch {
      toast.error("Failed to delete scheme");
    }
  };

  // LOGIN SCREEN
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-20" style={{ background: '#030014' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="p-8 rounded-2xl bg-[#0F0518]/60 border border-white/[0.06] backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-7 h-7 text-[#E056FD]" />
            </div>
            <h1 className="font-['Unbounded'] font-bold text-xl text-white text-center mb-2">Admin Panel</h1>
            <p className="text-sm text-[#52525B] text-center mb-6">Enter password to manage schemes</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                data-testid="admin-password-input"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#52525B] focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
              />
              <button
                type="submit"
                disabled={loginLoading || !password}
                data-testid="admin-login-button"
                className="w-full px-4 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#7F00FF] to-[#E056FD] hover:shadow-[0_0_20px_rgba(127,0,255,0.4)] transition-all duration-300 disabled:opacity-50"
              >
                {loginLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  return (
    <div className="min-h-screen pt-24 pb-12 px-6" style={{ background: '#030014' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-['Unbounded'] font-bold text-2xl text-white">Manage Schemes</h1>
            <p className="text-sm text-[#52525B] mt-1">Create, edit, or delete investment plans</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setShowForm(true); setEditingScheme(null); }}
              data-testid="admin-add-scheme-button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#7F00FF] to-[#E056FD] hover:shadow-[0_0_20px_rgba(127,0,255,0.4)] transition-all"
            >
              <Plus className="w-4 h-4" /> Add Scheme
            </button>
            <button
              onClick={() => { setAuthenticated(false); setPassword(""); }}
              data-testid="admin-logout-button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-[#A1A1AA] border border-white/10 hover:bg-white/5 transition-all"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-6 rounded-2xl bg-[#0F0518]/80 border border-purple-500/20 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['Unbounded'] font-semibold text-lg text-white">
                  {editingScheme ? "Edit Scheme" : "New Scheme"}
                </h2>
                <button onClick={resetForm} className="text-[#52525B] hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#52525B] mb-1 block">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      data-testid="scheme-form-title"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#52525B] focus:outline-none focus:border-purple-500/50 transition-all"
                      placeholder="e.g. Starter Plan"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#52525B] mb-1 block">Return %</label>
                    <input
                      type="number"
                      value={formData.return_percentage}
                      onChange={(e) => setFormData({ ...formData, return_percentage: e.target.value })}
                      required
                      data-testid="scheme-form-return"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#52525B] mb-1 block">Min Investment (INR)</label>
                    <input
                      type="number"
                      value={formData.min_investment}
                      onChange={(e) => setFormData({ ...formData, min_investment: e.target.value })}
                      required
                      data-testid="scheme-form-min"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                      placeholder="e.g. 5000"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#52525B] mb-1 block">Max Investment (INR)</label>
                    <input
                      type="number"
                      value={formData.max_investment}
                      onChange={(e) => setFormData({ ...formData, max_investment: e.target.value })}
                      required
                      data-testid="scheme-form-max"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                      placeholder="e.g. 25000"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#52525B] mb-1 block">Duration (Months)</label>
                    <input
                      type="number"
                      value={formData.duration_months}
                      onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                      required
                      data-testid="scheme-form-duration"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                    />
                  </div>
                  <div className="flex items-end gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_popular}
                        onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                        data-testid="scheme-form-popular"
                        className="w-4 h-4 rounded bg-white/5 border border-white/20 accent-purple-500"
                      />
                      <span className="text-sm text-[#A1A1AA]">Popular</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        data-testid="scheme-form-active"
                        className="w-4 h-4 rounded bg-white/5 border border-white/20 accent-purple-500"
                      />
                      <span className="text-sm text-[#A1A1AA]">Active</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#52525B] mb-1 block">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    data-testid="scheme-form-description"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#52525B] focus:outline-none focus:border-purple-500/50 transition-all resize-none"
                    placeholder="Describe the scheme..."
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-2.5 rounded-xl text-sm text-[#A1A1AA] border border-white/10 hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    data-testid="scheme-form-submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#7F00FF] to-[#E056FD] hover:shadow-[0_0_20px_rgba(127,0,255,0.4)] transition-all"
                  >
                    <Save className="w-4 h-4" />
                    {editingScheme ? "Update" : "Create"} Scheme
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Schemes List */}
        {loading ? (
          <div className="text-center text-[#A1A1AA] py-12">Loading schemes...</div>
        ) : schemes.length === 0 ? (
          <div className="text-center text-[#52525B] py-12">No schemes found. Create your first one!</div>
        ) : (
          <div className="space-y-4">
            {schemes.map((scheme, i) => (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                data-testid={`admin-scheme-row-${i}`}
                className={`p-5 rounded-xl border backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  scheme.is_active
                    ? "bg-[#0F0518]/60 border-white/[0.06]"
                    : "bg-[#0F0518]/30 border-white/[0.03] opacity-60"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-['Unbounded'] font-semibold text-base text-white">{scheme.title}</h3>
                    {scheme.is_popular && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-[#E056FD] border border-purple-500/30">POPULAR</span>
                    )}
                    {!scheme.is_active && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-[#EF4444] border border-red-500/30">INACTIVE</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-[#52525B]">
                    <span>Min: {formatINR(scheme.min_investment)}</span>
                    <span>Max: {formatINR(scheme.max_investment)}</span>
                    <span>Returns: <span className="text-[#10B981]">{scheme.return_percentage}%</span></span>
                    <span>Duration: {scheme.duration_months} month(s)</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(scheme)}
                    data-testid={`admin-edit-scheme-${i}`}
                    className="p-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-[#A1A1AA] hover:text-white transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(scheme.id)}
                    data-testid={`admin-delete-scheme-${i}`}
                    className="p-2.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-[#EF4444] transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
