"use client";
import { useState, useEffect } from "react";
import { Users, Search, Shield, UserCheck, UserX, RefreshCw, Download, Filter } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  university?: string;
  organization?: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

const ROLES = ["admin", "participant", "judge", "partner", "student"];
const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-500/20 text-red-400 border-red-500/30",
  judge: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  participant: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  partner: "bg-green-500/20 text-green-400 border-green-500/30",
  student: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BICTA_API_URL || "";
      const res = await fetch(`${apiUrl}/api/admin/users`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        // Demo data for when backend isn't connected
        setUsers([
          { id: 1, name: "Arif Hossain", email: "arif@buet.ac.bd", role: "participant", phone: "+880 1712 345678", university: "BUET", emailVerified: true, isActive: true, createdAt: new Date().toISOString() },
          { id: 2, name: "Dr. Karim Reza", email: "karim@cse.buet.ac.bd", role: "judge", organization: "BUET", emailVerified: true, isActive: true, createdAt: new Date().toISOString() },
          { id: 3, name: "Tasfia Noor", email: "tasfia@du.ac.bd", role: "participant", university: "DU", emailVerified: false, isActive: true, createdAt: new Date().toISOString() },
          { id: 4, name: "Admin User", email: "admin@bicta.org", role: "admin", emailVerified: true, isActive: true, createdAt: new Date().toISOString() },
        ]);
      }
    } catch { } finally { setLoading(false); }
  };

  const updateUser = async (id: number, updates: Partial<User>) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BICTA_API_URL || "";
      await fetch(`${apiUrl}/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
      showToast("✓ User updated");
    } catch { showToast("Update failed"); }
  };

  useEffect(() => { loadUsers(); }, []);

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    const matchStatus = statusFilter === "All" || (statusFilter === "Active" ? u.isActive : !u.isActive);
    return matchSearch && matchRole && matchStatus;
  });

  const exportCSV = () => {
    const header = "ID,Name,Email,Role,University/Org,Verified,Active,Joined";
    const rows = filtered.map(u => `${u.id},"${u.name}",${u.email},${u.role},"${u.university || u.organization || ""}",${u.emailVerified},${u.isActive},${new Date(u.createdAt).toLocaleDateString()}`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "bicta-users.csv"; a.click();
  };

  const stats = {
    total: users.length,
    participants: users.filter(u => u.role === "participant").length,
    judges: users.filter(u => u.role === "judge").length,
    verified: users.filter(u => u.emailVerified).length,
  };

  return (
    <div className="p-6 min-h-screen bg-bicta-void">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl text-bicta-cream">User Management</h1>
            <p className="text-bicta-subtle text-sm mt-1">{users.length} registered users</p>
          </div>
          <div className="flex gap-3">
            <button onClick={loadUsers} className="flex items-center gap-2 px-4 py-2 border border-bicta-border text-bicta-muted text-sm rounded hover:border-bicta-gold/40 transition-colors">
              <RefreshCw size={14} /> Refresh
            </button>
            <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-bicta-gold text-bicta-void text-sm font-medium rounded hover:bg-bicta-gold-lt transition-colors">
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[{ l: "Total Users", v: stats.total, icon: Users }, { l: "Participants", v: stats.participants, icon: UserCheck }, { l: "Judges", v: stats.judges, icon: Shield }, { l: "Verified", v: stats.verified, icon: UserCheck }].map(s => (
            <div key={s.l} className="bg-bicta-surface border border-bicta-border rounded-xl p-5">
              <s.icon size={16} className="text-bicta-gold mb-2" />
              <div className="text-2xl font-bold text-bicta-cream">{s.v}</div>
              <div className="text-xs text-bicta-subtle mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bicta-subtle" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
              className="w-full bg-bicta-surface border border-bicta-border text-bicta-cream pl-9 pr-4 py-2.5 text-sm rounded focus:outline-none focus:border-bicta-gold/60" />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="bg-bicta-surface border border-bicta-border text-bicta-cream px-4 py-2.5 text-sm rounded focus:outline-none">
            <option value="All">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}s</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-bicta-surface border border-bicta-border text-bicta-cream px-4 py-2.5 text-sm rounded focus:outline-none">
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Toast */}
        {toast && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-sm">{toast}</div>}

        {/* Table */}
        <div className="bg-bicta-surface border border-bicta-border rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-bicta-subtle">Loading users...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-bicta-subtle">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-bicta-border">
                    {["User", "Role", "University / Org", "Status", "Verified", "Joined", "Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-bicta-subtle uppercase tracking-wider font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(user => (
                    <tr key={user.id} className="border-b border-bicta-border/50 hover:bg-bicta-raised/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-bicta-gold/20 border border-bicta-gold/30 flex items-center justify-center text-xs font-bold text-bicta-gold">
                            {(user.name || "?")[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="text-bicta-cream text-sm font-medium">{user.name}</div>
                            <div className="text-bicta-subtle text-xs">{user.email}</div>
                            {user.phone && <div className="text-bicta-subtle text-xs">{user.phone}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <select value={user.role} onChange={e => updateUser(user.id, { role: e.target.value as any })}
                          className={`px-2 py-1 rounded border text-xs font-medium bg-transparent cursor-pointer ${ROLE_COLORS[user.role] || ROLE_COLORS.student}`}>
                          {ROLES.map(r => <option key={r} value={r} className="bg-bicta-surface text-bicta-cream">{r}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-4 text-bicta-muted text-sm">{user.university || user.organization || "—"}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded text-xs border ${user.isActive ? "bg-green-500/10 text-green-400 border-green-500/30" : "bg-red-500/10 text-red-400 border-red-500/30"}`}>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded text-xs border ${user.emailVerified ? "bg-green-500/10 text-green-400 border-green-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"}`}>
                          {user.emailVerified ? "✓ Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-bicta-subtle text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => updateUser(user.id, { isActive: !user.isActive })}
                            className={`p-1.5 rounded border transition-colors ${user.isActive ? "border-red-500/30 text-red-400 hover:bg-red-500/10" : "border-green-500/30 text-green-400 hover:bg-green-500/10"}`}>
                            {user.isActive ? <UserX size={13} /> : <UserCheck size={13} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-4 text-xs text-bicta-subtle">Showing {filtered.length} of {users.length} users</div>
      </div>
    </div>
  );
}
