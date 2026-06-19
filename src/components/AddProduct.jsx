import { useState } from "react";

import {
  collection,
  addDoc,
} from "firebase/firestore";

import { db } from "../firebase";

export default function AddProduct({
  refreshProducts,
  categories,
  subcategories,
}) {
const [selectedCategory, setSelectedCategory] = useState("");
const [subcategoryId, setSubcategoryId] = useState("");
const [form, setForm] = useState({
  name: "",
  tamilName: "",

  category: "",
  description: "",

  benefits: "",
  ingredients: "",
  usage: "",
  shelfLife: "",

  images: [""],

  variants: [
    {
      weight: "",
      price: "",
      stock: "",
    }
  ]
});

    console.log("Selected Category:", selectedCategory);
    console.log("All Subcategories:", subcategories);
  // =========================
  // HANDLE BASIC FIELDS
  // =========================
  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,
    });
  };

  // =========================
  // HANDLE IMAGE CHANGE
  // =========================
  const handleImageChange = (
    index,
    value
  ) => {

    const updatedImages =
      [...form.images];

    updatedImages[index] =
      value;

    setForm({

      ...form,

      images:
        updatedImages,
    });
  };

  // =========================
  // ADD IMAGE FIELD
  // =========================
  const addImageField = () => {

    setForm({

      ...form,

      images: [
        ...form.images,
        ""
      ]
    });
  };

  // =========================
  // REMOVE IMAGE
  // =========================
  const removeImage = (
    index
  ) => {

    const updatedImages =
      form.images.filter(
        (_, i) =>
          i !== index
      );

    setForm({

      ...form,

      images:
        updatedImages,
    });
  };

  // =========================
  // HANDLE VARIANTS
  // =========================
  const handleVariantChange = (
    index,
    field,
    value
  ) => {

    const updatedVariants =
      [...form.variants];

    updatedVariants[index][field] =
      value;

    setForm({

      ...form,

      variants:
        updatedVariants,
    });
  };

  // =========================
  // ADD VARIANT
  // =========================
  const addVariant = () => {

    setForm({

      ...form,

      variants: [

        ...form.variants,

        {
          weight: "",
          price: "",
          stock: "",
        }

      ]
    });
  };

  // =========================
  // REMOVE VARIANT
  // =========================
  const removeVariant = (
    index
  ) => {

    const updatedVariants =
      form.variants.filter(
        (_, i) =>
          i !== index
      );

    setForm({

      ...form,

      variants:
        updatedVariants,
    });
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        // CLEAN VARIANTS
        const cleanVariants =
          form.variants.map(
            (variant) => ({

              weight:
                variant.weight,

              price:
                Number(
                  variant.price
                ),

              stock:
                Number(
                  variant.stock
                ),
            })
          );

        // REMOVE EMPTY IMAGES
        const cleanImages =
          form.images.filter(
            (img) =>
              img.trim() !== ""
          );

        // ADD TO FIRESTORE
        // ADD TO FIRESTORE
await addDoc(
  collection(db, "products"),
  {
    name: form.name,
    tamilName: form.tamilName,

    category: selectedCategory,

    subcategory:
      subcategories.find(
        (sub) => sub.id === subcategoryId
      )?.name || "",

    description: form.description,

    benefits: form.benefits
      .split("\n")
      .filter(Boolean),

    ingredients: form.ingredients,

    usage: form.usage,

    shelfLife: form.shelfLife,

    images: cleanImages,

    variants: cleanVariants,

    isActive: true,      // ADD THIS
    createdAt: Date.now() // OPTIONAL
  }
);

        alert(
          "Product Added Successfully"
        );
setSelectedCategory("");
setSubcategoryId("");
        // RESET FORM
        setForm({
  name: "",
  tamilName: "",

  category: "",
  description: "",

  benefits: "",
  ingredients: "",
  usage: "",
  shelfLife: "",

  images: [""],

  variants: [
    {
      weight: "",
      price: "",
      stock: "",
    }
  ]
});

        refreshProducts();

      } catch (err) {

        console.error(err);

        alert(
          "Error Adding Product"
        );
      }
    };

  return (

    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow mb-8"
    >

      <h2 className="text-3xl font-bold mb-6">
        Add Product
      </h2>

      {/* BASIC INFO */}

      <div className="grid gap-4 mb-6">

        <input
  type="text"
  name="name"
  placeholder="Product Name"
  value={form.name}
  onChange={handleChange}
  className="border p-3 rounded"
  required
/>

<input
  type="text"
  name="tamilName"
  placeholder="Tamil Name"
  value={form.tamilName}
  onChange={handleChange}
  className="border p-3 rounded"
/>

        <div className="mb-4">
  <label className="block mb-2 font-semibold">
    Category
  </label>

  <select
  value={selectedCategory}
  onChange={(e) => {
    setSelectedCategory(e.target.value);
    setSubcategoryId("");
  }}
    className="w-full border p-3 rounded"
  >
    <option value="">Select Category</option>

    {categories?.map((cat) => (
      <option key={cat.id} value={cat.name}>
  {cat.name}
</option>
    ))}
  </select>
</div>

<div className="mb-4">
  <label className="block mb-2 font-semibold">
    Subcategory
  </label>

  <select
  value={subcategoryId}
  onChange={(e) => setSubcategoryId(e.target.value)}
  className="w-full border p-3 rounded"
>
  <option value="">Select Subcategory</option>

  {subcategories
    ?.filter((sub) => sub.category === selectedCategory)
    .map((sub) => (
      <option key={sub.id} value={sub.id}>
        {sub.name}
      </option>
    ))}
</select>
</div>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-3 rounded"
          rows="4"
        />
<textarea
  name="benefits"
  placeholder="Benefits (one per line)"
  value={form.benefits}
  onChange={handleChange}
  className="border p-3 rounded"
  rows="4"
/>

<input
  type="text"
  name="ingredients"
  placeholder="Ingredients"
  value={form.ingredients}
  onChange={handleChange}
  className="border p-3 rounded"
/>

<input
  type="text"
  name="usage"
  placeholder="Usage"
  value={form.usage}
  onChange={handleChange}
  className="border p-3 rounded"
/>

<input
  type="text"
  name="shelfLife"
  placeholder="Shelf Life"
  value={form.shelfLife}
  onChange={handleChange}
  className="border p-3 rounded"
/>
      </div>

      {/* PRODUCT IMAGES */}

      <h3 className="text-2xl font-bold mb-4">
        Product Images
      </h3>

      <div className="space-y-4 mb-6">

        {form.images.map(
          (img, index) => (

            <div
              key={index}
              className="flex gap-3"
            >

              <input
                type="text"
                placeholder="Image URL"
                value={img}
                onChange={(e) =>
                  handleImageChange(
                    index,
                    e.target.value
                  )
                }
                className="border p-3 rounded w-full"
              />

              <button
                type="button"
                onClick={() =>
                  removeImage(index)
                }
                className="bg-red-500 text-white px-4 rounded"
              >
                Remove
              </button>

            </div>
          )
        )}

        <button
          type="button"
          onClick={addImageField}
          className="bg-gray-200 px-5 py-3 rounded"
        >
          + Add Image
        </button>

      </div>

      {/* VARIANTS */}

      <h3 className="text-2xl font-bold mb-4">
        Variants
      </h3>

      <div className="space-y-4">

        {form.variants.map(
          (variant, index) => (

            <div
              key={index}
              className="grid grid-cols-4 gap-4"
            >

              <input
                type="text"
                placeholder="Weight"
                value={variant.weight}
                onChange={(e) =>
                  handleVariantChange(
                    index,
                    "weight",
                    e.target.value
                  )
                }
                className="border p-3 rounded"
              />

              <input
                type="number"
                placeholder="Price"
                value={variant.price}
                onChange={(e) =>
                  handleVariantChange(
                    index,
                    "price",
                    e.target.value
                  )
                }
                className="border p-3 rounded"
              />

              <input
                type="number"
                placeholder="Stock"
                value={variant.stock}
                onChange={(e) =>
                  handleVariantChange(
                    index,
                    "stock",
                    e.target.value
                  )
                }
                className="border p-3 rounded"
              />

              <button
                type="button"
                onClick={() =>
                  removeVariant(index)
                }
                className="bg-red-500 text-white rounded px-4"
              >
                Remove
              </button>

            </div>
          )
        )}

      </div>

      {/* ADD VARIANT BUTTON */}

      <button
        type="button"
        onClick={addVariant}
        className="bg-gray-200 px-5 py-3 rounded mt-4"
      >
        + Add Variant
      </button>

      {/* SUBMIT */}

      <div>

        <button
          type="submit"
          className="bg-black text-white px-8 py-3 rounded mt-6"
        >
          Add Product
        </button>

      </div>

    </form>
  );
}