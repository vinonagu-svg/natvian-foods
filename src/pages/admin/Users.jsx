import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

import {
  useEffect,
  useState,
} from "react";

import { db } from "../../firebase";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const fetchUsers = async () => {
    try {
      const snapshot =
        await getDocs(
          collection(db, "users")
        );

      const data =
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // ACTIVATE / DEACTIVATE
  // =========================
  const toggleStatus = async (
    userId,
    currentStatus
  ) => {
    try {
      await updateDoc(
        doc(db, "users", userId),
        {
          status:
            currentStatus === "active"
              ? "inactive"
              : "active",
        }
      );

      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  // =========================
  // ROLE CHANGE
  // =========================
  const changeRole = async (
    userId,
    role
  ) => {
    try {
      await updateDoc(
        doc(db, "users", userId),
        {
          role,
        }
      );

      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Role update failed");
    }
  };

  const filteredUsers =
    users.filter((user) =>
      (
        user.name || ""
      )
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      (
        user.email || ""
      )
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div className="p-8">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold">
            Users Management
          </h1>

          <input
            type="text"
            placeholder="Search User..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="border p-2 rounded"
          />

        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (

          <div className="bg-white rounded shadow overflow-hidden">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="p-3 text-left">
                    Name
                  </th>

                  <th className="p-3 text-left">
                    Email
                  </th>

                  <th className="p-3 text-left">
                    Role
                  </th>

                  <th className="p-3 text-left">
                    Status
                  </th>

                  <th className="p-3 text-left">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.map(
                  (user) => (

                    <tr
                      key={user.id}
                      className="border-t"
                    >

                      <td className="p-3">
                        {user.name}
                      </td>

                      <td className="p-3">
                        {user.email}
                      </td>

                      <td className="p-3">

                        <select
                          value={
                            user.role
                          }
                          onChange={(e) =>
                            changeRole(
                              user.id,
                              e.target
                                .value
                            )
                          }
                          className="border p-1 rounded"
                        >
                          <option value="owner">
                            Owner
                          </option>

                          <option value="manager">
                            Manager
                          </option>

                          <option value="staff">
                            Staff
                          </option>

                        </select>

                      </td>

                      <td className="p-3">

                        <span
                          className={
                            user.status ===
                            "active"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {user.status}
                        </span>

                      </td>

                      <td className="p-3">

                        <button
                          onClick={() =>
                            toggleStatus(
                              user.id,
                              user.status
                            )
                          }
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          {user.status ===
                          "active"
                            ? "Deactivate"
                            : "Activate"}
                        </button>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}
      </div>
  );
}