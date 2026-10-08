import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";

import {
  getApp,
  initializeApp,
} from "firebase/app";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { db } from "../../firebase";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // =========================
  // ADD USER FORM
  // =========================

  const [showAddUser, setShowAddUser] =
    useState(false);

  const [addingUser, setAddingUser] =
    useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  // =========================
  // FETCH USERS
  // =========================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(
        collection(db, "users")
      );

      const data = snapshot.docs.map(
        (userDoc) => ({
          id: userDoc.id,
          ...userDoc.data(),
        })
      );

      setUsers(data);
    } catch (error) {
      console.error(
        "Error fetching users:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // HANDLE FORM CHANGE
  // =========================

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;

    setNewUser((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================
  // ADD NEW USER
  // =========================

  const handleAddUser = async (e) => {
    e.preventDefault();

    const name = newUser.name.trim();
    const email = newUser.email.trim();
    const password = newUser.password;
    const role = newUser.role;

    if (!name || !email || !password) {
      alert(
        "Please enter name, email and password."
      );
      return;
    }

    if (password.length < 6) {
      alert(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      role !== "manager" &&
      role !== "staff"
    ) {
      alert(
        "Only Manager or Staff users can be created here."
      );
      return;
    }

    try {
      setAddingUser(true);

      // =========================================
      // CREATE A SECONDARY FIREBASE APP
      // =========================================
      //
      // This prevents the current Owner/Superadmin
      // from being logged out.
      //

      const primaryApp = getApp();

      const secondaryApp = initializeApp(
        primaryApp.options,
        `userCreation-${Date.now()}`
      );

      const secondaryAuth =
        getAuth(secondaryApp);

      // =========================================
      // CREATE FIREBASE AUTH USER
      // =========================================

      const userCredential =
        await createUserWithEmailAndPassword(
          secondaryAuth,
          email,
          password
        );

      const createdUser =
        userCredential.user;

      // =========================================
      // CREATE FIRESTORE USER DOCUMENT
      // =========================================

  await setDoc(
  doc(db, "users", createdUser.uid),
  {
    uid: createdUser.uid,
    name: name,
    email: email,
    role: role,
    status: "active",
    isActive: true,
    permissions:
      role === "staff"
        ? ["orders:read"]
        : role === "manager"
        ? [
            "products:read",
            "orders:read",
            "categories:read",
            "subcategories:read",
            "coupons:read",
          ]
        : [],
  }
);

      // =========================================
      // SIGN OUT SECONDARY AUTH
      // =========================================

      await signOut(secondaryAuth);

      // =========================================
      // RESET FORM
      // =========================================

      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "staff",
      });

      setShowAddUser(false);

      await fetchUsers();

      alert(
        `User created successfully.\n\nName: ${name}\nRole: ${role}`
      );
    } catch (error) {
      console.error(
        "Error creating user:",
        error
      );

      if (
        error.code ===
        "auth/email-already-in-use"
      ) {
        alert(
          "This email address is already registered in Firebase Authentication."
        );
      } else if (
        error.code ===
        "auth/invalid-email"
      ) {
        alert(
          "Please enter a valid email address."
        );
      } else if (
        error.code ===
        "auth/weak-password"
      ) {
        alert(
          "Password is too weak. Use at least 6 characters."
        );
      } else {
        alert(
          "Could not create the user.\n\nCheck the browser console for details."
        );
      }
    } finally {
      setAddingUser(false);
    }
  };

  // =========================
  // ACTIVATE / DEACTIVATE
  // =========================

  const handleToggleStatus = async (
    user
  ) => {
    // Protect Owner
    if (user.role === "owner") {
      alert(
        "Owner account cannot be deactivated."
      );
      return;
    }

    // Protect Superadmin
    if (user.role === "superadmin") {
      alert(
        "Superadmin account cannot be deactivated."
      );
      return;
    }

    try {
      const newStatus =
        user.isActive === false;

      await updateDoc(
        doc(db, "users", user.id),
        {
          isActive: newStatus,
          status: newStatus
            ? "active"
            : "inactive",
        }
      );

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item.id === user.id
            ? {
                ...item,
                isActive: newStatus,
                status: newStatus
                  ? "active"
                  : "inactive",
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Error updating user status:",
        error
      );

      alert(
        "Failed to update user status."
      );
    }
  };

  // =========================
  // CHANGE ROLE
  // =========================

  const changeRole = async (
  userId,
  newRole
) => {
  const targetUser = users.find(
    (user) => user.id === userId
  );

  if (!targetUser) {
    return;
  }

  // Protect Owner
  if (targetUser.role === "owner") {
    alert(
      "Owner role cannot be changed."
    );
    return;
  }

  // Protect Superadmin
  if (targetUser.role === "superadmin") {
    alert(
      "Superadmin role cannot be changed."
    );
    return;
  }

  // Allow only Manager or Staff
  if (
    newRole !== "manager" &&
    newRole !== "staff"
  ) {
    alert(
      "Only Manager or Staff roles are allowed."
    );
    return;
  }

  const permissions =
    newRole === "staff"
      ? ["orders:read"]
      : [
          "products:read",
          "orders:read",
          "categories:read",
          "subcategories:read",
          "coupons:read",
        ];

  try {
    await updateDoc(
      doc(db, "users", userId),
      {
        role: newRole,
        permissions: permissions,
      }
    );

    // Update the Users page immediately
    setUsers((currentUsers) =>
      currentUsers.map((item) =>
        item.id === userId
          ? {
              ...item,
              role: newRole,
              permissions: permissions,
            }
          : item
      )
    );

    alert(
      `User role changed to ${newRole}.`
    );
  } catch (error) {
    console.error(
      "Error changing user role:",
      error
    );

    alert(
      "Failed to change user role."
    );
  }
};
  // =========================
  // SEARCH
  // =========================

  const filteredUsers = users.filter(
    (user) => {
      const searchText =
        search.toLowerCase();

      return (
        (user.name || "")
          .toLowerCase()
          .includes(searchText) ||
        (user.email || "")
          .toLowerCase()
          .includes(searchText) ||
        (user.role || "")
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

  // =========================
  // PAGE
  // =========================

  return (
    <div className="p-6">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl font-bold">
            Users
          </h1>

          <p className="text-gray-500 mt-1">
            Manage admin users and account status.
          </p>
        </div>

        <div className="flex gap-3">

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border rounded-lg px-4 py-2 w-full md:w-64"
          />

          <button
            onClick={() =>
              setShowAddUser(true)
            }
            className="bg-black text-white px-5 py-2 rounded-lg whitespace-nowrap"
          >
            + Add User
          </button>

        </div>
      </div>

      {/* ========================= */}
      {/* ADD USER FORM */}
      {/* ========================= */}

      {showAddUser && (
        <div className="bg-white border rounded-xl shadow-sm p-6 mb-6">

          <div className="flex items-center justify-between mb-5">

            <h2 className="text-xl font-semibold">
              Add New User
            </h2>

            <button
              type="button"
              onClick={() =>
                setShowAddUser(false)
              }
              className="text-gray-500 hover:text-black text-xl"
            >
              ×
            </button>

          </div>

          <form
            onSubmit={handleAddUser}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >

            {/* NAME */}

            <div>
              <label className="block text-sm font-medium mb-1">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={newUser.name}
                onChange={
                  handleNewUserChange
                }
                placeholder="Enter name"
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            {/* EMAIL */}

            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={
                  handleNewUserChange
                }
                placeholder="Enter email"
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            {/* PASSWORD */}

            <div>
              <label className="block text-sm font-medium mb-1">
                Temporary Password
              </label>

              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={
                  handleNewUserChange
                }
                placeholder="Minimum 6 characters"
                className="w-full border rounded-lg px-3 py-2"
                minLength={6}
                required
              />
            </div>

            {/* ROLE */}

            <div>
              <label className="block text-sm font-medium mb-1">
                Role
              </label>

              <select
                name="role"
                value={newUser.role}
                onChange={
                  handleNewUserChange
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="staff">
                  Staff
                </option>

                <option value="manager">
                  Manager
                </option>
              </select>
            </div>

            {/* BUTTONS */}

            <div className="md:col-span-2 flex gap-3 pt-2">

              <button
                type="submit"
                disabled={addingUser}
                className="bg-green-600 text-white px-5 py-2 rounded-lg disabled:opacity-50"
              >
                {addingUser
                  ? "Creating..."
                  : "Create User"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowAddUser(false)
                }
                disabled={addingUser}
                className="border px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      {/* ========================= */}
      {/* USERS TABLE */}
      {/* ========================= */}

      {loading ? (
        <div className="text-center py-10">
          Loading users...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No users found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">

          <table className="w-full">

            <thead>
              <tr className="border-b bg-gray-50">

                <th className="text-left px-4 py-3">
                  Name
                </th>

                <th className="text-left px-4 py-3">
                  Email
                </th>

                <th className="text-left px-4 py-3">
                  Role
                </th>

                <th className="text-left px-4 py-3">
  Permissions
</th>

                <th className="text-left px-4 py-3">
                  Status
                </th>

                <th className="text-left px-4 py-3">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredUsers.map(
                (user) => {

                  const isOwner =
                    user.role ===
                    "owner";

                  const isSuperadmin =
                    user.role ===
                    "superadmin";

                  const isProtected =
                    isOwner ||
                    isSuperadmin;

                  const isActive =
                    user.isActive !==
                      false &&
                    user.status !==
                      "inactive";

                  return (
                    <tr
                      key={user.id}
                      className="border-b"
                    >

                      {/* NAME */}

                      <td className="px-4 py-3">
                        {user.name || "—"}
                      </td>

                      {/* EMAIL */}

                      <td className="px-4 py-3">
                        {user.email || "—"}
                      </td>

                      {/* ROLE */}

                      <td className="px-4 py-3">

                        {isProtected ? (
                          <span className="capitalize font-medium">
                            {user.role}
                          </span>
                        ) : (
                          <select
                            value={
                              user.role ||
                              "staff"
                            }
                            onChange={(e) =>
                              changeRole(
                                user.id,
                                e.target.value
                              )
                            }
                            className="border rounded px-2 py-1"
                          >
                            <option value="staff">
                              Staff
                            </option>

                            <option value="manager">
                              Manager
                            </option>
                          </select>
                        )}

                      </td>
{/* PERMISSIONS */}

<td className="px-4 py-3">
  {user.permissions &&
  user.permissions.length > 0 ? (
    <div className="flex flex-wrap gap-1">
      {user.permissions.map(
        (permission) => (
          <span
            key={permission}
            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
          >
            {permission}
          </span>
        )
      )}
    </div>
  ) : (
    <span className="text-gray-400 text-sm">
      None
    </span>
  )}
</td>
                      {/* STATUS */}

                      <td className="px-4 py-3">

                        {isActive ? (
                          <span className="text-green-600 font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">
                            Inactive
                          </span>
                        )}

                      </td>

                      {/* ACTION */}

                      <td className="px-4 py-3">

                        {isProtected ? (
                          <span className="text-gray-500 text-sm">
                            Protected
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              handleToggleStatus(
                                user
                              )
                            }
                            className={`px-4 py-2 rounded-lg text-white ${
                              isActive
                                ? "bg-red-600"
                                : "bg-green-600"
                            }`}
                          >
                            {isActive
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        )}

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}