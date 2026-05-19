import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "sales",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const response = await API.post("/auth/register", formData);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "#6366f1");
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "rgba(255,255,255,0.1)");

  const roles = [
    { value: "sales", label: "Sales User", icon: "📊", desc: "Manage and track leads" },
    { value: "admin", label: "Admin", icon: "🛡️", desc: "Full access, manage team" },
  ];

  return (
    <div style={styles.root}>
      <div style={styles.gridOverlay} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoMark}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="10" stroke="#6366f1" strokeWidth="1.5" />
              <circle cx="11" cy="11" r="4" fill="#6366f1" />
              <line x1="11" y1="1" x2="11" y2="5" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="11" y1="17" x2="11" y2="21" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="1" y1="11" x2="5" y2="11" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="17" y1="11" x2="21" y2="11" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={styles.logoText}>SmartLeads</span>
        </div>

        <h1 style={styles.heading}>Create your account</h1>
        <p style={styles.subheading}>Join your team on SmartLeads</p>

        {error && (
          <div style={styles.errorBox}>
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={styles.form}>
          {/* Two-col row */}
          <div style={styles.row}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full name</label>
              <input
                type="text"
                name="name"
                placeholder="Alex Johnson"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </div>

          {/* Role selector — card style */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Role</label>
            <div style={styles.roleGrid}>
              {roles.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r.value })}
                  style={
                    formData.role === r.value
                      ? { ...styles.roleCard, ...styles.roleCardActive }
                      : styles.roleCard
                  }
                >
                  <span style={styles.roleIcon}>{r.icon}</span>
                  <span style={styles.roleLabel}>{r.label}</span>
                  <span style={styles.roleDesc}>{r.desc}</span>
                  {formData.role === r.value && (
                    <span style={styles.roleCheck}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={loading ? { ...styles.btn, opacity: 0.7, cursor: "not-allowed" } : styles.btn}
          >
            {loading ? "Creating account…" : "Create account →"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/" style={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "#0a0a0f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  gridOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    background: "rgba(18, 18, 28, 0.95)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "48px 44px",
    width: "100%",
    maxWidth: "520px",
    backdropFilter: "blur(24px)",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "32px",
  },
  logoMark: {
    width: "36px",
    height: "36px",
    background: "rgba(99,102,241,0.12)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#e2e8f0",
    letterSpacing: "-0.3px",
  },
  heading: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#f1f5f9",
    margin: "0 0 6px",
    letterSpacing: "-0.5px",
  },
  subheading: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.4)",
    margin: "0 0 28px",
  },
  errorBox: {
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#fca5a5",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },
  label: {
    fontSize: "12px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  input: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "12px 14px",
    fontSize: "14px",
    color: "#e2e8f0",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
  },
  roleGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  roleCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "14px",
    cursor: "pointer",
    textAlign: "left",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    transition: "all 0.15s",
  },
  roleCardActive: {
    background: "rgba(99,102,241,0.12)",
    border: "1px solid rgba(99,102,241,0.4)",
  },
  roleIcon: {
    fontSize: "18px",
    marginBottom: "4px",
  },
  roleLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#e2e8f0",
  },
  roleDesc: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.35)",
  },
  roleCheck: {
    position: "absolute",
    top: "10px",
    right: "12px",
    fontSize: "12px",
    color: "#818cf8",
    fontWeight: 700,
  },
  btn: {
    marginTop: "4px",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "13px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.2px",
    transition: "background 0.2s",
  },
  footer: {
    textAlign: "center",
    marginTop: "24px",
    fontSize: "13px",
    color: "rgba(255,255,255,0.35)",
  },
  link: {
    color: "#818cf8",
    textDecoration: "none",
    fontWeight: 500,
  },
};

export default RegisterPage;
