import { useState } from "react";

import {
  collection,
  addDoc,
} from "firebase/firestore";

import { db } from "../firebase";

export default function AddProduct({
  refreshProducts,
}) {

  const [form, setForm] =
    useState({

      name: "",
      category: "",
      description: "",
      imageUrl: "",

      variants: [
        {
          weight: "",
          price: "",
          stock: "",
        }
      ]
    });

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
  // SUBMIT
  // =========================
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

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

        await addDoc(
          collection(
            db,
            "products"
          ),
          {

            name:
              form.name,

            category:
              form.category,

            description:
              form.description,

            imageUrl:
              form.imageUrl,

            variants:
              cleanVariants,
          }
        );

        alert(
          "Product Added"
        );

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
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="border p-3 rounded"
          rows="4"
        />

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
              className="grid grid-cols-3 gap-4"
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