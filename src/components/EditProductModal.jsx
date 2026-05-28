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
  // IMAGE GALLERY STATE
  // =========================
  const [selectedImage, setSelectedImage] =
    useState(
      product.images?.[0] || ""
    );

  const [showGallery, setShowGallery] =
    useState(false);

  // =========================
  // ZOOM STATE
  // =========================
  const [zoom, setZoom] =
    useState(1);

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

    // UPDATE SELECTED IMAGE
    if (
      selectedImage ===
      form.images[index]
    ) {

      setSelectedImage(
        value
      );
    }
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

    // RESET SELECTED IMAGE
    if (
      selectedImage ===
      form.images[index]
    ) {

      setSelectedImage(
        updatedImages[0] || ""
      );
    }
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
              cleanImages,

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

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">

      <div className="bg-white p-6 rounded w-full max-w-4xl max-h-[95vh] overflow-y-auto">

        <h2 className="text-3xl font-bold mb-6">
          Edit Product
        </h2>

        {/* IMAGE PREVIEW */}

        {selectedImage && (

          <div className="mb-6">

            <img
              src={selectedImage}
              alt="Preview"
              onClick={() => {

                setShowGallery(true);

                setZoom(1);
              }}
              className="
                w-full
                max-h-[400px]
                object-contain
                rounded-lg
                border
                cursor-pointer
                transition
                duration-300
                hover:scale-105
              "
            />

            <p className="text-sm text-gray-500 mt-2">
              Click image to open fullscreen
            </p>

          </div>
        )}

        {/* THUMBNAILS */}

        <div className="flex gap-3 mb-8 flex-wrap">

          {form.images?.map(
            (
              image,
              index
            ) => (

              image && (

                <img
                  key={index}
                  src={image}
                  alt="thumb"
                  onClick={() =>
                    setSelectedImage(
                      image
                    )
                  }
                  className={`
                    w-24
                    h-24
                    object-cover
                    rounded
                    border-2
                    cursor-pointer
                    p-1

                    ${
                      selectedImage === image
                        ? "border-black"
                        : "border-gray-300"
                    }
                  `}
                />

              )
            )
          )}

        </div>

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
                  type="button"
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
                  type="button"
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
          type="button"
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

      {/* FULLSCREEN GALLERY */}

      {showGallery && (

        <div
          className="
            fixed
            inset-0
            bg-black/95
            z-[100]
            flex
            items-center
            justify-center
            overflow-hidden
          "
        >

          {/* CLOSE BUTTON */}

          <button
            onClick={() =>
              setShowGallery(false)
            }
            className="
              absolute
              top-5
              right-5
              text-white
              text-5xl
              font-bold
              z-50
            "
          >
            ×
          </button>

          {/* ZOOM CONTROLS */}

          <div
            className="
              absolute
              top-5
              left-5
              flex
              gap-3
              z-50
            "
          >

            {/* ZOOM IN */}

            <button
              onClick={() =>
                setZoom(
                  (prev) =>
                    prev + 0.2
                )
              }
              className="
                bg-white
                text-black
                px-4
                py-2
                rounded-lg
                text-2xl
                font-bold
              "
            >
              +
            </button>

            {/* ZOOM OUT */}

            <button
              onClick={() =>
                setZoom(
                  (prev) =>
                    Math.max(
                      1,
                      prev - 0.2
                    )
                )
              }
              className="
                bg-white
                text-black
                px-4
                py-2
                rounded-lg
                text-2xl
                font-bold
              "
            >
              -
            </button>

          </div>

          {/* IMAGE CONTAINER */}

          <div
            className="
              overflow-auto
              w-full
              h-full
              flex
              items-center
              justify-center
              p-10
            "
          >

            <img
              src={selectedImage}
              alt="Fullscreen"
              style={{
                transform: `scale(${zoom})`,
              }}
              className="
                max-w-full
                max-h-[85vh]
                object-contain
                transition-transform
                duration-200
              "
            />

          </div>

          {/* THUMBNAILS */}

          <div
            className="
              absolute
              bottom-5
              left-0
              right-0
              flex
              justify-center
              gap-3
              overflow-x-auto
              px-4
            "
          >

            {form.images?.map(
              (
                image,
                index
              ) => (

                image && (

                  <img
                    key={index}
                    src={image}
                    alt="thumb"
                    onClick={() => {

                      setSelectedImage(
                        image
                      );

                      setZoom(1);
                    }}
                    className={`
                      w-20
                      h-20
                      object-cover
                      rounded
                      cursor-pointer
                      border-2

                      ${
                        selectedImage === image
                          ? "border-white"
                          : "border-gray-500"
                      }
                    `}
                  />

                )
              )
            )}

          </div>

        </div>
      )}

    </div>
  );
}