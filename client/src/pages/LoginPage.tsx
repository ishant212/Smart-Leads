import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await API.post("/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      {/* Ambient grid background */}
      <div style={styles.gridOverlay} />

      <div style={styles.card}>
        {/* Logo mark */}
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

        <h1 style={styles.heading}>Welcome back</h1>
        <p style={styles.subheading}>Sign in to your workspace</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email address</label>
            <input
              type="email"
              name="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={e => (e.target.style.borderColor = "#6366f1")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={e => (e.target.style.borderColor = "#6366f1")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={loading ? { ...styles.btn, opacity: 0.7, cursor: "not-allowed" } : styles.btn}
          >
            {loading ? (
              <span style={styles.btnInner}>
                <span style={styles.spinner} /> Signing in…
              </span>
            ) : (
              "Sign in →"
            )}
          </button>
        </form>

        <p style={styles.footer}>
          No account?{" "}
          <Link to="/register" style={styles.link}>
            Create one
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
    maxWidth: "420px",
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
    margin: "0 0 32px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
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
  btn: {
    marginTop: "8px",
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
  btnInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
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

export default LoginPage;
