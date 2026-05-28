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

      // MULTIPLE IMAGES
      images: [""],

      // VARIANTS
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

            images:
              cleanImages,

            variants:
              cleanVariants,
          }
        );

        alert(
          "Product Added Successfully"
        );

        // RESET FORM
        setForm({

          name: "",
          category: "",
          description: "",

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
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-3 rounded"
          rows="4"
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