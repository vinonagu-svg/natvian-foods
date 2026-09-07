import { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { X } from "lucide-react";

const categories = [
  "Raw Materials",
  "Packaging",
  "Transportation",
  "Salary",
  "Electricity",
  "Water",
  "Rent",
  "Marketing",
  "Maintenance",
  "Equipment",
  "Certification",
  "Office Expense",
  "Miscellaneous",
];

const paymentMethods = [
  "Cash",
  "UPI",
  "Bank Transfer",
  "Cheque",
  "Credit Card",
];

export default function AddExpenseModal({
  open,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    supplier: "",
    paymentMethod: "Cash",
    invoiceNumber: "",
    notes: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.category ||
      !form.amount ||
      !form.date
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "expenses"), {
        title: form.title,
        category: form.category,
        amount: Number(form.amount),
        date: form.date,
        supplier: form.supplier,
        paymentMethod: form.paymentMethod,
        invoiceNumber: form.invoiceNumber,
        notes: form.notes,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      alert("Expense added successfully.");

      setForm({
        title: "",
        category: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        supplier: "",
        paymentMethod: "Cash",
        invoiceNumber: "",
        notes: "",
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save expense.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">

        {/* Header */}

        <div className="flex justify-between items-center border-b p-5">

          <h2 className="text-2xl font-bold">
            Add Expense
          </h2>

          <button onClick={onClose}>
            <X size={22} />
          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          <div className="grid md:grid-cols-2 gap-4">

            <div>

              <label className="font-medium">
                Expense Title *
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full mt-1"
                placeholder="Ragi Purchase"
              />

            </div>

            <div>

              <label className="font-medium">
                Category *
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full mt-1"
              >

                <option value="">
                  Select Category
                </option>

                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>

            </div>

            <div>

              <label className="font-medium">
                Amount *
              </label>

              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full mt-1"
              />

            </div>

            <div>

              <label className="font-medium">
                Expense Date *
              </label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full mt-1"
              />

            </div>

            <div>

              <label className="font-medium">
                Supplier
              </label>

              <input
                type="text"
                name="supplier"
                value={form.supplier}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full mt-1"
              />

            </div>

            <div>

              <label className="font-medium">
                Payment Method
              </label>

              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full mt-1"
              >

                {paymentMethods.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>

            </div>

            <div>

              <label className="font-medium">
                Invoice Number
              </label>

              <input
                type="text"
                name="invoiceNumber"
                value={form.invoiceNumber}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full mt-1"
              />

            </div>

          </div>

          <div>

            <label className="font-medium">
              Notes
            </label>

            <textarea
              rows="4"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full mt-1"
            />

          </div>

          <div className="flex justify-end gap-3 pt-3">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
            >
              {loading ? "Saving..." : "Save Expense"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}