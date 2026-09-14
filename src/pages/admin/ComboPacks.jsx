import { useEffect, useMemo, useState } from "react";

import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase";

export default function ComboPacks() {
  // =========================================
  // DATA
  // =========================================
  const [products, setProducts] = useState([]);
  const [combopacks, setCombos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // =========================================
  // FORM
  // =========================================
  const [editingId, setEditingId] = useState(null);

  const [comboName, setComboName] = useState("");
  const [tamilName, setTamilName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const [comboPrice, setComboPrice] = useState("");

  const [items, setItems] = useState([
    {
      productId: "",
      weight: "",
      quantity: 1,
    },
  ]);

  const [saving, setSaving] = useState(false);

  // =========================================
  // FETCH CATEGORIES
  // =========================================
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "categories"),
      (snapshot) => {
        const data = snapshot.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }))
          .filter(
            (category) => category.isActive !== false
          )
          .sort(
            (a, b) =>
              (a.order || 0) - (b.order || 0)
          );

        setCategories(data);
      },
      (error) => {
        console.error("Categories fetch error:", error);
      }
    );

    return () => unsub();
  }, []);

  // =========================================
  // FETCH SUBCATEGORIES
  // =========================================
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "subcategories"),
      (snapshot) => {
        const data = snapshot.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }))
          .filter(
            (subcategory) =>
              subcategory.isActive !== false
          );

        setSubcategories(data);
      },
      (error) => {
        console.error(
          "Subcategories fetch error:",
          error
        );
      }
    );

    return () => unsub();
  }, []);

  // =========================================
  // FILTER SUBCATEGORIES
  // =========================================
  const filteredSubcategories =
    subcategories.filter(
      (subcategory) =>
        subcategory.category === selectedCategory
    );

  // =========================================
  // FETCH PRODUCTS
  // =========================================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(
          collection(db, "products")
        );

        const data = snap.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }))
          .filter(
            (product) =>
              product.isActive !== false
          );

        setProducts(data);
      } catch (error) {
        console.error(
          "Products fetch error:",
          error
        );
      }
    };

    fetchProducts();
  }, []);

  // =========================================
  // FETCH COMBO PACKS
  // =========================================
  const fetchCombos = async () => {
    try {
      const snap = await getDocs(
        collection(db, "combopacks")
      );

      const data = snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setCombos(data);
    } catch (error) {
      console.error(
        "Combos fetch error:",
        error
      );
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  // =========================================
  // GET PRODUCT
  // =========================================
  const getProduct = (productId) => {
    return products.find(
      (product) =>
        product.id === productId
    );
  };

  // =========================================
  // GET VARIANTS
  // =========================================
  const getVariants = (productId) => {
    const product =
      getProduct(productId);

    if (!product) return [];

    if (
      Array.isArray(product.variants) &&
      product.variants.length > 0
    ) {
      return product.variants;
    }

    return [
      {
        weight: "Default",
        price:
          Number(product.price) || 0,
        stock:
          Number(product.stock) || 0,
      },
    ];
  };

  // =========================================
  // UPDATE ITEM
  // =========================================
  const updateItem = (
    index,
    field,
    value
  ) => {
    setItems((previous) => {
      const updated = [...previous];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      if (field === "productId") {
        updated[index].weight = "";
      }

      return updated;
    });
  };

  // =========================================
  // ADD ITEM
  // =========================================
  const addItem = () => {
    setItems((previous) => [
      ...previous,
      {
        productId: "",
        weight: "",
        quantity: 1,
      },
    ]);
  };

  // =========================================
  // REMOVE ITEM
  // =========================================
  const removeItem = (index) => {
    if (items.length === 1) {
      return;
    }

    setItems((previous) =>
      previous.filter(
        (_, i) => i !== index
      )
    );
  };

  // =========================================
  // REGULAR PRICE
  // =========================================
  const regularPrice = useMemo(() => {
    return items.reduce(
      (total, item) => {
        const product =
          getProduct(item.productId);

        if (!product) return total;

        const variant =
          getVariants(
            item.productId
          ).find(
            (v) =>
              v.weight === item.weight
          );

        if (!variant) return total;

        return (
          total +
          Number(
            variant.price || 0
          ) *
            Number(
              item.quantity || 1
            )
        );
      },
      0
    );
  }, [items, products]);

  // =========================================
  // SAVINGS
  // =========================================
  const savings = Math.max(
    regularPrice -
      Number(comboPrice || 0),
    0
  );

  const discountPercent =
    regularPrice > 0
      ? (
          (savings /
            regularPrice) *
          100
        ).toFixed(2)
      : "0.00";

  // =========================================
  // RESET FORM
  // =========================================
  const resetForm = () => {
    setEditingId(null);
    setComboName("");
    setTamilName("");
    setDescription("");
    setImage("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setComboPrice("");

    setItems([
      {
        productId: "",
        weight: "",
        quantity: 1,
      },
    ]);
  };

  // =========================================
  // EDIT COMBO
  // =========================================
  const startEdit = (combo) => {
    setEditingId(combo.id);

    setComboName(
      combo.name || ""
    );

    setTamilName(
      combo.tamilName || ""
    );

    setDescription(
      combo.description || ""
    );

    setImage(
      combo.image || ""
    );

    setSelectedCategory(
      combo.category || ""
    );

    setSelectedSubcategory(
      combo.subcategory || ""
    );

    setComboPrice(
      combo.comboPrice || ""
    );

    setItems(
      Array.isArray(combo.items) &&
        combo.items.length > 0
        ? combo.items.map((item) => ({
            productId:
              item.productId || "",

            weight:
              item.weight || "",

            quantity:
              Number(
                item.quantity || 1
              ),
          }))
        : [
            {
              productId: "",
              weight: "",
              quantity: 1,
            },
          ]
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================
  // SAVE / UPDATE COMBO
  // =========================================
  const saveCombo = async () => {
    if (!comboName.trim()) {
      alert(
        "Please enter combo name"
      );
      return;
    }

    if (!selectedCategory) {
      alert(
        "Please select category"
      );
      return;
    }

    if (!selectedSubcategory) {
      alert(
        "Please select subcategory"
      );
      return;
    }

    if (items.length === 0) {
      alert(
        "Please add at least one product"
      );
      return;
    }

    for (const item of items) {
      if (
        !item.productId ||
        !item.weight
      ) {
        alert(
          "Please select product and variant for every item"
        );
        return;
      }

      if (
        Number(item.quantity) < 1
      ) {
        alert(
          "Quantity must be at least 1"
        );
        return;
      }
    }

    if (
      !comboPrice ||
      Number(comboPrice) <= 0
    ) {
      alert(
        "Please enter combo selling price"
      );
      return;
    }

    if (
      Number(comboPrice) >
      regularPrice
    ) {
      const confirmSave =
        window.confirm(
          "Combo price is higher than individual product value. Continue?"
        );

      if (!confirmSave) return;
    }

    try {
      setSaving(true);

      // =========================================
      // PREPARE COMBO ITEMS
      // =========================================
      const comboItems =
        items.map((item) => {
          const product =
            getProduct(
              item.productId
            );

          const variant =
            getVariants(
              item.productId
            ).find(
              (v) =>
                v.weight ===
                item.weight
            );

          return {
            productId:
              item.productId,

            productName:
              product?.name || "",

            tamilName:
              product?.tamilName || "",

            weight:
              item.weight,

            quantity:
              Number(
                item.quantity || 1
              ),

            unitPrice:
              Number(
                variant?.price || 0
              ),

            image:
              product?.images?.[0] ||
              "",
          };
        });

      // =========================================
      // COMBO DATA
      // =========================================
      const comboData = {
        name:
          comboName.trim(),

        tamilName:
          tamilName.trim(),

        category:
          selectedCategory,

        subcategory:
          selectedSubcategory,

        description:
          description.trim(),

        image:
          image.trim(),

        items: comboItems,

        regularPrice:
          Number(regularPrice),

        comboPrice:
          Number(comboPrice),

        savings:
          Number(savings),

        discountPercent:
          Number(discountPercent),

        isActive: true,
      };

      // =========================================
      // UPDATE EXISTING COMBO
      // =========================================
      if (editingId) {
        await updateDoc(
          doc(
            db,
            "combopacks",
            editingId
          ),
          comboData
        );

        alert(
          "Combo Pack updated successfully ✅"
        );
      }

      // =========================================
      // CREATE NEW COMBO
      // =========================================
      else {
        const docRef = await addDoc(
          collection(
            db,
            "combopacks"
          ),
          {
            ...comboData,
            createdAt:
              serverTimestamp(),
          }
        );

        // DEBUG INFORMATION
        console.log(
          "COMBO CREATED:",
          docRef.id
        );

        console.log(
          "COMBO PATH:",
          docRef.path
        );

        console.log(
          "FIREBASE PROJECT:",
          db.app.options.projectId
        );

        alert(
          `Combo Pack created successfully ✅\n\nDocument ID: ${docRef.id}\nPath: ${docRef.path}\nProject: ${db.app.options.projectId}`
        );
      }

      resetForm();

      await fetchCombos();
    } catch (error) {
      console.error(
        "Save combo error:",
        error
      );

      alert(
        `Failed to save combo:\n${error.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // TOGGLE ACTIVE
  // =========================================
  const toggleComboStatus =
    async (combo) => {
      try {
        await updateDoc(
          doc(
            db,
            "combopacks",
            combo.id
          ),
          {
            isActive:
              combo.isActive === false,
          }
        );

        await fetchCombos();
      } catch (error) {
        console.error(
          "Toggle combo error:",
          error
        );

        alert(
          `Failed to update status:\n${error.message}`
        );
      }
    };

  // =========================================
  // DELETE COMBO
  // =========================================
  const deleteCombo = async (
    comboId
  ) => {
    const confirmed =
      window.confirm(
        "Delete this Combo Pack?"
      );

    if (!confirmed) return;

    try {
      await deleteDoc(
        doc(
          db,
          "combopacks",
          comboId
        )
      );

      alert(
        "Combo deleted successfully"
      );

      await fetchCombos();
    } catch (error) {
      console.error(
        "Delete combo error:",
        error
      );

      alert(
        `Delete failed:\n${error.message}`
      );
    }
  };

  // =========================================
  // UI
  // =========================================
  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-[#31572C]">
            Combo Packs
          </h1>

          <p className="text-gray-500 mt-1">
            Create and manage product combo offers
          </p>
        </div>

        <div className="bg-green-50 text-green-800 px-4 py-2 rounded-xl font-semibold">
          {combopacks.length} Combo
          {combopacks.length !== 1
            ? "s"
            : ""}
        </div>

      </div>

      {/* CREATE / EDIT FORM */}
      <div className="bg-white rounded-3xl shadow-md border p-6 mb-10">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            {editingId
              ? "Edit Combo Pack"
              : "Create Combo Pack"}
          </h2>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl"
            >
              Cancel Edit
            </button>
          )}

        </div>

        {/* BASIC DETAILS */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* NAME */}
          <div>
            <label className="block font-semibold mb-2">
              Combo Name *
            </label>

            <input
              value={comboName}
              onChange={(e) =>
                setComboName(
                  e.target.value
                )
              }
              placeholder="Family Wellness Combo"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          {/* TAMIL NAME */}
          <div>
            <label className="block font-semibold mb-2">
              Tamil Name
            </label>

            <input
              value={tamilName}
              onChange={(e) =>
                setTamilName(
                  e.target.value
                )
              }
              placeholder="குடும்ப நலன் தொகுப்பு"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block font-semibold mb-2">
              Category *
            </label>

            <select
              value={
                selectedCategory
              }
              onChange={(e) => {
                setSelectedCategory(
                  e.target.value
                );

                setSelectedSubcategory(
                  ""
                );
              }}
              className="w-full border rounded-xl px-4 py-3 bg-white"
            >
              <option value="">
                Select Category
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category.id}
                    value={
                      category.name
                    }
                  >
                    {category.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* SUBCATEGORY */}
          <div>
            <label className="block font-semibold mb-2">
              Subcategory *
            </label>

            <select
              value={
                selectedSubcategory
              }
              onChange={(e) =>
                setSelectedSubcategory(
                  e.target.value
                )
              }
              disabled={
                !selectedCategory
              }
              className="w-full border rounded-xl px-4 py-3 bg-white disabled:bg-gray-100"
            >
              <option value="">
                {selectedCategory
                  ? "Select Subcategory"
                  : "Select Category First"}
              </option>

              {filteredSubcategories.map(
                (subcategory) => (
                  <option
                    key={
                      subcategory.id
                    }
                    value={
                      subcategory.name
                    }
                  >
                    {
                      subcategory.name
                    }
                  </option>
                )
              )}
            </select>
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">

            <label className="block font-semibold mb-2">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows={3}
              placeholder="Short description of this combo..."
              className="w-full border rounded-xl px-4 py-3"
            />

          </div>

          {/* IMAGE */}
          <div className="md:col-span-2">

            <label className="block font-semibold mb-2">
              Combo Image URL
            </label>

            <input
              value={image}
              onChange={(e) =>
                setImage(
                  e.target.value
                )
              }
              placeholder="https://..."
              className="w-full border rounded-xl px-4 py-3"
            />

          </div>

        </div>

        {/* PRODUCTS */}
        <div className="mt-8">

          <div className="flex items-center justify-between mb-4">

            <h3 className="text-xl font-bold">
              Products in Combo
            </h3>

            <button
              type="button"
              onClick={addItem}
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
            >
              + Add Product
            </button>

          </div>

          <div className="space-y-4">

            {items.map(
              (item, index) => {

                const variants =
                  getVariants(
                    item.productId
                  );

                return (
                  <div
                    key={index}
                    className="border rounded-2xl p-4 bg-gray-50"
                  >

                    <div className="grid md:grid-cols-12 gap-3 items-end">

                      {/* PRODUCT */}
                      <div className="md:col-span-5">

                        <label className="block text-sm font-semibold mb-2">
                          Product
                        </label>

                        <select
                          value={
                            item.productId
                          }
                          onChange={(e) =>
                            updateItem(
                              index,
                              "productId",
                              e.target.value
                            )
                          }
                          className="w-full border rounded-xl px-3 py-3 bg-white"
                        >

                          <option value="">
                            Select Product
                          </option>

                          {products.map(
                            (product) => (
                              <option
                                key={
                                  product.id
                                }
                                value={
                                  product.id
                                }
                              >
                                {
                                  product.name
                                }
                              </option>
                            )
                          )}

                        </select>

                      </div>

                      {/* VARIANT */}
                      <div className="md:col-span-3">

                        <label className="block text-sm font-semibold mb-2">
                          Variant
                        </label>

                        <select
                          value={
                            item.weight
                          }
                          onChange={(e) =>
                            updateItem(
                              index,
                              "weight",
                              e.target.value
                            )
                          }
                          disabled={
                            !item.productId
                          }
                          className="w-full border rounded-xl px-3 py-3 bg-white disabled:bg-gray-100"
                        >

                          <option value="">
                            Select Variant
                          </option>

                          {variants.map(
                            (
                              variant,
                              variantIndex
                            ) => (
                              <option
                                key={
                                  variantIndex
                                }
                                value={
                                  variant.weight
                                }
                              >
                                {
                                  variant.weight
                                }{" "}
                                — ₹
                                {
                                  variant.price
                                }
                              </option>
                            )
                          )}

                        </select>

                      </div>

                      {/* QUANTITY */}
                      <div className="md:col-span-2">

                        <label className="block text-sm font-semibold mb-2">
                          Quantity
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={
                            item.quantity
                          }
                          onChange={(e) =>
                            updateItem(
                              index,
                              "quantity",
                              Number(
                                e.target.value
                              )
                            )
                          }
                          className="w-full border rounded-xl px-3 py-3 bg-white"
                        />

                      </div>

                      {/* REMOVE */}
                      <div className="md:col-span-2">

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(
                              index
                            )
                          }
                          className="w-full bg-red-50 text-red-600 border border-red-200 px-3 py-3 rounded-xl hover:bg-red-100"
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        </div>

        {/* PRICE */}
        <div className="mt-8 grid md:grid-cols-3 gap-5">

          <div className="bg-gray-50 rounded-2xl p-5">

            <p className="text-sm text-gray-500">
              Individual Product Value
            </p>

            <p className="text-2xl font-bold mt-1">
              ₹
              {regularPrice.toFixed(
                2
              )}
            </p>

          </div>

          <div className="bg-green-50 rounded-2xl p-5">

            <p className="text-sm text-gray-500">
              Combo Selling Price
            </p>

            <input
              type="number"
              min="0"
              value={comboPrice}
              onChange={(e) =>
                setComboPrice(
                  e.target.value
                )
              }
              placeholder="350"
              className="w-full mt-2 border rounded-xl px-3 py-2 text-xl font-bold"
            />

          </div>

          <div className="bg-orange-50 rounded-2xl p-5">

            <p className="text-sm text-gray-500">
              Customer Savings
            </p>

            <p className="text-2xl font-bold text-orange-600 mt-1">
              ₹
              {savings.toFixed(
                2
              )}
            </p>

            <p className="text-sm mt-1">
              {discountPercent}% off
            </p>

          </div>

        </div>

        {/* SAVE BUTTON */}
        <div className="mt-8 flex justify-end gap-3">

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-8 py-4 rounded-2xl font-bold"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={saveCombo}
            disabled={saving}
            className="bg-[#31572C] hover:bg-[#264653] disabled:bg-gray-400 text-white px-8 py-4 rounded-2xl font-bold"
          >
            {saving
              ? "Saving..."
              : editingId
              ? "Update Combo Pack"
              : "Save Combo Pack"}
          </button>

        </div>

      </div>

      {/* EXISTING COMBOS */}
      <div>

        <h2 className="text-2xl font-bold mb-5">
          Existing Combo Packs
        </h2>

        {combopacks.length === 0 ? (
          <div className="bg-white border rounded-2xl p-8 text-center text-gray-500">
            No Combo Packs created yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            {combopacks.map(
              (combo) => (
                <div
                  key={combo.id}
                  className="bg-white rounded-3xl shadow border overflow-hidden"
                >

                  {combo.image ? (
                    <img
                      src={combo.image}
                      alt={combo.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-green-50 flex items-center justify-center text-5xl">
                      📦
                    </div>
                  )}

                  <div className="p-5">

                    {/* BADGE */}
                    <div className="flex justify-between items-center mb-2">

                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                        🎁 COMBO PACK
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          toggleComboStatus(
                            combo
                          )
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          combo.isActive ===
                          false
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {combo.isActive ===
                        false
                          ? "🔴 Inactive"
                          : "🟢 Active"}
                      </button>

                    </div>

                    {/* NAME */}
                    <h3 className="text-xl font-bold">
                      {combo.name}
                    </h3>

                    {combo.tamilName && (
                      <p className="text-green-700 font-medium mt-1">
                        {
                          combo.tamilName
                        }
                      </p>
                    )}

                    {/* CATEGORY */}
                    <div className="mt-3 text-sm">

                      <p>
                        <span className="font-semibold">
                          Category:
                        </span>{" "}
                        {combo.category ||
                          "N/A"}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Subcategory:
                        </span>{" "}
                        {combo.subcategory ||
                          "N/A"}
                      </p>

                    </div>

                    {/* DESCRIPTION */}
                    {combo.description && (
                      <p className="text-sm text-gray-600 mt-3">
                        {
                          combo.description
                        }
                      </p>
                    )}

                    {/* ITEMS */}
                    <div className="mt-4 space-y-2">

                      {combo.items?.map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            key={
                              index
                            }
                            className="text-sm text-gray-600"
                          >
                            •{" "}
                            {
                              item.productName
                            }{" "}
                            —{" "}
                            {
                              item.weight
                            }{" "}
                            ×{" "}
                            {
                              item.quantity
                            }
                          </div>
                        )
                      )}

                    </div>

                    {/* PRICE */}
                    <div className="mt-5 border-t pt-4">

                      <div className="flex justify-between text-sm text-gray-500">

                        <span>
                          Regular
                        </span>

                        <span>
                          ₹
                          {Number(
                            combo.regularPrice ||
                              0
                          ).toFixed(
                            2
                          )}
                        </span>

                      </div>

                      <div className="flex justify-between items-center mt-1">

                        <span className="font-semibold">
                          Combo Price
                        </span>

                        <span className="text-2xl font-bold text-green-700">
                          ₹
                          {Number(
                            combo.comboPrice ||
                              0
                          ).toFixed(
                            2
                          )}
                        </span>

                      </div>

                      <p className="text-orange-600 text-sm mt-1">
                        Save ₹
                        {Number(
                          combo.savings ||
                            0
                        ).toFixed(
                          2
                        )}
                      </p>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3 mt-5">

                      <button
                        type="button"
                        onClick={() =>
                          startEdit(
                            combo
                          )
                        }
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteCombo(
                            combo.id
                          )
                        }
                        className="flex-1 bg-red-50 text-red-600 border border-red-200 py-3 rounded-xl font-semibold hover:bg-red-100"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                </div>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
}