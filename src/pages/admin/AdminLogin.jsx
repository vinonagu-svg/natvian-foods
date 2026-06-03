import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../../firebase";

export default function AdminLogin() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async () => {

    try {

      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate(
        "/admin/dashboard"
      );

    } catch (error) {

      alert(
        "Invalid email or password"
      );

      console.error(error);

    } finally {

      setLoading(false);

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
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="border p-3 rounded w-full mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="border p-3 rounded w-full mb-4"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-black text-white w-full p-3 rounded"
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

      </div>

    </div>
  );
}