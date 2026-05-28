import { useState } from "react";

import { useNavigate } from "react-router-dom";

export default function AdminLogin() {

  const navigate =
    useNavigate();

  const [password,
    setPassword] =
    useState("");

  const handleLogin = () => {

    if (
      password === "admin123"
    ) {

      localStorage.setItem(
        "admin",
        "true"
      );

      navigate(
        "/admin/dashboard"
      );

    } else {

      alert(
        "Wrong Password"
      );
    }
  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white p-8 rounded shadow w-[400px]">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Admin Login
        </h1>

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="border p-3 rounded w-full mb-4"
        />

        <button
          onClick={handleLogin}
          className="bg-black text-white w-full p-3 rounded"
        >
          Login
        </button>

      </div>

    </div>
  );
}