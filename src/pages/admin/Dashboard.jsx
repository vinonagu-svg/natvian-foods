import AdminSidebar from "../../components/AdminSidebar";

export default function Dashboard() {

  return (

    <div className="flex">

      <AdminSidebar />

      <div className="ml-64 p-8 w-full min-h-screen bg-gray-100">

        <h1 className="text-4xl font-bold mb-8">
          Dashboard
        </h1>

        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded shadow">

            <h2 className="text-xl font-semibold">
              Products
            </h2>

            <p className="text-3xl mt-4">
              0
            </p>

          </div>

          <div className="bg-white p-6 rounded shadow">

            <h2 className="text-xl font-semibold">
              Orders
            </h2>

            <p className="text-3xl mt-4">
              0
            </p>

          </div>

          <div className="bg-white p-6 rounded shadow">

            <h2 className="text-xl font-semibold">
              Revenue
            </h2>

            <p className="text-3xl mt-4">
              ₹0
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}