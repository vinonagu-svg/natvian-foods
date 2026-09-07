import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Trash2, PlusCircle } from "lucide-react";
import AddExpenseModal from "../../components/admin/AddExpenseModal";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
const [openModal, setOpenModal] = useState(false);
  const loadExpenses = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "expenses"),
        orderBy("date", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setExpenses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const deleteExpense = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!ok) return;

    try {
      await deleteDoc(doc(db, "expenses", id));
      loadExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  return (
    <div className="p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Expense Management
          </h1>

          <p className="text-gray-500 mt-1">
            Track all business expenses.
          </p>
        </div>

<button
  onClick={() => setOpenModal(true)}
  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
>
  <PlusCircle size={18} />
  Add Expense
</button>

      </div>

      {/* Summary Card */}

      <div className="bg-white rounded-xl shadow p-6 mb-6">

        <h2 className="text-gray-500 text-sm">
          Total Expenses
        </h2>

        <h1 className="text-4xl font-bold text-red-600 mt-2">
          ₹ {totalExpense.toLocaleString()}
        </h1>

      </div>

      {/* Expense Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        {loading ? (

          <div className="p-10 text-center">
            Loading...
          </div>

        ) : expenses.length === 0 ? (

          <div className="p-10 text-center text-gray-500">
            No expenses found.
          </div>

        ) : (

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-3 text-left">
                  Date
                </th>

                <th className="p-3 text-left">
                  Title
                </th>

                <th className="p-3 text-left">
                  Category
                </th>

                <th className="p-3 text-left">
                  Supplier
                </th>

                <th className="p-3 text-right">
                  Amount
                </th>

                <th className="p-3 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {expenses.map((expense) => (

                <tr
                  key={expense.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-3">
                    {expense.date}
                  </td>

                  <td className="p-3">
                    {expense.title}
                  </td>

                  <td className="p-3">
                    {expense.category}
                  </td>

                  <td className="p-3">
                    {expense.supplier || "-"}
                  </td>

                  <td className="p-3 text-right font-semibold">
                    ₹ {Number(expense.amount).toLocaleString()}
                  </td>

                  <td className="p-3 text-center">

                    <button
                      onClick={() =>
                        deleteExpense(expense.id)
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>
<AddExpenseModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  onSuccess={loadExpenses}
/>
    </div>
  );
}