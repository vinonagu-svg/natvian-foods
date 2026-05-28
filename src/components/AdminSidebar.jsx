import { Link, useNavigate } from "react-router-dom";

export default function AdminSidebar() {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("admin");

    navigate("/admin");
  };

  return (

    <div className="w-64 h-screen bg-black text-white fixed p-6">

      <h1 className="text-3xl font-bold mb-10">
        Natvian Admin
      </h1>

      <div className="flex flex-col gap-5">

        <Link to="/admin/dashboard">
          Dashboard
        </Link>

        <Link to="/admin/products">
          Products
        </Link>

        <Link to="/admin/orders">
          Orders
        </Link>

        <Link to="/admin/analytics">
          Analytics
        </Link>

        <Link to="/admin/coupons">
          Coupons
        </Link>

        <Link to="/admin/settings">
          Settings
        </Link>

        <button
          onClick={logout}
          className="bg-red-500 p-2 rounded mt-6"
        >
          Logout
        </button>

      </div>

    </div>
  );
}