import { useState } from "react";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

export default function EditProductModal({
  product,
  closeModal,
  refreshProducts,
}) {

  const [form, setForm] =
    useState({

      ...product,

      images:
        product.images || [],

      variants:
        product.variants || [],
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
  // HANDLE IMAGE URL CHANGE
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
        "",
      ],
    });
  };

  // =========================
  // REMOVE IMAGE FIELD
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
  // UPDATE PRODUCT
  // =========================
  const handleUpdate =
    async () => {

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

        const productRef =
          doc(
            db,
            "products",
            product.id
          );

        await updateDoc(
          productRef,
          {

            name:
              form.name,

            category:
              form.category,

            description:
              form.description,

            images:
              form.images || [],

            variants:
              cleanVariants,
          }
        );

        alert(
          "Updated Successfully"
        );

        refreshProducts();

        closeModal();

      } catch (err) {

        console.error(err);

        alert(
          "Update Failed"
        );
      }
    };

  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">

      <div className="bg-white p-6 rounded w-[700px] max-h-[90vh] overflow-y-auto">

        <h2 className="text-3xl font-bold mb-6">
          Edit Product
        </h2>

        {/* BASIC INFO */}

        <div className="grid gap-4 mb-6">

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="border p-3 rounded"
          />

          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-3 rounded"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-3 rounded"
            rows="4"
          />

        </div>

        {/* IMAGES */}

        <h3 className="text-2xl font-bold mb-4">
          Product Images
        </h3>

        <div className="space-y-4 mb-6">

          {form.images?.map(
            (
              image,
              index
            ) => (

              <div
                key={index}
                className="flex gap-3"
              >

                <input
                  type="text"
                  placeholder={`Image URL ${index + 1}`}
                  value={image}
                  onChange={(e) =>
                    handleImageChange(
                      index,
                      e.target.value
                    )
                  }
                  className="border p-3 rounded w-full"
                />

                <button
                  onClick={() =>
                    removeImage(
                      index
                    )
                  }
                  className="bg-red-500 text-white px-4 rounded"
                >
                  Remove
                </button>

              </div>
            )
          )}

          <button
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

          {form.variants?.map(
            (
              variant,
              index
            ) => (

              <div
                key={index}
                className="grid grid-cols-4 gap-4"
              >

                <input
                  type="text"
                  placeholder="Weight"
                  value={
                    variant.weight
                  }
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
                  value={
                    variant.price
                  }
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
                  value={
                    variant.stock
                  }
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
                  onClick={() =>
                    removeVariant(
                      index
                    )
                  }
                  className="bg-red-500 text-white rounded px-4"
                >
                  Remove
                </button>

              </div>
            )
          )}

        </div>

        {/* ADD VARIANT */}

        <button
          onClick={addVariant}
          className="bg-gray-200 px-5 py-3 rounded mt-4"
        >
          + Add Variant
        </button>

        {/* ACTIONS */}

        <div className="flex gap-4 mt-8">

          <button
            onClick={handleUpdate}
            className="bg-black text-white p-3 rounded w-full"
          >
            Save Changes
          </button>

          <button
            onClick={closeModal}
            className="bg-gray-300 p-3 rounded w-full"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}