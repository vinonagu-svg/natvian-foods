import AdminSidebar from "../../components/AdminSidebar";

import ProductList from "../../components/ProductList";

export default function Products() {

  return (

    <div className="flex">

      <AdminSidebar />

      <div className="ml-64 p-8 w-full min-h-screen bg-gray-100">

        <h1 className="text-4xl font-bold mb-6">
          Products
        </h1>

        <ProductList />

      </div>

    </div>
  );
}