import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import API from "../api/axios";
import useDebounce from "../hooks/useDebounce";
import type { Lead } from "../types/lead";
import toast from "react-hot-toast";

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  new:       { bg: "rgba(99,102,241,0.15)",  text: "#a5b4fc", dot: "#6366f1" },
  contacted: { bg: "rgba(234,179,8,0.12)",   text: "#fde047", dot: "#eab308" },
  qualified: { bg: "rgba(34,197,94,0.12)",   text: "#86efac", dot: "#22c55e" },
  lost:      { bg: "rgba(239,68,68,0.12)",   text: "#fca5a5", dot: "#ef4444" },
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? STATUS_COLORS.new;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      background: c.bg, color: c.text,
      padding: "3px 10px", borderRadius: "20px",
      fontSize: "12px", fontWeight: 500, textTransform: "capitalize",
    }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", status: "new", source: "website" });
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showForm, setShowForm] = useState(false);

  const csvData = leads.map(l => ({ Name: l.name, Email: l.email, Status: l.status, Source: l.source, CreatedAt: l.createdAt }));

  const totalLeads     = leads.length;
  const newLeads       = leads.filter(l => l.status === "new").length;
  const qualifiedLeads = leads.filter(l => l.status === "qualified").length;
  const lostLeads      = leads.filter(l => l.status === "lost").length;

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(
        `/leads?search=${debouncedSearch}&status=${statusFilter}&source=${sourceFilter}&sort=${sort}&page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeads(res.data.leads);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleLead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/leads/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSelectedLead(res.data.lead);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      if (editingLeadId) {
        await API.put(`/leads/${editingLeadId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await API.post("/leads", formData, { headers: { Authorization: `Bearer ${token}` } });
      }
      setFormData({ name: "", email: "", status: "new", source: "website" });
      setEditingLeadId(null);
      setShowForm(false);
      fetchLeads();
      toast.success(editingLeadId ? "Lead updated" : "Lead created");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/leads/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchLeads();
      toast.success("Lead deleted");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => { fetchLeads(); }, [debouncedSearch, statusFilter, sourceFilter, sort, page]);

  const stats = [
    { label: "Total", value: totalLeads,     color: "#e2e8f0",  bg: "rgba(255,255,255,0.05)" },
    { label: "New",       value: newLeads,       color: "#a5b4fc",  bg: "rgba(99,102,241,0.1)" },
    { label: "Qualified", value: qualifiedLeads, color: "#86efac",  bg: "rgba(34,197,94,0.1)" },
    { label: "Lost",      value: lostLeads,      color: "#fca5a5",  bg: "rgba(239,68,68,0.1)" },
  ];

  return (
    <div style={s.root}>
      {/* NAVBAR */}
      <header style={s.navbar}>
        <div style={s.navLeft}>
          <div style={s.logoMark}>
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="10" stroke="#6366f1" strokeWidth="1.5" />
              <circle cx="11" cy="11" r="4" fill="#6366f1" />
              <line x1="11" y1="1" x2="11" y2="5" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="11" y1="17" x2="11" y2="21" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="1" y1="11" x2="5" y2="11" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="17" y1="11" x2="21" y2="11" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={s.logoText}>SmartLeads</span>
        </div>
        <div style={s.navRight}>
          <CSVLink data={csvData} filename="leads.csv" style={s.exportBtn}>
            ↓ Export CSV
          </CSVLink>
          <button
            onClick={() => { setEditingLeadId(null); setFormData({ name: "", email: "", status: "new", source: "website" }); setShowForm(true); }}
            style={s.addBtn}
          >
            + New Lead
          </button>
          <button onClick={handleLogout} style={s.logoutBtn}>Sign out</button>
        </div>
      </header>

      <main style={s.main}>
        {/* STAT CARDS */}
        <div style={s.statsRow}>
          {stats.map(st => (
            <div key={st.label} style={{ ...s.statCard, background: st.bg }}>
              <p style={s.statLabel}>{st.label}</p>
              <p style={{ ...s.statVal, color: st.color }}>{st.value}</p>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div style={s.filtersRow}>
          <div style={s.searchWrap}>
            <span style={s.searchIcon}>⌕</span>
            <input
              type="text"
              placeholder="Search leads…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={s.searchInput}
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={s.select}>
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </select>
          <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} style={s.select}>
            <option value="">All Sources</option>
            <option value="website">Website</option>
            <option value="instagram">Instagram</option>
            <option value="referral">Referral</option>
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} style={s.select}>
            <option value="latest">Latest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        {/* TABLE */}
        <div style={s.tableCard}>
          {loading && (
            <div style={s.emptyState}>Loading leads…</div>
          )}
          {!loading && leads.length === 0 && (
            <div style={s.emptyState}>
              <p style={{ fontSize: "32px", margin: "0 0 8px" }}>🔍</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>No leads found</p>
            </div>
          )}
          {!loading && leads.length > 0 && (
            <table style={s.table}>
              <thead>
                <tr>
                  {["Name", "Email", "Status", "Source", "Actions"].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr
                    key={lead._id}
                    style={s.tr}
                    onClick={() => fetchSingleLead(lead._id)}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={s.td}>
                      <div style={s.nameCell}>
                        <div style={s.avatar}>{lead.name.charAt(0).toUpperCase()}</div>
                        <span style={{ color: "#e2e8f0", fontWeight: 500 }}>{lead.name}</span>
                      </div>
                    </td>
                    <td style={{ ...s.td, color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>{lead.email}</td>
                    <td style={s.td}><StatusBadge status={lead.status} /></td>
                    <td style={{ ...s.td, color: "rgba(255,255,255,0.5)", fontSize: "13px", textTransform: "capitalize" }}>{lead.source}</td>
                    <td style={s.td} onClick={e => e.stopPropagation()}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => {
                            setEditingLeadId(lead._id);
                            setFormData({ name: lead.name, email: lead.email, status: lead.status, source: lead.source });
                            setShowForm(true);
                          }}
                          style={s.editBtn}
                        >
                          Edit
                        </button>
                        {role === "admin" && (
                          <button onClick={() => handleDeleteLead(lead._id)} style={s.deleteBtn}>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION */}
        <div style={s.pagination}>
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            style={page === 1 ? { ...s.pageBtn, opacity: 0.4, cursor: "not-allowed" } : s.pageBtn}
          >
            ← Prev
          </button>
          <span style={s.pageInfo}>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            style={page === totalPages ? { ...s.pageBtn, opacity: 0.4, cursor: "not-allowed" } : s.pageBtn}
          >
            Next →
          </button>
        </div>
      </main>

      {/* LEAD FORM MODAL */}
      {showForm && (
        <div style={s.modalOverlay} onClick={() => setShowForm(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editingLeadId ? "Edit lead" : "New lead"}</h2>
              <button onClick={() => setShowForm(false)} style={s.closeBtn}>✕</button>
            </div>
            <form onSubmit={handleSubmitLead} style={s.modalForm}>
              <div style={s.modalRow}>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Name</label>
                  <input type="text" name="name" placeholder="Full name" value={formData.name} onChange={handleChange} required style={s.input} />
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Email</label>
                  <input type="email" name="email" placeholder="email@company.com" value={formData.email} onChange={handleChange} required style={s.input} />
                </div>
              </div>
              <div style={s.modalRow}>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} style={s.input}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Source</label>
                  <select name="source" value={formData.source} onChange={handleChange} style={s.input}>
                    <option value="website">Website</option>
                    <option value="instagram">Instagram</option>
                    <option value="referral">Referral</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={submitting} style={submitting ? { ...s.submitBtn, opacity: 0.7 } : s.submitBtn}>
                {submitting ? "Processing…" : editingLeadId ? "Update lead" : "Create lead"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LEAD DETAILS MODAL */}
      {selectedLead && (
        <div style={s.modalOverlay} onClick={() => setSelectedLead(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Lead details</h2>
              <button onClick={() => setSelectedLead(null)} style={s.closeBtn}>✕</button>
            </div>
            <div style={s.detailsBody}>
              <div style={s.detailAvatar}>{selectedLead.name.charAt(0).toUpperCase()}</div>
              <p style={s.detailName}>{selectedLead.name}</p>
              <p style={s.detailEmail}>{selectedLead.email}</p>
              <div style={s.detailBadgeRow}>
                <StatusBadge status={selectedLead.status} />
                <span style={s.sourceBadge}>{selectedLead.source}</span>
              </div>
              <div style={s.detailMeta}>
                <span style={s.metaLabel}>Created</span>
                <span style={s.metaVal}>{new Date(selectedLead.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh", background: "#080810", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", color: "#e2e8f0" },

  /* NAV */
  navbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", height: "60px", background: "rgba(12,12,20,0.95)", borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 },
  navLeft: { display: "flex", alignItems: "center", gap: "10px" },
  logoMark: { width: "30px", height: "30px", background: "rgba(99,102,241,0.12)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { fontSize: "14px", fontWeight: 600, color: "#e2e8f0", letterSpacing: "-0.3px" },
  navRight: { display: "flex", alignItems: "center", gap: "10px" },
  exportBtn: { padding: "7px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#94a3b8", fontSize: "13px", textDecoration: "none", fontWeight: 500 },
  addBtn: { padding: "7px 16px", background: "#6366f1", border: "none", borderRadius: "8px", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer" },
  logoutBtn: { padding: "7px 14px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "rgba(255,255,255,0.4)", fontSize: "13px", cursor: "pointer" },

  /* MAIN */
  main: { padding: "32px 28px", maxWidth: "1200px", margin: "0 auto" },

  /* STATS */
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" },
  statCard: { borderRadius: "14px", padding: "20px 24px", border: "1px solid rgba(255,255,255,0.06)" },
  statLabel: { fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.6px", margin: "0 0 8px" },
  statVal: { fontSize: "32px", fontWeight: 700, margin: 0, letterSpacing: "-1px" },

  /* FILTERS */
  filtersRow: { display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" },
  searchWrap: { position: "relative", flex: 1, minWidth: "200px" },
  searchIcon: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", fontSize: "18px", pointerEvents: "none" },
  searchInput: { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px 10px 36px", fontSize: "13px", color: "#e2e8f0", outline: "none", boxSizing: "border-box" },
  select: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", color: "#94a3b8", outline: "none", minWidth: "140px" },

  /* TABLE */
  tableCard: { background: "rgba(14,14,24,0.8)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden", marginBottom: "20px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "14px 20px", fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.8px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" },
  tr: { transition: "background 0.15s", cursor: "pointer" },
  td: { padding: "14px 20px", fontSize: "14px", borderBottom: "1px solid rgba(255,255,255,0.04)" },
  nameCell: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: { width: "30px", height: "30px", borderRadius: "8px", background: "rgba(99,102,241,0.2)", color: "#a5b4fc", fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },

  editBtn: { padding: "5px 12px", background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.2)", borderRadius: "6px", color: "#fde047", fontSize: "12px", fontWeight: 500, cursor: "pointer" },
  deleteBtn: { padding: "5px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", color: "#fca5a5", fontSize: "12px", fontWeight: 500, cursor: "pointer" },

  /* PAGINATION */
  pagination: { display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" },
  pageBtn: { padding: "8px 18px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#94a3b8", fontSize: "13px", cursor: "pointer" },
  pageInfo: { fontSize: "13px", color: "rgba(255,255,255,0.35)" },

  emptyState: { padding: "60px 20px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "14px" },

  /* MODAL */
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" },
  modal: { background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "500px", position: "relative" },
  modalHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" },
  modalTitle: { fontSize: "18px", fontWeight: 700, color: "#f1f5f9", margin: 0 },
  closeBtn: { background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "8px", width: "30px", height: "30px", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "14px" },
  modalForm: { display: "flex", flexDirection: "column", gap: "20px" },
  modalRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "7px" },
  label: { fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.4)", letterSpacing: "0.5px", textTransform: "uppercase" },
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "11px 14px", fontSize: "13px", color: "#e2e8f0", outline: "none" },
  submitBtn: { background: "#6366f1", color: "#fff", border: "none", borderRadius: "10px", padding: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer" },

  /* DETAIL MODAL */
  detailsBody: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: "8px" },
  detailAvatar: { width: "64px", height: "64px", borderRadius: "16px", background: "rgba(99,102,241,0.2)", color: "#a5b4fc", fontSize: "24px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" },
  detailName: { fontSize: "20px", fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" },
  detailEmail: { fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: "0 0 16px" },
  detailBadgeRow: { display: "flex", gap: "8px", justifyContent: "center", marginBottom: "24px" },
  sourceBadge: { display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", textTransform: "capitalize" },
  detailMeta: { width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  metaLabel: { fontSize: "12px", color: "rgba(255,255,255,0.35)" },
  metaVal: { fontSize: "13px", color: "#94a3b8" },
};

export default DashboardPage;
