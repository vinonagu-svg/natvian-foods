import { useState } from "react";

export default function AdminLogin({
  setIsAdmin
}) {

  const [password, setPassword] =
    useState("");

  const handleLogin = () => {

    // CHANGE PASSWORD HERE
    if (password === "natvian123") {

      localStorage.setItem(
        "isAdmin",
        "true"
      );

      setIsAdmin(true);

    } else {

      alert(
        "Wrong Password"
      );
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-green-50">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">

        <h1 className="text-4xl font-bold mb-3 text-center">

          Admin Login

        </h1>

        <p className="text-gray-500 text-center mb-8">

          Natvian Foods Dashboard

        </p>

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full border p-4 rounded-2xl mb-6"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-4 rounded-2xl font-bold"
        >

          Login

        </button>

      </div>

    </div>
  );
}