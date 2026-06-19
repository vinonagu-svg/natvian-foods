import { useEffect, useState } from "react";
import ProductList from "../../components/ProductList";

import {
  collection,
  onSnapshot,
  writeBatch,
  doc,
  getDocs,
} from "firebase/firestore";

import { db } from "../../firebase";

import * as XLSX from "xlsx";

export default function Products() {
  const [categories, setCategories] =
    useState([]);

  const [subcategories, setSubcategories] =
    useState([]);

  const [importing, setImporting] =
    useState(false);
const [selectedCategory, setSelectedCategory] =
  useState("");

const [selectedSubcategory, setSelectedSubcategory] =
  useState("");
  // ==========================
  // FETCH CATEGORIES
  // ==========================
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "categories"),
      (snap) => {
        setCategories(
          snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      }
    );

    return () => unsub();
  }, []);

  // ==========================
  // FETCH SUBCATEGORIES
  // ==========================
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "subcategories"),
      (snap) => {
        setSubcategories(
          snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      }
    );

    return () => unsub();
  }, []);
const filteredSubcategories =
  selectedCategory
    ? subcategories.filter(
        (sub) =>
          sub.category ===
          selectedCategory
      )
    : subcategories;
  // ==========================
  // DOWNLOAD EXCEL TEMPLATE
  // ==========================
  const downloadTemplate = () => {
  const templateData = [
    {
      Name: "",
      TamilName: "",
      Category: "",
      Subcategory: "",
      Description: "",
      Ingredients: "",
      Usage: "",
      ShelfLife: "",
      Storage: "",
      Benefits: "",

      ImageURLs: "",

      Variant1Weight: "100g",
      Variant1Price: "",
      Variant1Stock: "",

      Variant2Weight: "250g",
      Variant2Price: "",
      Variant2Stock: "",

      Variant3Weight: "500g",
      Variant3Price: "",
      Variant3Stock: "",

      Variant4Weight: "1kg",
      Variant4Price: "",
      Variant4Stock: "",
    },
  ];

  const workbook = XLSX.utils.book_new();

  const worksheet =
    XLSX.utils.json_to_sheet(templateData);

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Products"
  );

  XLSX.writeFile(
    workbook,
    "Natvian_Product_Template.xlsx"
  );
};
  // ==========================
  // IMPORT PRODUCTS
  // ==========================
  const importProducts = async (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    try {
      setImporting(true);

      const buffer =
        await file.arrayBuffer();

      const workbook =
        XLSX.read(buffer, {
          type: "array",
        });

      const worksheet =
        workbook.Sheets[
          workbook.SheetNames[0]
        ];

      const rows =
        XLSX.utils.sheet_to_json(
          worksheet
        );

      if (!rows.length) {
        alert(
          "Excel file is empty"
        );
        return;
      }

      // ======================
      // EXISTING PRODUCTS
      // ======================
      const existingSnap =
        await getDocs(
          collection(
            db,
            "products"
          )
        );

      const existingProducts =
        new Set(
          existingSnap.docs.map(
            (doc) =>
              String(
                doc.data().name || ""
              )
                .trim()
                .toLowerCase()
          )
        );

      let batch =
        writeBatch(db);

      let operationCount = 0;

      let importedCount = 0;
      let skippedCount = 0;

      for (const row of rows) {
        const productName =
          String(
            row.Name || ""
          )
            .trim()
            .toLowerCase();

        // Skip duplicates
        if (
          existingProducts.has(
            productName
          )
        ) {
          skippedCount++;
          continue;
        }

        const productRef = doc(
          collection(
            db,
            "products"
          )
        );

       batch.set(productRef, {
  name: row.Name || "",

  tamilName: row.TamilName || "",

  category: row.Category || "",

  subcategory: row.Subcategory || "",

  description: row.Description || "",

  ingredients: row.Ingredients || "",

  usage: row.Usage || "",

  shelfLife: row.ShelfLife || "",

  storage: row.Storage || "",

  benefits: row.Benefits
    ? String(row.Benefits)
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean)
    : [],

  images: row.ImageURLs
    ? String(row.ImageURLs)
        .split(",")
        .map((img) => img.trim())
        .filter(Boolean)
    : [],

  variants: [
    {
      weight: row.Variant1Weight,
      price:
        Number(row.Variant1Price) || 0,
      stock:
        Number(row.Variant1Stock) || 0,
    },

    {
      weight: row.Variant2Weight,
      price:
        Number(row.Variant2Price) || 0,
      stock:
        Number(row.Variant2Stock) || 0,
    },

    {
      weight: row.Variant3Weight,
      price:
        Number(row.Variant3Price) || 0,
      stock:
        Number(row.Variant3Stock) || 0,
    },

    {
      weight: row.Variant4Weight,
      price:
        Number(row.Variant4Price) || 0,
      stock:
        Number(row.Variant4Stock) || 0,
    },
  ].filter((v) => v.weight),

  isActive: true,

  createdAt: Date.now(),
});

        existingProducts.add(
          productName
        );

        importedCount++;
        operationCount++;

        // Firestore limit
        if (
          operationCount >= 500
        ) {
          await batch.commit();

          batch =
            writeBatch(db);

          operationCount = 0;
        }
      }

      if (operationCount > 0) {
        await batch.commit();
      }

      alert(
        `Import Completed

Imported: ${importedCount}

Skipped (Duplicates): ${skippedCount}`
      );

      e.target.value = "";
    } catch (err) {
      console.error(err);

      alert(
        `Import Failed: ${err.message}`
      );
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-8 w-full min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">
          Products
        </h1>

        <div className="flex gap-3 items-center">

  {/* CATEGORY FILTER */}
  <select
    value={selectedCategory}
    onChange={(e) => {
      setSelectedCategory(
        e.target.value
      );

      setSelectedSubcategory("");
    }}
    className="border px-4 py-2 rounded bg-white"
  >
    <option value="">
      All Categories
    </option>

    {categories.map((cat) => (
      <option
        key={cat.id}
        value={cat.name}
      >
        {cat.name}
      </option>
    ))}
  </select>

  {/* SUBCATEGORY FILTER */}
  <select
    value={selectedSubcategory}
    onChange={(e) =>
      setSelectedSubcategory(
        e.target.value
      )
    }
    className="border px-4 py-2 rounded bg-white"
  >
    <option value="">
      All Subcategories
    </option>

    {filteredSubcategories.map(
      (sub) => (
        <option
          key={sub.id}
          value={sub.name}
        >
          {sub.name}
        </option>
      )
    )}
  </select>

  <button
    onClick={downloadTemplate}
    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
  >
    Download Template
  </button>

  <label className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded cursor-pointer">
    {importing
      ? "Importing..."
      : "Import Products"}

    <input
      type="file"
      accept=".xlsx,.xls"
      hidden
      onChange={importProducts}
    />
  </label>
</div>
      </div>

      <ProductList
  categories={categories}
  subcategories={
    subcategories
  }
  selectedCategory={
    selectedCategory
  }
  selectedSubcategory={
    selectedSubcategory
  }
/>
    </div>
  );
}