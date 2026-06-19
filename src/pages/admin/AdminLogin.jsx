import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= AUTO REDIRECT IF ALREADY LOGGED IN ================= */
  useEffect(() => {
    if (user) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate]);

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      // 🔐 Firebase login (single source of truth)
      await signInWithEmailAndPassword(auth, email, password);

      // ❌ DO NOT navigate here
      // AuthContext will update user and trigger redirect
    } catch (error) {
      console.error(error);
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ENTER KEY SUPPORT ================= */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-[400px]">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border p-3 rounded w-full mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border p-3 rounded w-full mb-4"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-black text-white w-full p-3 rounded hover:bg-gray-800 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>
    </div>
  );
}